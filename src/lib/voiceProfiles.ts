import { VoiceProfile } from "../types";

export const DEFAULT_VOICE_PROFILES: VoiceProfile[] = [
  {
    id: "raspy_rock",
    name: "Voix Rocailleuse & Éraillée",
    subtitle: "Grain rauque, énergique et franc-parler",
    category: "archetype",
    description: "Timbre très éraillé, grave, chaud et cassé avec un rythme vif, décontracté et spontané. Idéal pour une écoute vivante sans langue de bois.",
    avatarEmoji: "🎙️",
    badgeText: "⭐ Grain Rauque Signature",
    gender: "female",
    geminiVoiceName: "Aoede",
    geminiStylePrompt: "Voix au timbre très éraillé, grave, rauque, cassé et ultra-chaleureux, gouailleux, rock'n'roll, plein de vie, d'énergie et de spontanéité. Rythme direct et complice.",
    googleCloudVoiceName: "fr-FR-Studio-A",
    pitchSemiTones: -3.5,
    speakingRateMultiplier: 1.05,
    raspyEffect: 0.90, // Forte éraillure vocale signature
    warmthBoost: 0.85,
    samplePhrase: "Salut ! Bienvenue sur InfoPerso. Alors accrochez-vous bien, parce que cette actualité-là, elle vaut vraiment le détour !"
  },
  {
    id: "baryton_pose",
    name: "Voix Baryton Grave & Posée",
    subtitle: "Timbre flegmatique, profond et narratif",
    category: "archetype",
    description: "Baryton grave et suave, diction soignée et flegmatique, intonations élégantes et posées pour un récit captivant.",
    avatarEmoji: "🎩",
    badgeText: "Profondeur & Élégance",
    gender: "male",
    geminiVoiceName: "Charon",
    geminiStylePrompt: "Voix de baryton grave, suave, flegmatique, posée et raffinée, diction savoureuse avec des intonations élégantes et chaleureuses.",
    googleCloudVoiceName: "fr-FR-Studio-B",
    pitchSemiTones: -2.0,
    speakingRateMultiplier: 0.96,
    raspyEffect: 0.10,
    warmthBoost: 0.85,
    samplePhrase: "Bonjour. Laissez-moi vous conter les événements tout à fait fascinants de notre époque contemporaine..."
  },
  {
    id: "narrateur_mystere",
    name: "Voix Narrative & Enquête",
    subtitle: "Diction théâtrale et immersive",
    category: "archetype",
    description: "Voix grave, profonde, théâtrale et captivante. Une diction rythmée qui transforme chaque dossier en une enquête immersive.",
    avatarEmoji: "📻",
    badgeText: "Immersion & Récit",
    gender: "male",
    geminiVoiceName: "Fenrir",
    geminiStylePrompt: "Voix de grand récit : timbre baryton grave, profond, théâtral, intense, captivant et posé. Suspense dramatique mesuré et articulation solennelle.",
    googleCloudVoiceName: "fr-FR-Studio-B",
    pitchSemiTones: -2.0,
    speakingRateMultiplier: 0.94,
    raspyEffect: 0.15,
    warmthBoost: 0.90,
    samplePhrase: "Bienvenue dans cette nouvelle édition d'InfoPerso. Aujourd'hui, un dossier dont les répercussions méritent toute notre attention..."
  },
  {
    id: "journaliste_vif",
    name: "Voix Claire & Matinale",
    subtitle: "Débit vif, incisif et direct",
    category: "archetype",
    description: "Débit rapide, direct, incisif et passionné. L'énergie communicative d'une grande matinale d'information en continu.",
    avatarEmoji: "⚡",
    badgeText: "Dynamique & Percutant",
    gender: "female",
    geminiVoiceName: "Kore",
    geminiStylePrompt: "Voix de journaliste de matinale d'information, débit vif, direct, incisif, relances franches et ton percutant.",
    googleCloudVoiceName: "fr-FR-Studio-A",
    pitchSemiTones: 0.5,
    speakingRateMultiplier: 1.10,
    raspyEffect: 0.05,
    warmthBoost: 0.40,
    samplePhrase: "Bonjour à tous sur InfoPerso. Au cœur de l'actualité ce matin, une analyse percutante qui fait réagir les observateurs."
  },
  {
    id: "documentaire_apaisant",
    name: "Voix Douce & Contemplative",
    subtitle: "Ton feutré, calme et méditatif",
    category: "archetype",
    description: "Voix douce, chuchotée, contemplative et posée. Idéale pour les reportages scientifiques, environnementaux et une écoute sereine.",
    avatarEmoji: "🌿",
    badgeText: "Sérénité & Nature",
    gender: "male",
    geminiVoiceName: "Puck",
    geminiStylePrompt: "Narrateur de grand documentaire : voix douce, chuchotée, contemplative, pleine d'émerveillement et de respect pour la nature et la science.",
    googleCloudVoiceName: "fr-FR-Studio-B",
    pitchSemiTones: -1.5,
    speakingRateMultiplier: 0.92,
    raspyEffect: 0.20,
    warmthBoost: 0.75,
    samplePhrase: "Observez avec attention... Ici, au cœur de notre écosystème, une transformation silencieuse s'opère sous nos yeux."
  },
  {
    id: "studio_hd",
    name: "Voix Studio Haute Définition",
    subtitle: "Diction journalistique équilibrée",
    category: "archetype",
    description: "Synthèse moderne haute fidélité. Claire, fluide, neutre et parfaitement intelligible pour une écoute reposante.",
    avatarEmoji: "✨",
    badgeText: "Standard Haute Précision",
    gender: "female",
    geminiVoiceName: "Kore",
    geminiStylePrompt: "Journaliste de presse d'information générale, voix calme, claire, diction impeccable, ton posé, équilibré et bienveillant.",
    googleCloudVoiceName: "fr-FR-Studio-A",
    pitchSemiTones: 0.0,
    speakingRateMultiplier: 1.0,
    raspyEffect: 0.0,
    warmthBoost: 0.50,
    samplePhrase: "InfoPerso vous présente les éléments clés de cette publication, vérifiés et synthétisés pour vous."
  }
];

