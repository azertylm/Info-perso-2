package fr.alphabette.security

import android.content.Context
import android.content.SharedPreferences
import android.os.Build
import android.provider.Settings
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.util.concurrent.TimeUnit

/**
 * ALPHABETTE SASU — Module de Sécurité Mobile Android (Google Play Store)
 * 1. Stockage chiffré matériel via Android Keystore (AES-256 GCM)
 * 2. Épinglage de certificat HTTPS (Certificate Pinning)
 * 3. Gestion automatique du Refresh Token avec rotation transparente lors d'une 401
 */
class AlphabetteAuthSecurity private constructor(context: Context) {

    companion object {
        private const val PREFS_FILE = "alphabette_secure_auth_prefs"
        private const val KEY_ACCESS_TOKEN = "jwt_access_token"
        private const val KEY_REFRESH_TOKEN = "jwt_refresh_token"
        private const val KEY_DEVICE_ID = "hardware_device_fingerprint"
        
        const val BASE_AUTH_URL = "https://auth.alphabette.fr"
        const val APP_ID = "infoperso" // ou "iadebat", "oeildelatelier"

        @Volatile
        private var INSTANCE: AlphabetteAuthSecurity? = null

        fun getInstance(context: Context): AlphabetteAuthSecurity {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: AlphabetteAuthSecurity(context.applicationContext).also { INSTANCE = it }
            }
        }
    }

    private val securePrefs: SharedPreferences

    init {
        // Initialisation de la clé maîtresse dans l'Android Keystore
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        // Stockage chiffré des jetons (chiffrement matériel matériel)
        securePrefs = EncryptedSharedPreferences.create(
            context,
            PREFS_FILE,
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )

        // Génération / conservation de l'empreinte matérielle persistante
        if (!securePrefs.contains(KEY_DEVICE_ID)) {
            val androidId = Settings.Secure.getString(context.contentResolver, Settings.Secure.ANDROID_ID)
            val fingerprint = "${Build.MANUFACTURER}_${Build.MODEL}_$androidId".hashCode().toString()
            securePrefs.edit().putString(KEY_DEVICE_ID, fingerprint).apply()
        }
    }

    fun saveTokens(accessToken: String, refreshToken: String) {
        securePrefs.edit()
            .putString(KEY_ACCESS_TOKEN, accessToken)
            .putString(KEY_REFRESH_TOKEN, refreshToken)
            .apply()
    }

    fun getAccessToken(): String? = securePrefs.getString(KEY_ACCESS_TOKEN, null)
    fun getRefreshToken(): String? = securePrefs.getString(KEY_REFRESH_TOKEN, null)
    fun getDeviceFingerprint(): String = securePrefs.getString(KEY_DEVICE_ID, "unknown_device") ?: "unknown_device"

    fun clearTokens() {
        securePrefs.edit()
            .remove(KEY_ACCESS_TOKEN)
            .remove(KEY_REFRESH_TOKEN)
            .apply()
    }

    /**
     * Client HTTP OkHttp durci avec Certificate Pinning et Authenticator automatique
     */
    fun createSecureHttpClient(): OkHttpClient {
        // 1. Épinglage de certificat pour parer aux attaques Man-In-The-Middle
        val certificatePinner = CertificatePinner.Builder()
            .add("auth.alphabette.fr", "sha256/14:6D:E9:48:38:62:38:53:77:E2:B0:96:A2:3B:56:45:94:DA:63:F7:83:8E:22:96:06:54:6F:09:A6:49:1C:18")
            .add("*.alphabette.fr", "sha256/14:6D:E9:48:38:62:38:53:77:E2:B0:96:A2:3B:56:45:94:DA:63:F7:83:8E:22:96:06:54:6F:09:A6:49:1C:18")
            .build()

        return OkHttpClient.Builder()
            .certificatePinner(certificatePinner)
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            // Intercepteur pour injecter automatiquement le token et les métadonnées
            .addInterceptor { chain ->
                val original = chain.request()
                val requestBuilder = original.newBuilder()
                    .header("X-Alphabette-App-Id", APP_ID)
                    .header("X-Device-Id", getDeviceFingerprint())
                    .header("Accept", "application/json")

                getAccessToken()?.let { token ->
                    requestBuilder.header("Authorization", "Bearer $token")
                }

                chain.proceed(requestBuilder.build())
            }
            // Authenticator automatique en cas de réponse HTTP 401 (Expiration du token)
            .authenticator(object : Authenticator {
                override fun authenticate(route: Route?, response: Response): Request? {
                    // Éviter les boucles infinies de rafraîchissement
                    if (responseCount(response) >= 2) return null

                    synchronized(this) {
                        val currentRefreshToken = getRefreshToken() ?: return null
                        
                        // Appel synchrone au endpoint /auth/refresh
                        val refreshClient = OkHttpClient.Builder().certificatePinner(certificatePinner).build()
                        val jsonBody = JSONObject().apply {
                            put("refreshToken", currentRefreshToken)
                            put("deviceFingerprint", getDeviceFingerprint())
                        }

                        val refreshRequest = Request.Builder()
                            .url("$BASE_AUTH_URL/auth/refresh")
                            .post(jsonBody.toString().toRequestBody("application/json".toMediaType()))
                            .build()

                        try {
                            val refreshResponse = refreshClient.newCall(refreshRequest).execute()
                            if (refreshResponse.isSuccessful) {
                                val bodyStr = refreshResponse.body?.string() ?: return null
                                val json = JSONObject(bodyStr)
                                val newAccess = json.getString("accessToken")
                                val newRefresh = json.getString("refreshToken")

                                // Sauvegarde chiffrée des nouveaux jetons tournés
                                saveTokens(newAccess, newRefresh)

                                // Rejeu automatique de la requête initiale avec le nouveau token
                                return response.request.newBuilder()
                                    .header("Authorization", "Bearer $newAccess")
                                    .build()
                            } else {
                                // Refresh token invalide ou révoqué -> déconnexion forcée
                                clearTokens()
                                return null
                            }
                        } catch (e: IOException) {
                            return null
                        }
                    }
                }
            })
            .build()
    }

    private fun responseCount(response: Response): Int {
        var count = 1
        var prior = response.priorResponse
        while (prior != null) {
            count++
            prior = prior.priorResponse
        }
        return count
    }
}
