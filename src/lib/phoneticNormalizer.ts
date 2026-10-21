/**
 * Normaliseur phonétique et prosodique souverain pour InfoPerso / ALPHABETTE SASU
 * Proposition 3 : Élimination des prononciations robotiques, balisage prosodique
 * et dépliage phonétique des nombres, devises, unités, dates et acronymes français.
 */

// Tableaux de conversion des nombres en français parlé
const UNITS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf"];
const TEENS = ["dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const TENS = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "soixante", "quatre-vingt", "quatre-vingt"];

/**
 * Convertit un entier positif inférieur à 1 000 000 000 000 en français parlé
 */
export function numberToFrenchWords(n: number): string {
  if (isNaN(n)) return "";
  if (n === 0) return "zéro";
  if (n < 0) return `moins ${numberToFrenchWords(Math.abs(n))}`;

  n = Math.floor(n);

  if (n < 10) return UNITS[n];
  if (n < 20) return TEENS[n - 10];

  if (n < 70) {
    const ten = Math.floor(n / 10);
    const unit = n % 10;
    if (unit === 0) return TENS[ten];
    if (unit === 1) return `${TENS[ten]} et un`;
    return `${TENS[ten]}-${UNITS[unit]}`;
  }

  if (n < 80) {
    const unit = n - 60;
    if (unit === 11) return "soixante et onze";
    return `soixante-${TEENS[unit - 10]}`;
  }

  if (n < 100) {
    const unit = n - 80;
    if (unit === 0) return "quatre-vingts";
    if (unit === 1) return "quatre-vingt-un";
    if (unit < 10) return `quatre-vingt-${UNITS[unit]}`;
    return `quatre-vingt-${TEENS[unit - 10]}`;
  }

  if (n < 1000) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    const hundredStr = hundred === 1 ? "cent" : `${UNITS[hundred]} cents`;
    if (rest === 0) return hundredStr;
    const baseHundred = hundred === 1 ? "cent" : `${UNITS[hundred]} cent`;
    return `${baseHundred} ${numberToFrenchWords(rest)}`;
  }

  if (n < 1000000) {
    const thousand = Math.floor(n / 1000);
    const rest = n % 1000;
    const thousandStr = thousand === 1 ? "mille" : `${numberToFrenchWords(thousand)} mille`;
    if (rest === 0) return thousandStr;
    return `${thousandStr} ${numberToFrenchWords(rest)}`;
  }

  if (n < 1000000000) {
    const million = Math.floor(n / 1000000);
    const rest = n % 1000000;
    const millionStr = million === 1 ? "un million" : `${numberToFrenchWords(million)} millions`;
    if (rest === 0) return millionStr;
    return `${millionStr} ${numberToFrenchWords(rest)}`;
  }

  if (n < 1000000000000) {
    const billion = Math.floor(n / 1000000000);
    const rest = n % 1000000000;
    const billionStr = billion === 1 ? "un milliard" : `${numberToFrenchWords(billion)} milliards`;
    if (rest === 0) return billionStr;
    return `${billionStr} ${numberToFrenchWords(rest)}`;
  }

  return n.toString();
}

/**
 * Convertit un nombre décimal ou fractionnaire en français parlé
 */
export function decimalNumberToFrenchWords(rawNumberStr: string): string {
  const normalized = rawNumberStr.replace(/\s+/g, "").replace(",", ".");
  const num = parseFloat(normalized);
  if (isNaN(num)) return rawNumberStr;

  if (normalized.includes(".")) {
    const [intPart, decPart] = normalized.split(".");
    const intWords = numberToFrenchWords(parseInt(intPart, 10));
    // Diction des chiffres après la virgule
    const decWords = decPart.split("").map(c => UNITS[parseInt(c, 10)] || c).join(" ");
    return `${intWords} virgule ${decWords}`;
  }

  return numberToFrenchWords(num);
}

/**
 * Normalisation phonétique des acronymes, symboles, devises, dates et nombres pour la langue française
 * (Proposition 3 du pipeline audio haute fidélité)
 */