const LOCAL_STORAGE_ACTIVE_VOICE = "infoperso_active_voice_id";
const LOCAL_STORAGE_CUSTOM_VOICES = "infoperso_custom_voices_list";

/**
 * Migration d'anciens identifiants vers les archétypes acoustiques
 */
function normalizeVoiceId(id: string): string {
  if (id === "doully") return "raspy_rock";
  if (id === "rochefort") return "baryton_pose";
  if (id === "drouelle") return "narrateur_mystere";
  if (id === "salame") return "journaliste_vif";
  if (id === "attenborough") return "documentaire_apaisant";
  return id;
}

/**
 * Récupère l'ensemble des profils disponibles (par défaut + créés par l'utilisateur)
 */
export function getAllVoiceProfiles(): VoiceProfile[] {
  let customList: VoiceProfile[] = [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_VOICES);
    if (raw) {
      customList = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Impossible de lire les voix personnalisées :", err);
  }
  return [...DEFAULT_VOICE_PROFILES, ...customList];
}

/**
 * Récupère le profil actif (par défaut : Voix Rocailleuse)
 */
export function getActiveVoiceProfile(): VoiceProfile {
  try {
    const activeId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_VOICE);
    if (activeId) {
      const normalizedId = normalizeVoiceId(activeId);
      const all = getAllVoiceProfiles();
      const found = all.find((v) => v.id === normalizedId || v.id === activeId);
      if (found) return found;
    }
  } catch (_) {}
  return DEFAULT_VOICE_PROFILES[0];
}

/**
 * Définit la voix active
 */
export function setActiveVoiceProfileId(id: string): void {
  try {
    const normalizedId = normalizeVoiceId(id);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_VOICE, normalizedId);
  } catch (_) {}
}

/**
 * Enregistre une nouvelle voix personnalisée issue d'un enregistrement 15-20s ou sur-mesure
 */
export function saveCustomVoiceProfile(profile: VoiceProfile): VoiceProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_VOICES);
    const existing: VoiceProfile[] = raw ? JSON.parse(raw) : [];
    const index = existing.findIndex((v) => v.id === profile.id);
    if (index >= 0) {
      existing[index] = profile;
    } else {
      existing.unshift(profile);
    }
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_VOICES, JSON.stringify(existing));
    return [...DEFAULT_VOICE_PROFILES, ...existing];
  } catch (err) {
    console.warn("Erreur sauvegarde voix personnalisée :", err);
    return getAllVoiceProfiles();
  }
}

/**
 * Supprime une voix personnalisée
 */
export function deleteCustomVoiceProfile(id: string): VoiceProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CUSTOM_VOICES);
    const existing: VoiceProfile[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter((v) => v.id !== id);
    localStorage.setItem(LOCAL_STORAGE_CUSTOM_VOICES, JSON.stringify(filtered));

    // Si la voix active était celle supprimée, repasser sur la voix rocailleuse
    const active = getActiveVoiceProfile();
    if (active.id === id) {
      setActiveVoiceProfileId("raspy_rock");
    }
    return [...DEFAULT_VOICE_PROFILES, ...filtered];
  } catch (err) {
    return getAllVoiceProfiles();
  }
}
