import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyJwt from "@fastify/jwt";
import rateLimit from "@fastify/rate-limit";
import { Pool } from "pg";
import Redis from "ioredis";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { z } from "zod";

// ============================================================================
// ALPHABETTE SASU — SSO & AUTHENTIFICATION CENTRALISÉE (Fastify / TypeScript)
// Architecture Souveraine & Sécurisée pour VPS OVH Ubuntu 24.04 LTS
// Tarification : 15 €/an (app unitaire) ou 40 €/an (Pass ALPHABETTE intégral)
// ============================================================================

const PORT = Number(process.env.PORT) || 4000;
const HOST = process.env.HOST || "0.0.0.0";

// Connexion Base de Données PostgreSQL
const db = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://alphabette_admin:alphabette_secret@localhost:5432/alphabette_central",
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Connexion Redis (Blacklist des révocations & sessions)
const redis = new Redis(process.env.REDIS_URL || "redis://:redis_secret@localhost:6379/0", {
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => Math.min(times * 100, 2000),
});

const app: FastifyInstance = Fastify({
  logger: {
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    serializers: {
      req(req) {
        return {
          method: req.method,
          url: req.url,
          remoteAddress: req.ip,
          appId: req.headers["x-alphabette-app-id"],
        };
      },
    },
  },
  trustProxy: true, // Requis derrière le reverse proxy Traefik / Coolify
});

// En-têtes de sécurité HTTP
app.register(helmet, {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
});

// Gestion stricte des origines CORS (alphabette.fr + 15 domaines secondaires .fr)
app.register(cors, {
  origin: (origin, cb) => {
    // Les applications mobiles Android natives n'envoient pas toujours de header Origin
    if (!origin) return cb(null, true);
    
    const allowedRegex = /^https:\/\/([a-zA-Z0-9-]+\.)*(alphabette\.fr|infoperso\.fr|iadebat\.fr|oeildelatelier\.fr)$/;
    if (allowedRegex.test(origin) || origin === "http://localhost:3000") {
      cb(null, true);
    } else {
      cb(new Error("CORS non autorisé"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Alphabette-App-Id", "X-Device-Id"],
});

// Limitation de débit (Rate Limiting anti brute-force)
app.register(rateLimit, {
  max: 100, // 100 requêtes / minute par défaut
  timeWindow: "1 minute",
  redis: redis,
  keyGenerator: (req) => `${req.ip}:${req.headers["x-alphabette-app-id"] || "anonymous"}`,
});

// Configuration JWT Asymétrique ou Symétrique
const JWT_SECRET = process.env.JWT_PRIVATE_KEY_PEM || process.env.JWT_SECRET || "alphabette-super-secret-key-development-minimum-32-chars";
app.register(fastifyJwt, {
  secret: JWT_SECRET,
  sign: {
    issuer: "https://auth.alphabette.fr",
    expiresIn: "15m", // Durée de vie courte pour l'Access Token
  },
});

// Schémas de validation Zod
const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(10).max(128),
  fullName: z.string().min(2).max(100).optional(),
  appId: z.string().min(1),
  clientType: z.enum(["android", "web"]),
  deviceFingerprint: z.string().min(8),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  appId: z.string().min(1),
  clientType: z.enum(["android", "web"]),
  deviceFingerprint: z.string().min(8),
});

const RefreshSchema = z.object({
  refreshToken: z.string().min(32),
  deviceFingerprint: z.string().min(8),
});

// Middleware d'authentification par JWT
app.decorate("authenticate", async function (req: FastifyRequest, reply: FastifyReply) {
  try {
    await req.jwtVerify();
    // Vérification de la blacklist Redis
    const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (token) {
      const isBlacklisted = await redis.get(`bl:${token}`);
      if (isBlacklisted) {
        return reply.status(401).send({ error: "Session révoquée, veuillez vous reconnecter" });
      }
    }
  } catch (err) {
    return reply.status(401).send({ error: "Jeton JWT expiré ou invalide" });
  }
});

// ----------------------------------------------------------------------------
// ENDPOINTS PUBLICS & SSO
// ----------------------------------------------------------------------------

// Santé du service
app.get("/health", async () => {
  return { status: "UP", timestamp: new Date().toISOString(), service: "alphabette-auth-sso" };
});

// Fichier Android Digital Asset Links directement accessible
app.get("/.well-known/assetlinks.json", async (_, reply) => {
  reply.header("Content-Type", "application/json");
  return [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "fr.alphabette.infoperso",
        sha256_cert_fingerprints: ["14:6D:E9:48:38:62:38:53:77:E2:B0:96:A2:3B:56:45:94:DA:63:F7:83:8E:22:96:06:54:6F:09:A6:49:1C:18"]
      }
    },
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "fr.alphabette.iadebat",
        sha256_cert_fingerprints: ["14:6D:E9:48:38:62:38:53:77:E2:B0:96:A2:3B:56:45:94:DA:63:F7:83:8E:22:96:06:54:6F:09:A6:49:1C:18"]
      }
    }
  ];
});