export function normalizeFrenchPhonetics(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 0. Interprétation des marqueurs éditoriaux (ex: [Pause], [Ton mesuré], etc.)
  text = text.replace(/\[Pause\s*(\d+)?m?s?\]/gi, (_, ms) => {
    return ms ? `... ` : `... `;
  });
  text = text.replace(/\[(Ton mesuré|Relance dynamique|Sourire|Chiffre clé|Fait brut|Conséquence)\]/gi, " ");

  // 1. Devises et montants financiers avec dépliage phonétique complet
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*Mds?\s*€/gi, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} milliards d'euros`;
  });
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*M€/gi, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} millions d'euros`;
  });
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*k€/gi, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} mille euros`;
  });
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*€\s*\/\s*an/gi, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} euros par an`;
  });
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*€/gi, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} euros`;
  });

  text = text.replace(/(\d+(?:[.,]\d+)?)\s*Mds?\s*\$/gi, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} milliards de dollars`;
  });
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*M\$/gi, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} millions de dollars`;
  });
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*\$/gi, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} dollars`;
  });

  // 2. Pourcentages avec dépliage phonétique intégral (ex: "45 %" -> "quarante-cinq pour cent")
  text = text.replace(/(\d+(?:[.,]\d+)?)\s*%/g, (_, n) => {
    return `${decimalNumberToFrenchWords(n)} pour cent`;
  });

  // 3. Unités de mesure, physiques et énergétiques
  text = text.replace(/\b(\d+(?:[.,]\d+)?)\s*kWh\b/gi, (_, n) => `${decimalNumberToFrenchWords(n)} kilowatt-heures`);
  text = text.replace(/\b(\d+(?:[.,]\d+)?)\s*MWh\b/gi, (_, n) => `${decimalNumberToFrenchWords(n)} mégawatt-heures`);
  text = text.replace(/\b(\d+(?:[.,]\d+)?)\s*GWh\b/gi, (_, n) => `${decimalNumberToFrenchWords(n)} gigawatt-heures`);
  text = text.replace(/\b(\d+(?:[.,]\d+)?)\s*km\/h\b/gi, (_, n) => `${decimalNumberToFrenchWords(n)} kilomètres par heure`);
  text = text.replace(/\b(\d+(?:[.,]\d+)?)\s*km\b/gi, (_, n) => `${decimalNumberToFrenchWords(n)} kilomètres`);
  text = text.replace(/\b(\d+(?:[.,]\d+)?)\s*m²\b/gi, (_, n) => `${decimalNumberToFrenchWords(n)} mètres carrés`);
  text = text.replace(/\bCO2\b/gi, "C-O-2");
  text = text.replace(/\bCO₂\b/gi, "C-O-2");

  // 4. Ordinaux
  text = text.replace(/\b1er\b/gi, "premier");
  text = text.replace(/\b1ère\b/gi, "première");
  text = text.replace(/\b2e\b|\b2ème\b/gi, "deuxième");
  text = text.replace(/\b3e\b|\b3ème\b/gi, "troisième");
  text = text.replace(/\b4e\b|\b4ème\b/gi, "quatrième");

  // 5. Années courantes (ex: 1980-2099) pour fluidité journalistique
  text = text.replace(/\b(19\d{2}|20\d{2})\b/g, (match) => {
    const yr = parseInt(match, 10);
    return numberToFrenchWords(yr);
  });

  // 6. Nombres décimaux restants ("12,5" ou "3.8")
  text = text.replace(/(\d+)[.,](\d+)/g, (_, intP, decP) => {
    return `${numberToFrenchWords(parseInt(intP, 10))} virgule ${decP.split("").map((c: string) => UNITS[parseInt(c, 10)] || c).join(" ")}`;
  });

  // 7. Chiffres entiers isolés restants (1 à 999999)
  text = text.replace(/\b(\d{1,6})\b/g, (match) => {
    const val = parseInt(match, 10);
    return numberToFrenchWords(val);
  });

  // 8. Acronymes institutionnels, politiques et économiques
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

  // 9. Ponctuation propre et respiration
  text = text.replace(/\s+/g, " ").trim();

  return text;
}

/**
 * Balisage SSML Broadcast Radio Professionnel (Proposition 3) :
 * Conçu spécifiquement pour les voix Google Cloud Studio / Journey et Gemini TTS.
 * Interprète [Pause] pour injecter des silences de 200ms à 400ms,
 * des micro-respirations et des emphases naturelles.
 */
export function buildRadioSsml(text: string): string {
  if (!text) return "<speak></speak>";

  // Interprétation préalable du marqueur [Pause] en balise SSML
  let ssmlDraft = text.replace(/\[Pause\s*(\d+)?m?s?\]/gi, (_, ms) => {
    const duration = ms ? `${ms}ms` : "300ms";
    return ` <break time="${duration}"/> `;
  });

  // Nettoyage des autres marqueurs éditoriaux
  ssmlDraft = ssmlDraft.replace(/\[(Ton mesuré|Relance dynamique|Sourire|Chiffre clé|Fait brut|Conséquence)\]/gi, "");

  // 1. Normalisation phonétique intégrale
  const clean = normalizeFrenchPhonetics(ssmlDraft);

  // 2. Échappement des entités XML sensibles (en préservant les balises break time injectées)
  const escaped = clean
    .replace(/&/g, "&amp;")
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
  const remaining = sentences.slice(1).map((s) => {
    // Si la phrase contient déjà une balise break, ne pas doubler
    if (s.includes("<break")) {
      return `<s>${s}</s>`;
    }
    const pauseTime = /\d+/.test(s) ? "250ms" : "200ms";
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

  // Normalisation phonétique intégrale incluant conversion des nombres et dates
  const normalized = normalizeFrenchPhonetics(text);

  // Pour le moteur Web Speech standard :
  // L'insertion stratégique d'ellipses ou de virgules force le synthétiseur
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


