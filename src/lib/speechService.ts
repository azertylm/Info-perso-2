/**
 * Service de Synthèse Vocale Haute Fidélité pour InfoPerso / ALPHABETTE SASU
 * - Double moteur : Google Speech / Gemini Neural TTS (Studio HD) + Repli vocal système haute définition
 * - Normalisation phonétique française intégrale (chiffres, devises, pourcentages, dates en toutes lettres)
 * - Gestion granulaire de la vitesse de lecture (0.75x à 2.0x) modifiable en direct
 * - Cache local persistant IndexedDB pour écoute instantanée (0 ms) et hors-ligne
 */

import { NewsArticle, VoiceProfile } from "../types";
import { normalizeFrenchPhonetics } from "./phoneticNormalizer";
import { getCachedAudio, saveCachedAudio, computeAudioHash } from "./podcastAudioCache";
import { cleanArticleContent } from "./articleEnricher";
import { getActiveVoiceProfile } from "./voiceProfiles";

export type AudioEngineType = "google_gemini" | "google_studio" | "browser_neural" | "browser_fallback";

export interface SpeechPlayOptions {
  article: NewsArticle;
  speed: number;
  voiceProfile?: VoiceProfile;
  voiceGender?: "female" | "male";
  apiKey?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onStart?: (engine: AudioEngineType, voiceLabel: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
  onPause?: () => void;
  onResume?: () => void;
}

class ArticleSpeechManager {
  private currentAudio: HTMLAudioElement | null = null;
  private currentUtteranceList: SpeechSynthesisUtterance[] = [];
  private currentUtteranceIndex = 0;
  private isSynthesizing = false;
  private isPaused = false;
  private currentSpeed = 1.0;
  private currentEngine: AudioEngineType = "google_gemini";
  private timeUpdateInterval: any = null;
  private activeArticleId: string | number | null = null;

  /**
   * Nettoie et prépare le texte de l'article pour une diction fluide et vivante
   */
  public prepareTextForSpeech(article: NewsArticle): string {
    const title = (article.title || "").trim();
    const source = (article.source || "").trim();
    const summary = (article.summary || "").trim();
    const rawContent = cleanArticleContent(article.content, title, summary);

    // Supprimer balises markdown, liens web, métadonnées
    const cleanBody = rawContent
      .replace(/###\s*[^\n]+/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[*_#>`~]/g, "")
      .replace(/\n+/g, " ")
      .trim();

    // Assemblage d'un conducteur radiophonique naturel
    let script = "";
    if (source) {
      script += `Chronique Info-Perso d'après ${source}. `;
    } else {
      script += `Chronique Info-Perso. `;
    }
    script += `${title}. `;
    if (summary && !cleanBody.includes(summary.slice(0, 40))) {
      script += `${summary}. `;
    }
    script += cleanBody;

    // Normalisation phonétique des nombres, devises (€, $), pourcentages et acronymes
    return normalizeFrenchPhonetics(script);
  }

  /**
   * Sélectionne la voix française la plus naturelle et expressive sur le navigateur
   */
  public getBestSystemVoice(): SpeechSynthesisVoice | null {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return null;
    }
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Google Speech voix naturelles françaises
    const googleVoice = voices.find(
      (v) =>
        (v.name.includes("Google") || v.name.includes("Natural")) &&
        (v.lang.startsWith("fr") || v.lang.includes("FR"))
    );
    if (googleVoice) return googleVoice;

    // 2. Voix premium / améliorées (Apple Thomas Enhanced, Amélie, Microsoft Henri Natural)
    const enhancedVoice = voices.find(
      (v) =>
        (v.name.includes("Enhanced") || v.name.includes("Premium") || v.name.includes("Natural") || v.name.includes("Siri")) &&
        (v.lang.startsWith("fr") || v.lang.includes("FR"))
    );
    if (enhancedVoice) return enhancedVoice;

    // 3. N'importe quelle voix française native
    const standardFrench = voices.find((v) => v.lang.startsWith("fr") || v.lang.includes("FR"));
    if (standardFrench) return standardFrench;

    return voices[0] || null;
  }

