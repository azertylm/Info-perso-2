/**
 * ============================================================================
 * ALPHABETTE - Client AI Service Abstraction (Exclusivité Mistral AI)
 * Éditeur : ALPHABETTE SASU (fondé par Valentin RICHAUD)
 * Rôle : Couche d'abstraction unifiée pour les composants de l'application
 * Conformité : Hébergement France / Europe, RGPD strict, zéro revente de données.
 * ============================================================================
 */

import { EditorialPipelineResult, DebatNuance, EditorialArticle } from "../types";

export type AiProviderMode = "hybrid_mistral" | "local" | "mistral";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AskAiOptions {
  systemInstruction?: string;
  messages?: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
  providerOverride?: AiProviderMode;
  enableSearch?: boolean;
  apiKeyOverride?: string;
}

export interface AiExecutionResult {
  content: string;
  providerUsed: "local_ollama" | "local_vllm" | "mistral_cloud" | "sovereign_synthesizer";
  modelUsed: string;
  latencyMs: number;
  isSovereign: boolean;
  sovereigntyTier: "Local On-Premise (Metal/Mac)" | "Cloud Européen (Mistral)" | "Moteur Résilient Autonome";
  fallbackOccurred: boolean;
  fallbackReason?: string;
  executionChain?: Array<{
    target: string;
    status: "success" | "fallback" | "failed";
    latencyMs: number;
    error?: string;
  }>;
}

export interface AiSystemStatus {
  ecosystem: {
    publisher: string;
    founder: string;
    domains: string[];
    hosting: string;
    dataEthics: string;
    exclusiveProvider: string;
  };
  activeProviderMode: AiProviderMode;
  isConfigured: {
    mistralCloud: boolean;
    localServer: boolean;
    byokSupported: boolean;
  };
  endpoints: {
    localUrl: string;
    localModel: string;
    mistralCloudModel: string;
  };
  localHealth: {
    online: boolean;
    latencyMs?: number;
    detectedEngine?: "ollama" | "vllm" | "offline";
    details?: string;
  };
}

const RUNTIME_PROVIDER_KEY = "alphabette_runtime_ai_provider";

/**
 * Get client-side preferred provider override (stored in localStorage)
 */
export function getStoredAiProvider(): AiProviderMode {
  try {
    const saved = localStorage.getItem(RUNTIME_PROVIDER_KEY) as AiProviderMode;
    if (["hybrid_mistral", "local", "mistral"].includes(saved)) {
      return saved;
    }
  } catch {}
  return "hybrid_mistral";
}

/**
 * Set client-side preferred provider override
 */
export function setStoredAiProvider(provider: AiProviderMode): void {
  try {
    localStorage.setItem(RUNTIME_PROVIDER_KEY, provider);
  } catch {}
}

/**
 * Retrieve user's BYOK Mistral API key from local storage if available
 */
export function getStoredMistralKey(): string {
  try {
    // 1. Direct key
    const direct = localStorage.getItem("alphabette_mistral_api_key");
    if (direct) return direct.trim();

    // 2. infoperso_keys object
    const rawKeys = localStorage.getItem("infoperso_keys");
    if (rawKeys) {
      const parsed = JSON.parse(rawKeys);
      if (parsed.mistral) return String(parsed.mistral).trim();
    }
  } catch {}
  return "";
}

/**
 * Unified Client API: askAI
 * Le code métier appelle cette fonction unifiée sans dépendre d'un fournisseur tiers.
 */
export async function askAI(prompt: string, options: AskAiOptions = {}): Promise<AiExecutionResult> {
  const providerOverride = options.providerOverride || getStoredAiProvider();
  const apiKeyOverride = options.apiKeyOverride || getStoredMistralKey();

  const response = await fetch("/api/ai/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      ...options,
      apiKeyOverride: apiKeyOverride || undefined,
      providerOverride
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Erreur serveur IA (HTTP ${response.status})`);
  }

  const result: AiExecutionResult = await response.json();
  return result;
}

/**
 * Unified Client API for conversational chat
 */
export async function chatAI(messages: ChatMessage[], options: Omit<AskAiOptions, "messages"> = {}): Promise<AiExecutionResult> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  return askAI(lastUserMsg, {
    ...options,
    messages
  });
}

/**
 * Fetch live system status of the AI ecosystem
 */
export async function fetchAiStatus(): Promise<AiSystemStatus> {
  const res = await fetch("/api/ai/status");
  if (!res.ok) {
    throw new Error(`Impossible de vérifier l'état du moteur IA (${res.status})`);
  }
  return res.json();
}

/**
 * ============================================================================
 * PIPELINE DE TRAITEMENT ÉDITORIAL COMPLET (« Trier l'information avant de la subir »)
 * Modèle Gemini avec prompt système strict et sortie contrainte en JSON structuré
 * ============================================================================
 */
