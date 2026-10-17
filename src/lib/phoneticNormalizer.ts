/**
 * Normaliseur phonétique et prosodique souverain pour InfoPerso / ALPHABETTE SASU
 * Solutions 9 & 10 : Élimination des prononciations robotiques, balisage prosodique
 * et dépliage phonétique des nombres, devises, unités et acronymes français.
 */

/**
 * Normalisation phonétique des acronymes, symboles, devises et nombres pour la langue française
 */
export function normalizeFrenchPhonetics(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Devises et montants financiers
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*Mds?\s*€/gi, "$1 milliards d'euros");
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*M€/gi, "$1 millions d'euros");
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*k€/gi, "$1 mille euros");
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*€\s*\/\s*an/gi, "$1 euros par an");
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*€/gi, "$1 euros");

  text = text.replace(/(\d+(?:[.,]\d+)?)\s*Mds?\s*\$/gi, "$1 milliards de dollars");
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*M\$/gi, "$1 millions de dollars");
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*\$/gi, "$1 dollars");

  // 2. Chiffres à virgule et pourcentages
  text = text.replace(/(\d+),(\d+)/g, "$1 virgule $2");
  text = text.replace(/(\d+(?:\s*virgule\s*\d+)?)\s*%/g, "$1 pour cent");

  // 3. Unités de mesure, physiques et énergétiques
  text = text.replace(/\b(\d+)\s*kWh\b/gi, "$1 kilowatt-heure");
  text = text.replace(/\b(\d+)\s*MWh\b/gi, "$1 mégawatt-heure");
  text = text.replace(/\b(\d+)\s*GWh\b/gi, "$1 gigawatt-heure");
  text = text.replace(/\b(\d+)\s*km\/h\b/gi, "$1 kilomètres par heure");
  text = text.replace(/\b(\d+)\s*km\b/gi, "$1 kilomètres");
  text = text.replace(/\b(\d+)\s*m²\b/gi, "$1 mètres carrés");
  text = text.replace(/\bCO2\b/gi, "C-O-2");
  text = text.replace(/\bCO₂\b/gi, "C-O-2");

  // 4. Ordinaux
  text = text.replace(/\b1er\b/gi, "premier");
  text = text.replace(/\b1ère\b/gi, "première");
  text = text.replace(/\b2e\b|\b2ème\b/gi, "deuxième");
  text = text.replace(/\b3e\b|\b3ème\b/gi, "troisième");
  text = text.replace(/\b4e\b|\b4ème\b/gi, "quatrième");

  // 5. Acronymes institutionnels, politiques et économiques
  text = text.replace(/\bIA\b/g, "I-A");
  text = text.replace(/\bUE\b/g, "Union Européenne");
  text = text.replace(/\bPIB\b/g, "P-I-B");
  text = text.replace(/\bPDG\b/g, "P-D-G");
  text = text.replace(/\bSPAC\b/g, "spack");
  text = text.replace(/\bTMTG\b/g, "T-M-T-G");
  text = text.replace(/\bDJT\b/g, "D-J-T");
  text = text.replace(/\bLFP\b/g, "L-F-P");
  text = text.replace(/\bEV\b/g, "véhicules électriques");
  text = text.replace(/\bSUV\b/g, "S-U-V");
  text = text.replace(/\bOTA\b/g, "O-T-A");
  text = text.replace(/\bR&D\b/gi, "recherche et développement");
  text = text.replace(/\bPME\b/g, "P-M-E");
  text = text.replace(/\bETI\b/g, "E-T-I");
  text = text.replace(/\bSASU\b/g, "S-A-S-U");
  text = text.replace(/\bBYOK\b/g, "B-Y-O-K");
  text = text.replace(/\bTTS\b/g, "T-T-S");
  text = text.replace(/\bAFP\b/g, "A-F-P");
  text = text.replace(/\bJO\b/g, "Jeux Olympiques");
  text = text.replace(/\bBCE\b/g, "Banque Centrale Européenne");
  text = text.replace(/\bFED\b/g, "Réserve Fédérale");

  // 6. Ponctuation propre et respiration
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Balisage SSML Broadcast Radio Professionnel (Proposition 3) :
 * Conçu spécifiquement pour les voix Google Cloud Studio / Journey et Gemini TTS.
 * Injecte des micro-respirations, des pauses rythmées et des emphases naturelles.
 */
export function buildRadioSsml(text: string): string {
  if (!text) return "<speak></speak>";

  // 1. Normalisation phonétique intégrale
  const clean = normalizeFrenchPhonetics(text);

  // 2. Échappement des entités XML sensibles
  const escaped = clean
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

  // 3. Découpage en phrases pour injection de balises prosodiques
  const sentences = escaped.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

  if (sentences.length === 0) {
    return `<speak>${escaped}</speak>`;
  }

  // Première phrase avec emphase modérée (attaque radio d'accroche)
  const firstSentence = `<emphasis level="moderate">${sentences[0]}</emphasis>`;
  
  // Phrases suivantes avec pauses respiratoires de 220ms
  const remaining = sentences.slice(1).map((s, idx) => {
    // Si la phrase contient un chiffre clé, pause légèrement plus longue
    const pauseTime = /\d+/.test(s) ? "240ms" : "200ms";
    return `<break time="${pauseTime}"/><s>${s}</s>`;
  }).join(" ");

  return `<speak><s>${firstSentence}</s> ${remaining}</speak>`;
}

/**
 * Injection de prosodie dynamique (Solution 9) :
 * Ajoute des micro-pauses respiratoires naturelles pour éviter l'élocution robotique continue.
 */
export function injectSpeechProsody(text: string, isSSML: boolean = false): string {
  if (isSSML) {
    return buildRadioSsml(text);
  }

  const normalized = normalizeFrenchPhonetics(text);

  // Pour le moteur Web Speech standard :
  // L'insertion stratégique d'ellipses ou de micro-virgules force le synthétiseur
  // à marquer une respiration naturelle au lieu de réciter en bloc d'un trait.
  return normalized
    .replace(/\.\s+/g, "... ")
    .replace(/\:\s+/g, " : ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Élagage syntaxique agressif (Solution 5) :
 * Supprime les formules oratoires de remplissage et connecteurs lourds.
 */
export function purgeFillerWords(rawText: string): string {
  if (!rawText) return "";
  let cleaned = rawText
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Supprimer les salutations et tics oratoires
  const fillerPatterns = [
    /^(bonjour\s*(à tous|à toutes et à tous)?\s*[,!.]?\s*)/i,
    /^(bienvenue\s*(dans|sur)?\s*[^.!?,]*[,!.]?\s*)/i,
    /\b(en effet|force est de constater que|il convient de noter que|il faut souligner que|notons que|à noter que|rappelons que|comme le rapporte notre confrère|comme le rapporte|selon les observateurs|ce matin|aujourd'hui)\b[,\s]*/gi,
    /\b(c'est un véritable tournant|voilà pour l'essentiel|merci de votre écoute|merci de nous avoir écoutés|bonne journée)\b[,\s]*/gi
  ];

  fillerPatterns.forEach((rgx) => {
    cleaned = cleaned.replace(rgx, "");
  });

  return cleaned.replace(/\s+/g, " ").trim();
}