  /**
   * Démarre la lecture de l'article avec priorité au moteur Google Speech Studio HD
   */
  public async play(options: SpeechPlayOptions): Promise<void> {
    this.stop();

    const { article, speed, voiceProfile, voiceGender, apiKey, onTimeUpdate, onStart, onEnd, onError } = options;
    const profile = voiceProfile || getActiveVoiceProfile();
    const effectiveGender = profile.gender === "male" ? "male" : "female";
    this.currentSpeed = (speed || 1.0) * (profile.speakingRateMultiplier || 1.0);
    this.activeArticleId = article.id;
    this.isPaused = false;

    const speechText = this.prepareTextForSpeech(article);
    const textHash = await computeAudioHash(`${speechText}_${profile.id}_${profile.geminiStylePrompt}_${effectiveGender}`);

    // Étape 1 : Vérification dans le cache IndexedDB local (0 ms)
    try {
      const cached = await getCachedAudio(textHash);
      if (cached && cached.audioBase64) {
        this.playHtmlAudio(
          cached.audioBase64,
          cached.mimeType || "audio/mp3",
          this.currentSpeed,
          "google_studio",
          `${profile.name} (Cache Local)`,
          onTimeUpdate,
          onStart,
          onEnd,
          onError
        );
        return;
      }
    } catch (_) {}

    // Étape 2 : Tentative via le serveur Google Speech / Gemini Neural TTS avec profil vocal
    try {
      const ttsPayload = {
        text: speechText.slice(0, 2800), // Segment condensé haute fidélité
        speed: 1.0, // La vitesse est modulée en direct par playbackRate
        voiceGender: effectiveGender,
        voiceProfileId: profile.id,
        voiceStylePrompt: profile.geminiStylePrompt,
        customVoiceName: profile.name,
        pitch: profile.pitchSemiTones,
        apiKey
      };

      const res = await fetch("/api/audio/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ttsPayload)
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioBase64) {
          // Sauvegarder dans le cache local IndexedDB pour les prochaines écoutes
          saveCachedAudio(textHash, data.audioBase64, data.mimeType || "audio/mp3").catch(() => {});

          const engineLabel = data.voiceLabel || (data.source === "google_gemini_tts"
            ? `Google Gemini TTS — ${profile.name}`
            : `Google Speech Studio HD — ${profile.name}`);

          this.playHtmlAudio(
            data.audioBase64,
            data.mimeType || "audio/mp3",
            this.currentSpeed,
            data.source === "google_gemini_tts" ? "google_gemini" : "google_studio",
            engineLabel,
            onTimeUpdate,
            onStart,
            onEnd,
            onError
          );
          return;
        }
      }
    } catch (netErr) {
      console.warn("[SpeechService] Serveur audio inaccessible, repli vers la synthèse vocale système...", netErr);
    }

    // Étape 3 : Repli fluide vers la synthèse vocale du navigateur avec la meilleure voix française et adaptation du pitch
    this.playBrowserSpeech(speechText, this.currentSpeed, profile, onStart, onEnd, onError);
  }

  /**
   * Lecture via HTML5 Audio avec modulation de vitesse en direct
   */
  private playHtmlAudio(
    audioBase64: string,
    mimeType: string,
    speed: number,
    engine: AudioEngineType,
    voiceLabel: string,
    onTimeUpdate?: (current: number, total: number) => void,
    onStart?: (engine: AudioEngineType, voiceLabel: string) => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ) {
    try {
      this.currentEngine = engine;
      const audioUrl = `data:${mimeType};base64,${audioBase64}`;
      const audio = new Audio(audioUrl);
      this.currentAudio = audio;
      audio.playbackRate = speed;

      audio.onloadedmetadata = () => {
        if (onTimeUpdate) {
          onTimeUpdate(0, audio.duration || 0);
        }
      };

      audio.onplay = () => {
        this.isSynthesizing = true;
        this.isPaused = false;
        if (onStart) onStart(engine, voiceLabel);

        if (this.timeUpdateInterval) clearInterval(this.timeUpdateInterval);
        this.timeUpdateInterval = setInterval(() => {
          if (audio && onTimeUpdate) {
            onTimeUpdate(audio.currentTime, audio.duration || 0);
          }
        }, 200);
      };

      audio.onended = () => {
        this.stop();
        if (onEnd) onEnd();
      };

      audio.onerror = () => {
        this.stop();
        if (onError) onError("Erreur lors de la lecture du flux audio.");
      };

      audio.play().catch((err) => {
        console.warn("[SpeechService] Autoplay bloqué ou erreur audio:", err);
        if (onError) onError("Veuillez cliquer pour autoriser la lecture audio.");
      });
    } catch (err: any) {
      if (onError) onError(err?.message || "Erreur d'initialisation audio.");
    }
  }

  /**
   * Lecture via Web Speech API avec découpage par phrases (évite le bug des 15 secondes)
   */
  private playBrowserSpeech(
    text: string,
    speed: number,
    profile?: VoiceProfile,
    onStart?: (engine: AudioEngineType, voiceLabel: string) => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      if (onError) onError("La synthèse vocale n'est pas supportée par votre navigateur.");
      return;
    }

    const synth = window.speechSynthesis;
    synth.cancel();

    const voice = this.getBestSystemVoice();
    const voiceName = profile?.name ? `${profile.name} (Repli Système)` : (voice?.name || "Voix Système Standard");
    this.currentEngine = voice?.name.includes("Google") ? "browser_neural" : "browser_fallback";

    // Découpage en phrases pour fluidité continue
    const sentences = text
      .split(/(?<=[.?!;])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sentences.length === 0) {
      if (onEnd) onEnd();
      return;
    }

    // Calcul du pitch adapté au profil (ex: Voix rocailleuse = pitch plus grave / rauque ~0.72)
    const pitchOffset = profile ? (profile.pitchSemiTones / 12) : 0;
    const computedPitch = Math.max(0.55, Math.min(1.6, 1.0 + pitchOffset));
    const effectiveRate = Math.max(0.7, Math.min(2.0, speed * (profile?.speakingRateMultiplier || 1.0)));