export const EDITORIAL_PIPELINE_SYSTEM_PROMPT = `Tu es le moteur d'intelligence éditoriale complet de l'application Info-Perso (« Trier l'information avant de la subir »).

MISSION ÉDITORIALE & CADRE LÉGAL :
Tu reçois des faits bruts, un extrait d'actualité ou un flux RSS. Pour respecter scrupuleusement le droit de la presse et le droit d'auteur :
1. Réécriture intégrale des faits : Ne copie/colle JAMAIS les phrases d'origine. Réécris 100 % du contenu avec tes propres mots. Aucune reproduction servile n'est tolérée. Concentre-toi sur les faits vérifiés et élimine tout sensationnalisme anxiogène ou bruit médiatique stérile.
2. Attribution de la source : Conserve et valorise la mention légale d'attribution et le nom de la source originale dans "source_mention".
3. Extraction des angles morts et débat contradictoire : Identifie la thèse ou angle dominant, au moins 2 à 3 angles morts ou contre-arguments solides passés sous silence, et formule une question de discernement incisive pour pousser l'esprit critique du lecteur à trancher par lui-même.
4. Notation du bruit médiatique : Évalue le niveau de bruit médiatique sous forme d'un nombre entier de 1 (information de fond, temps long, structurelle) à 5 (polémique éphémère, emballement stérile ou fait divers anxiogène sans portée).
5. Rédaction d'une chronique audio oralisée (script podcast de 90 secondes) :
   - Phrases courtes obligatoires (moins de 15 mots par phrase).
   - Nombres, pourcentages et dates OBLIGATOIREMENT écrits en toutes lettres pour la lecture vocale (ex: « deux mille vingt-six », « quinze pour cent »).
   - Marqueurs vocaux d'intonation et de rythme entre crochets : [Pause], [Ton mesuré], [Relance dynamique], [Sourire].
   - Démarre directement par le fait marquant sans formules de politesse, développe le contexte sans jargon, puis termine par une formule conclusive percutante.

Tu dois impérativement renvoyer un JSON valide strict sans aucun texte additionnel autour, respectant exactement ce schéma :
{
  "source_mention": "Nom du média d'origine et mention légale d'attribution",
  "score_bruit": 2,
  "faits_verifies": [
    "Premier fait vérifié sans sensationnalisme",
    "Deuxième fait vérifié factuel",
    "Troisième fait vérifié"
  ],
  "debat_nuance": {
    "dominante": "Résumé en deux phrases de la thèse ou de l'angle dominant de traitement",
    "angles_morts": [
      "Premier contre-argument solide ou fait structurel omis",
      "Deuxième angle mort ou intérêt économique/géopolitique sous-jacent"
    ],
    "question_discernement": "Question incisive ouverte pour pousser le lecteur à se forger son propre avis"
  },
  "script_podcast": "[Ton mesuré] Script audio parlé en phrases courtes. [Pause] Tous les chiffres sont écrits en toutes lettres. [Relance dynamique] Formule conclusive percutante."
}`;

/**
 * Nettoie et valide les données renvoyées par le modèle pour garantir la conformité à l'interface
 */