// Inscription unique centralisée
app.post("/auth/register", async (req, reply) => {
  const parseResult = RegisterSchema.safeParse(req.body);
  if (!parseResult.success) {
    return reply.status(400).send({ error: "Paramètres invalides", details: parseResult.error.format() });
  }

  const { email, password, fullName, appId, clientType, deviceFingerprint } = parseResult.data;
  const normalizedEmail = email.toLowerCase().trim();

  // Vérifier existence de l'application
  const appCheck = await db.query("SELECT app_id FROM auth_sso.applications WHERE app_id = $1 AND is_active = TRUE", [appId]);
  if (appCheck.rowCount === 0) {
    return reply.status(400).send({ error: "Application Alphabette non reconnue ou désactivée" });
  }

  // Vérifier doublon email
  const existing = await db.query("SELECT id FROM auth_sso.users WHERE email = $1", [normalizedEmail]);
  if (existing.rowCount && existing.rowCount > 0) {
    return reply.status(409).send({ error: "Un compte Alphabette existe déjà avec cette adresse email" });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const client = await db.connect();
  try {
    await client.query("BEGIN");
    const insertUser = await client.query(
      `INSERT INTO auth_sso.users (email, password_hash, full_name)
       VALUES ($1, $2, $3)
       RETURNING id, email, full_name, role`,
      [normalizedEmail, passwordHash, fullName || null]
    );
    const user = insertUser.rows[0];

    // Génération Refresh Token
    const rawRefreshToken = crypto.randomBytes(40).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 jours

    await client.query(
      `INSERT INTO auth_sso.refresh_tokens (user_id, token_hash, client_type, app_id, device_fingerprint, ip_address, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user.id, tokenHash, clientType, appId, deviceFingerprint, req.ip, expiresAt]
    );

    await client.query("COMMIT");

    const accessToken = app.jwt.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
      appId,
    });

    return reply.status(201).send({
      message: "Compte unique Alphabette créé avec succès",
      user: { id: user.id, email: user.email, fullName: user.full_name },
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 900,
    });
  } catch (err: any) {
    await client.query("ROLLBACK");
    app.log.error(err);
    return reply.status(500).send({ error: "Erreur serveur lors de la création du compte" });
  } finally {
    client.release();
  }
});

// Connexion unique centralisée (Login) avec Rate Limit strict
app.post("/auth/login", {
  config: {
    rateLimit: {
      max: 5, // 5 tentatives / minute max
      timeWindow: "1 minute",
    },
  },
}, async (req, reply) => {
  const parseResult = LoginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return reply.status(400).send({ error: "Identifiants invalides", details: parseResult.error.format() });
  }

  const { email, password, appId, clientType, deviceFingerprint } = parseResult.data;
  const normalizedEmail = email.toLowerCase().trim();

  const userRes = await db.query(
    `SELECT id, email, password_hash, full_name, role, is_suspended, failed_login_attempts, lockout_until
     FROM auth_sso.users WHERE email = $1`,
    [normalizedEmail]
  );

  if (userRes.rowCount === 0) {
    return reply.status(401).send({ error: "Email ou mot de passe incorrect" });
  }

  const user = userRes.rows[0];

  // Vérification de blocage temporaire
  if (user.lockout_until && new Date(user.lockout_until) > new Date()) {
    return reply.status(429).send({ error: "Compte temporairement verrouillé suite à plusieurs échecs. Réessayez plus tard." });
  }

  if (user.is_suspended) {
    return reply.status(403).send({ error: "Ce compte a été suspendu par l'administration" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password_hash);
  if (!isValidPassword) {
    const attempts = user.failed_login_attempts + 1;
    let lockout: Date | null = null;
    if (attempts >= 5) {
      lockout = new Date(Date.now() + 15 * 60 * 1000); // 15 min de verrouillage
    }
    await db.query(
      "UPDATE auth_sso.users SET failed_login_attempts = $1, lockout_until = $2 WHERE id = $3",
      [attempts, lockout, user.id]
    );
    return reply.status(401).send({ error: "Email ou mot de passe incorrect" });
  }

  // Réinitialiser les compteurs d'échec
  await db.query(
    "UPDATE auth_sso.users SET failed_login_attempts = 0, lockout_until = NULL, last_login_at = NOW() WHERE id = $1",
    [user.id]
  );

  // Rotation de Refresh Token
  const rawRefreshToken = crypto.randomBytes(40).toString("hex");
  const tokenHash = crypto.createHash("sha256").update(rawRefreshToken).digest("hex");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.query(
    `INSERT INTO auth_sso.refresh_tokens (user_id, token_hash, client_type, app_id, device_fingerprint, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [user.id, tokenHash, clientType, appId, deviceFingerprint, req.ip, expiresAt]
  );

  // Récupérer les abonnements actifs de l'utilisateur
  const subRes = await db.query(
    `SELECT plan_type, app_id, expires_at 
     FROM auth_sso.subscriptions 
     WHERE user_id = $1 AND is_active = TRUE AND expires_at > NOW()`,
    [user.id]
  );

  const hasPassAlphabette = subRes.rows.some((s) => s.plan_type === "pass_alphabette");
  const hasAppAccess = hasPassAlphabette || subRes.rows.some((s) => s.app_id === appId);

  const accessToken = app.jwt.sign({
    sub: user.id,
    email: user.email,
    role: user.role,
    appId,
    hasPassAlphabette,
    hasAppAccess,
  });

  return reply.send({
    message: "Connexion réussie",
    accessToken,
    refreshToken: rawRefreshToken,
    expiresIn: 900,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
    entitlements: {
      hasPassAlphabette,
      hasAppAccess,
      subscriptions: subRes.rows,
    },
  });
});

// Rafraîchissement sécurisé de jeton avec détection d'attaque par rejeu (Refresh Token Rotation)
app.post("/auth/refresh", async (req, reply) => {
  const parseResult = RefreshSchema.safeParse(req.body);
  if (!parseResult.success) {
    return reply.status(400).send({ error: "Paramètres invalides" });
  }

  const { refreshToken, deviceFingerprint } = parseResult.data;
  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const tokenRes = await db.query(
    `SELECT id, user_id, client_type, app_id, device_fingerprint, is_revoked, expires_at 
     FROM auth_sso.refresh_tokens WHERE token_hash = $1`,
    [tokenHash]
  );

  if (tokenRes.rowCount === 0) {
    return reply.status(401).send({ error: "Refresh token inconnu ou inexistant" });
  }

  const storedToken = tokenRes.rows[0];

  // ALERTE DE SÉCURITÉ : Détection de réutilisation d'un jeton déjà révoqué (Replay Attack)
  if (storedToken.is_revoked) {
    // Révocation immédiate de toutes les sessions de l'utilisateur par mesure de sécurité
    await db.query("UPDATE auth_sso.refresh_tokens SET is_revoked = TRUE WHERE user_id = $1", [storedToken.user_id]);
    await db.query(
      `INSERT INTO auth_sso.audit_events (user_id, app_id, event_type, ip_address, details)
       VALUES ($1, $2, 'replay_attack_detected', $3, $4)`,
      [storedToken.user_id, storedToken.app_id, req.ip, JSON.stringify({ tokenHash })]
    );
    return reply.status(401).send({ error: "Violation de sécurité détectée : session invalidée pour votre protection" });
  }

  if (new Date(storedToken.expires_at) < new Date()) {
    return reply.status(401).send({ error: "Session expirée, veuillez vous reconnecter" });
  }

  // Vérification de cohérence de l'appareil
  if (storedToken.device_fingerprint !== deviceFingerprint) {
    return reply.status(401).send({ error: "Discordance d'appareil détectée" });
  }

  // Révocation du refresh token consommé
  await db.query("UPDATE auth_sso.refresh_tokens SET is_revoked = TRUE, revoked_at = NOW() WHERE id = $1", [storedToken.id]);

  // Génération du nouveau refresh token (Rotation)
  const newRawRefreshToken = crypto.randomBytes(40).toString("hex");
  const newTokenHash = crypto.createHash("sha256").update(newRawRefreshToken).digest("hex");
  const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await db.query(
    `INSERT INTO auth_sso.refresh_tokens (user_id, token_hash, client_type, app_id, device_fingerprint, ip_address, expires_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [storedToken.user_id, newTokenHash, storedToken.client_type, storedToken.app_id, deviceFingerprint, req.ip, newExpiresAt]
  );

  const userRes = await db.query("SELECT id, email, role FROM auth_sso.users WHERE id = $1", [storedToken.user_id]);
  const user = userRes.rows[0];

  const subRes = await db.query(
    `SELECT plan_type, app_id FROM auth_sso.subscriptions 
     WHERE user_id = $1 AND is_active = TRUE AND expires_at > NOW()`,
    [user.id]
  );
  const hasPassAlphabette = subRes.rows.some((s) => s.plan_type === "pass_alphabette");
  const hasAppAccess = hasPassAlphabette || subRes.rows.some((s) => s.app_id === storedToken.app_id);

  const accessToken = app.jwt.sign({
    sub: user.id,
    email: user.email,
    role: user.role,
    appId: storedToken.app_id,
    hasPassAlphabette,
    hasAppAccess,
  });

  return reply.send({
    accessToken,
    refreshToken: newRawRefreshToken,
    expiresIn: 900,
  });
});

// Déconnexion (Logout) avec blacklistage immédiat
app.post("/auth/logout", { preHandler: [(app as any).authenticate] }, async (req, reply) => {
  const token = req.headers.authorization?.replace(/^Bearer\s+/i, "");
  const user = (req as any).user;

  if (token) {
    // Inscription en blacklist Redis pour la durée de validité restante (max 15 min)
    await redis.setex(`bl:${token}`, 900, "1");
  }

  // Révocation des refresh tokens associés
  await db.query("UPDATE auth_sso.refresh_tokens SET is_revoked = TRUE, revoked_at = NOW() WHERE user_id = $1", [user.sub]);

  return reply.send({ message: "Déconnexion réussie sur l'écosystème Alphabette" });
});

// Vérification des droits d'abonnement (15 €/an unitaire ou 40 €/an Pass)
app.get("/auth/subscriptions", { preHandler: [(app as any).authenticate] }, async (req, reply) => {
  const user = (req as any).user;
  const appId = req.headers["x-alphabette-app-id"] as string;

  const subRes = await db.query(
    `SELECT id, plan_type, app_id, amount_cents, starts_at, expires_at, is_active
     FROM auth_sso.subscriptions
     WHERE user_id = $1 AND is_active = TRUE AND expires_at > NOW()
     ORDER BY expires_at DESC`,
    [user.sub]
  );

  const hasPass = subRes.rows.some((s) => s.plan_type === "pass_alphabette");
  const hasAppAccess = hasPass || (appId ? subRes.rows.some((s) => s.app_id === appId) : false);

  return reply.send({
    userId: user.sub,
    hasPassAlphabette: hasPass,
    hasAppAccess,
    activeSubscriptions: subRes.rows,
    catalogPricing: {
      singleAppAnnualPriceTtc: 15.00,
      passAlphabetteAnnualPriceTtc: 40.00,
      currency: "EUR",
      terms: "Facturation annuelle sans engagement ni prélèvement forcé intermédiaire."
    }
  });
});

// Démarrage du serveur Fastify
async function start() {
  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`[ALPHABETTE SSO] Serveur actif sur http://${HOST}:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  start();
}

export default app;