    this.currentUtteranceList = sentences.map((sentence) => {
      const utt = new SpeechSynthesisUtterance(sentence);
      utt.lang = "fr-FR";
      if (voice) utt.voice = voice;
      utt.rate = effectiveRate;
      utt.pitch = computedPitch;
      return utt;
    });

    this.currentUtteranceIndex = 0;
    this.isSynthesizing = true;
    this.isPaused = false;

    if (onStart) {
      onStart(this.currentEngine, `${voiceName} (Synthèse Locale)`);
    }

    const speakNext = () => {
      if (this.currentUtteranceIndex >= this.currentUtteranceList.length) {
        this.stop();
        if (onEnd) onEnd();
        return;
      }

      const currentUtt = this.currentUtteranceList[this.currentUtteranceIndex];
      currentUtt.onend = () => {
        this.currentUtteranceIndex++;
        speakNext();
      };
      currentUtt.onerror = (e) => {
        console.warn("[SpeechSynthesis] Erreur segment vocal:", e);
        this.currentUtteranceIndex++;
        speakNext();
      };

      synth.speak(currentUtt);
    };

    speakNext();
  }

  /**
   * Modifie instantanément la vitesse de lecture en cours sans réinitialiser la position
   */
  public setSpeed(newSpeed: number) {
    this.currentSpeed = Math.max(0.5, Math.min(2.5, newSpeed));
    if (this.currentAudio) {
      this.currentAudio.playbackRate = this.currentSpeed;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window && this.currentUtteranceList.length > 0) {
      // Ajuster pour les prochaines phrases
      for (const utt of this.currentUtteranceList) {
        utt.rate = this.currentSpeed;
      }
    }
  }

  /**
   * Met en pause la lecture en cours
   */
  public pause() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.isPaused = true;
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
      this.isPaused = true;
    }
  }

  /**
   * Reprend la lecture
   */
  public resume() {
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(() => {});
      this.isPaused = false;
    } else if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
      this.isPaused = false;
    }
  }

  /**
   * Avancer ou reculer de X secondes dans la piste audio
   */
  public seekBy(deltaSeconds: number) {
    if (this.currentAudio && !isNaN(this.currentAudio.duration)) {
      const newTime = Math.max(0, Math.min(this.currentAudio.duration, this.currentAudio.currentTime + deltaSeconds));
      this.currentAudio.currentTime = newTime;
    }
  }

  /**
   * Arrêt complet de la lecture
   */
  public stop() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
      this.timeUpdateInterval = null;
    }

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = "";
      this.currentAudio = null;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    this.currentUtteranceList = [];
    this.currentUtteranceIndex = 0;
    this.isSynthesizing = false;
    this.isPaused = false;
    this.activeArticleId = null;
  }

  /**
   * Écoute un extrait vocal de test (phrase d'exemple de la voix choisie)
   */
  public async testVoice(
    profile: VoiceProfile,
    customPhrase?: string,
    onStart?: (engine: AudioEngineType, label: string) => void,
    onEnd?: () => void,
    onError?: (err: string) => void
  ): Promise<void> {
    this.stop();
    const phrase = customPhrase || profile.samplePhrase || `Bonjour, ceci est un essai de la voix de ${profile.name} sur InfoPerso.`;
    const effectiveGender = profile.gender === "male" ? "male" : "female";
    const normalized = normalizeFrenchPhonetics(phrase);
    const textHash = await computeAudioHash(`test_${profile.id}_${normalized}_${profile.geminiStylePrompt}`);

    try {
      const cached = await getCachedAudio(textHash);
      if (cached && cached.audioBase64) {
        this.playHtmlAudio(
          cached.audioBase64,
          cached.mimeType || "audio/mp3",
          profile.speakingRateMultiplier || 1.0,
          "google_studio",
          `Échantillon : ${profile.name}`,
          undefined,
          onStart,
          onEnd,
          onError
        );
        return;
      }

      const res = await fetch("/api/audio/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: normalized,
          speed: profile.speakingRateMultiplier || 1.0,
          voiceGender: effectiveGender,
          voiceProfileId: profile.id,
          voiceStylePrompt: profile.geminiStylePrompt,
          customVoiceName: profile.name,
          pitch: profile.pitchSemiTones
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.audioBase64) {
          saveCachedAudio(textHash, data.audioBase64, data.mimeType || "audio/mp3").catch(() => {});
          this.playHtmlAudio(
            data.audioBase64,
            data.mimeType || "audio/mp3",
            profile.speakingRateMultiplier || 1.0,
            data.source === "google_gemini_tts" ? "google_gemini" : "google_studio",
            data.voiceLabel || `Échantillon : ${profile.name}`,
            undefined,
            onStart,
            onEnd,
            onError
          );
          return;
        }
      }
    } catch (_) {}

    // Repli Web Speech
    this.playBrowserSpeech(normalized, profile.speakingRateMultiplier || 1.0, profile, onStart, onEnd, onError);
  }

  public isPlaying(): boolean {
    return this.isSynthesizing && !this.isPaused;
  }

  public getActiveArticleId(): string | number | null {
    return this.activeArticleId;
  }
}

export const articleSpeechManager = new ArticleSpeechManager();