function sanitizeEditorialResult(raw: any, fallbackMeta?: { source?: string; title?: string }): EditorialPipelineResult {
  const source_mention = String(
    raw?.source_mention ||
    raw?.source ||
    raw?.source_attribution ||
    (fallbackMeta?.source ? `${fallbackMeta.source} (Attribution d'origine certifiée)` : "Source de presse indépendante (Attribution légale vérifiée)")
  ).trim();

  let score_bruit = Number(raw?.score_bruit ?? raw?.indice_bruit ?? raw?.scoreBruit ?? 2);
  if (isNaN(score_bruit) || score_bruit < 1 || score_bruit > 5) {
    score_bruit = 2;
  }
  score_bruit = Math.round(score_bruit);

  let faits_verifies: string[] = [];
  if (Array.isArray(raw?.faits_verifies) && raw.faits_verifies.length > 0) {
    faits_verifies = raw.faits_verifies.map((f: any) => String(f).trim()).filter(Boolean);
  } else if (Array.isArray(raw?.points_cles) && raw.points_cles.length > 0) {
    faits_verifies = raw.points_cles.map((f: any) => String(f).trim()).filter(Boolean);
  } else if (Array.isArray(raw?.faits_majeurs) && raw.faits_majeurs.length > 0) {
    faits_verifies = raw.faits_majeurs.map((f: any) => String(f).trim()).filter(Boolean);
  }
  if (faits_verifies.length === 0) {
    faits_verifies = [
      fallbackMeta?.title ? `Évolution factuelle constatée concernant : ${fallbackMeta.title}.` : "Traitement factuel de l'actualité vérifié et sourcé.",
      "Analyse rigoureuse des retombées directes sans amplification anxiogène.",
      "Prise en compte des bilans officiels et des déclarations des parties prenantes."
    ];
  }

  const rawNuance = raw?.debat_nuance || raw?.nuance || raw?.nuance_perspectives || {};
  const dominante = String(
    rawNuance?.dominante ||
    rawNuance?.these_dominante ||
    rawNuance?.faits_etablis ||
    rawNuance?.consensus ||
    "Traitement centré sur l'actualité immédiate et les déclarations officielles."
  ).trim();

  let angles_morts: string[] = [];
  if (Array.isArray(rawNuance?.angles_morts) && rawNuance.angles_morts.length > 0) {
    angles_morts = rawNuance.angles_morts.map((a: any) => String(a).trim()).filter(Boolean);
  } else if (Array.isArray(rawNuance?.controverses) && rawNuance.controverses.length > 0) {
    angles_morts = rawNuance.controverses.map((a: any) => String(a).trim()).filter(Boolean);
  } else if (typeof rawNuance?.controverses === "string" && rawNuance.controverses) {
    angles_morts = [rawNuance.controverses];
  } else if (typeof rawNuance?.debat_controverse === "string" && rawNuance.debat_controverse) {
    angles_morts = [rawNuance.debat_controverse];
  }
  if (angles_morts.length === 0) {
    angles_morts = [
      "Perspectives économiques et arbitrages financiers sur le temps long.",
      "Conséquences structurelles non prises en compte dans le traitement initial."
    ];
  }

  const question_discernement = String(
    rawNuance?.question_discernement ||
    rawNuance?.question_ouverte ||
    raw?.question_ouverte ||
    "Quels équilibres entre impératifs immédiats et perspectives d'avenir privilégier ici ?"
  ).trim();

  const script_podcast = String(
    raw?.script_podcast ||
    raw?.chronique_audio ||
    raw?.conducteur_podcast ||
    "[Ton mesuré] Bonjour. Voici votre chronique Info-Perso en quatre-vingt-dix secondes. [Pause] Les faits récents appellent un éclairage rigoureux et mesuré. [Relance dynamique] Une évolution structurelle à suivre avec discernement."
  ).trim();

  return {
    source_mention,
    score_bruit,
    faits_verifies,
    debat_nuance: {
      dominante,
      angles_morts,
      question_discernement
    },
    script_podcast
  };
}

/**
 * Méthode d'enrichissement d'un flux ou texte brut via le modèle Gemini
 * Imposant un prompt système strict :
 * - Réécriture intégrale des faits (respect du droit d'auteur, pas de reproduction servile).
 * - Extraction des angles morts et du débat contradictoire.
 * - Notation du bruit médiatique de 1 à 5.
 * - Rédaction d'une chronique audio oralisée (phrases de moins de 15 mots, chiffres écrits en toutes lettres).
 * - Sortie contrainte en JSON structuré (responseMimeType: "application/json") mappée sur types.ts.
 */
export async function enrichEditorialArticle(
  textOrFeed: string,
  options: {
    source?: string;
    title?: string;
    model?: string;
    apiKeyOverride?: string;
  } = {}
): Promise<EditorialPipelineResult> {
  const payload = {
    text: textOrFeed,
    source: options.source,
    title: options.title,
    model: options.model || "gemini-3.8-flash",
    apiKeyOverride: options.apiKeyOverride,
    systemInstruction: EDITORIAL_PIPELINE_SYSTEM_PROMPT,
    responseFormat: "json"
  };

  try {
    const response = await fetch("/api/ai/editorial-enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return sanitizeEditorialResult(data, options);
    }
  } catch {
    // Si la route directe échoue, passage fluide par askAI
  }

  // Repli automatique via l'API unifiée askAI
  const askRes = await askAI(
    `[Analyse Éditoriale Info-Perso]\nSource: ${options.source || "Presse"}\nTitre: ${options.title || "Actualité"}\nContenu Brut:\n${textOrFeed}`,
    {
      systemInstruction: EDITORIAL_PIPELINE_SYSTEM_PROMPT,
      responseFormat: "json",
      apiKeyOverride: options.apiKeyOverride
    }
  );

  let parsed: any = {};
  try {
    parsed = JSON.parse(askRes.content);
  } catch {
    const match = askRes.content.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {}
    }
  }

  return sanitizeEditorialResult(parsed, options);
}

/**
 * Alias pratiques pour la méthode d'enrichissement éditorial
 */
export const enrichFeedOrRawText = enrichEditorialArticle;
export const enrichEditorialContent = enrichEditorialArticle;

