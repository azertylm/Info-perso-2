import { NewsArticle } from "../types";
import { purgeFillerWords, injectSpeechProsody } from "./phoneticNormalizer";

export type PodcastFormat = "express" | "strategic" | "impact";

export interface PodcastChapter {
  id: string;
  speaker: "journaliste";
  speakerName: string;
  title: string;
  category: string;
  textToSpeak: string;
  displayScript: string;
  keyTakeaway?: string;
  sourceArticle?: NewsArticle;
  interestReason?: string;
}

const LISTENED_STORAGE_KEY = "infoperso_podcast_listened";

/**
 * Récupère l'ensemble des IDs d'articles déjà écoutés dans les sessions de podcast
 */
export function getListenedArticleIds(): Set<number> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(LISTENED_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Enregistre les IDs des articles écoutés pour garantir un renouvellement continu sans doublon
 */
export function saveListenedArticleIds(newIds: number[]): void {
  if (typeof window === "undefined" || newIds.length === 0) return;
  try {
    const current = getListenedArticleIds();
    newIds.forEach((id) => current.add(id));
    // Limiter la taille du tampon historique à 100 pour recycler si nécessaire
    const arr = Array.from(current);
    const trimmed = arr.length > 100 ? arr.slice(arr.length - 100) : arr;
    localStorage.setItem(LISTENED_STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.debug("[PodcastCurator] Erreur sauvegarde listened IDs:", e);
  }
}

/**
 * Réinitialise la boucle d'écoute du podcast pour recommencer un cycle frais
 */
export function clearListenedArticleIds(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(LISTENED_STORAGE_KEY);
  } catch {}
}

/**
 * Algorithme de scoring d'affinité utilisateur pour InfoPerso / ALPHABETTE SASU :
 * Classe tous les articles en fonction des signaux explicites et implicites de l'auditeur :
 * 1. Articles sauvegardés/favoris (affinité maximale)
 * 2. Pondérations de catégories (cat_weights)
 * 3. Tags boostés et suivis (tag_weights & followed_tags)
 * 4. Centres d'intérêt personnalisés et radar naturel (mots-clés libres)
 * 5. Fraîcheur & articles non lus
 * 6. Exclusion des articles déjà écoutés dans le podcast actuel pour renouveler 5 chapitres
 */
export function rankArticlesByUserInterest(
  articles: NewsArticle[],
  explicitExcludedIds?: Set<number>
): { ranked: NewsArticle[]; interestReasons: Map<number, string> } {
  if (!articles || articles.length === 0) {
    return { ranked: [], interestReasons: new Map() };
  }

  // 1. Charger les préférences et signaux locaux
  let savedIds = new Set<number>();
  let readIds = new Set<number>();
  let catWeights: Record<string, number> = {};
  let tagWeights: Record<string, "boost" | "neutral" | "exclude"> = {};
  let followedTags: string[] = [];
  let customInterests: string[] = [];
  let naturalRadarKeywords: string[] = [];

  const listenedIds = explicitExcludedIds || getListenedArticleIds();

  if (typeof window !== "undefined") {
    try {
      const sSaved = localStorage.getItem("infoperso_saved");
      if (sSaved) savedIds = new Set(JSON.parse(sSaved));

      const sRead = localStorage.getItem("infoperso_read");
      if (sRead) readIds = new Set(JSON.parse(sRead));

      const sCat = localStorage.getItem("infoperso_cat_weights");
      if (sCat) catWeights = JSON.parse(sCat);

      const sTag = localStorage.getItem("infoperso_tag_weights");
      if (sTag) tagWeights = JSON.parse(sTag);

      const sFollowed = localStorage.getItem("infoperso_followed_tags");
      if (sFollowed) followedTags = JSON.parse(sFollowed);

      const sInterests = localStorage.getItem("infoperso_custom_interests");
      if (sInterests) customInterests = JSON.parse(sInterests);

      const sRadar = localStorage.getItem("infoperso_natural_radar");
      if (sRadar) {
        const parsed = JSON.parse(sRadar);
        if (Array.isArray(parsed)) {
          naturalRadarKeywords = parsed.flatMap((p: any) => p.extractedKeywords || []);
        }
      }
    } catch (e) {
      console.debug("[PodcastCurator] Erreur lecture préférences locales:", e);
    }
  }

  const interestReasons = new Map<number, string>();

  // Calcul du score d'affinité pour chaque article
  const scored = articles.map((art) => {
    let score = art.score || 50; // Base de curation
    const reasons: string[] = [];

    // 1. Article en favori / sauvegardé (+60 pts)
    if (savedIds.has(art.id)) {
      score += 60;
      reasons.push("⭐ Enregistré dans vos favoris");
    }

    // 2. Pondération de la catégorie
    const cat = art.category || "";
    if (catWeights[cat] !== undefined) {
      const weight = catWeights[cat]; // 1 à 5
      const boost = (weight - 3) * 15; // -30 à +30
      score += boost;
      if (weight >= 4) {
        reasons.push(`🏷️ Rubrique prioritaire : ${cat}`);
      }
    }

    // 3. Tags suivis ou boostés
    const artTags = Array.isArray(art.tags) ? art.tags : [];
    let hasExcludedTag = false;

    artTags.forEach((t) => {
      const tw = tagWeights[t];
      if (tw === "exclude") {
        hasExcludedTag = true;
      } else if (tw === "boost") {
        score += 25;
        reasons.push(`⚡ Tag favori : ${t}`);
      }

      if (followedTags.includes(t)) {
        score += 20;
        if (!reasons.some((r) => r.includes(t))) {
          reasons.push(`📌 Tag suivi : ${t}`);
        }
      }
    });

    if (hasExcludedTag) {
      score -= 200; // Forte pénalité pour les tags exclus
    }

    // 4. Centres d'intérêt personnalisés & Mots-clés radar naturel
    const fullText = `${art.title} ${art.summary || ""} ${artTags.join(" ")}`.toLowerCase();
    const combinedKeywords = [...customInterests, ...naturalRadarKeywords];

    combinedKeywords.forEach((kw) => {
      const cleanKw = kw.trim().toLowerCase();
      if (cleanKw.length > 2 && fullText.includes(cleanKw)) {
        score += 20;
        if (!reasons.some((r) => r.toLowerCase().includes(cleanKw))) {
          reasons.push(`🎯 Correspondance intérêt : « ${kw} »`);
        }
      }
    });

    // 5. Fraîcheur & Statut de lecture
    if (!readIds.has(art.id)) {
      score += 15; // Découverte d'actualité inédite
    }

    // 6. Article à la Une / Featured
    if (art.featured) {
      score += 18;
      if (reasons.length === 0) {
        reasons.push("🔥 Dossier majeur du jour");
      }
    }

    // 7. Déjà écouté dans les cycles précédents du podcast ?
    const alreadyListened = listenedIds.has(art.id);
    if (alreadyListened) {
      score -= 500; // Mettre en queue pour privilégier les 5 articles inédits
    }

    // Déterminer la raison principale affichée à l'auditeur
    const primaryReason =
      reasons[0] || (art.featured ? "🔥 Dossier majeur du jour" : `📊 Actualité ${art.category || "générale"}`);
    interestReasons.set(art.id, primaryReason);

    return {
      article: art,
      affinityScore: score,
      alreadyListened
    };
  });

  // Trier par score d'affinité décroissant
  scored.sort((a, b) => b.affinityScore - a.affinityScore);

  // Vérifier si nous avons au moins 5 articles non encore écoutés
  const unlistened = scored.filter((s) => !s.alreadyListened);
  let ranked: NewsArticle[];

  if (unlistened.length >= 5) {
    ranked = unlistened.map((s) => s.article);
  } else {
    // Si la totalité du flux a été écoutée, on recycle proprement les articles par affinité
    ranked = scored.map((s) => s.article);
  }

  return { ranked, interestReasons };
}

/**
 * Lecture intégrale et exhaustive de tous les points du dossier :
 * Lit la totalité des faits vérifiés, chiffres clés, angles morts et points d'attention
 * sans limitation arbitraire de temps ou de 3 phrases.
 */
export function buildEssentialBrief(
  art: NewsArticle,
  fmt: PodcastFormat,
  index: number,
  interestReason?: string
): {
  title: string;
  textToSpeak: string;
  displayScript: string;
  keyTakeaway: string;
} {
  const pointsToSpeak: string[] = [];
  const displayPoints: string[] = [];

  // Attaque : Titre du dossier
  const titleClean = art.title.replace(/\s+/g, " ").trim();
  pointsToSpeak.push(`${titleClean}.`);

  // Cas 1 : Faits vérifiés rédigés
  if (art.faits_verifies && art.faits_verifies.length > 0) {
    art.faits_verifies.forEach((fait, i) => {
      const cleanFait = purgeFillerWords(fait);
      if (cleanFait) {
        pointsToSpeak.push(cleanFait);
        displayPoints.push(`🔹 **Point ${i + 1} :** ${cleanFait}`);
      }
    });

    // Angles morts et débat contradictoire
    if (art.debat_nuance?.angles_morts && art.debat_nuance.angles_morts.length > 0) {
      const angles = art.debat_nuance.angles_morts.join(". ");
      pointsToSpeak.push(`Angles morts et contre-arguments : ${angles}`);
      displayPoints.push(`⚖️ **Angles morts :** ${angles}`);
    }

    if (art.debat_nuance?.question_discernement) {
      pointsToSpeak.push(`Question de discernement : ${art.debat_nuance.question_discernement}`);
      displayPoints.push(`💡 **Question de discernement :** ${art.debat_nuance.question_discernement}`);
    }
  } else {
    // Cas 2 : Tous les faits et phrases du résumé et contenu
    const cleanSummary = purgeFillerWords(art.summary || art.content || "");
    const sentences = cleanSummary
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10 && !s.toLowerCase().startsWith("retrouvez"));

    if (sentences.length > 0) {
      sentences.forEach((sentence, i) => {
        let p = sentence;
        if (!p.endsWith(".") && !p.endsWith("!") && !p.endsWith("?")) p += ".";
        pointsToSpeak.push(p);
        displayPoints.push(`🔹 **Point ${i + 1} :** ${p}`);
      });
    } else {
      pointsToSpeak.push(`${art.title}.`);
      displayPoints.push(`🔹 **Point 1 :** ${art.title}`);
    }

    if (art.keyFigures && art.keyFigures.length > 0) {
      art.keyFigures.forEach((kf) => {
        const kfText = `${kf.label} : ${kf.value}.`;
        pointsToSpeak.push(kfText);
        displayPoints.push(`📊 **Donnée clé :** ${kfText}`);
      });
    }

    if (art.keyTakeaways && art.keyTakeaways.length > 0) {
      art.keyTakeaways.forEach((kt) => {
        pointsToSpeak.push(kt);
        displayPoints.push(`🎯 **Point clé :** ${kt}`);
      });
    }
  }

  const textToSpeak = pointsToSpeak.join(" [Pause] ");
  const displayScript = displayPoints.join("\n\n");
  const keyTakeaway = art.faits_verifies?.[0] || art.title;

  return {
    title: `${index + 1}. ${art.title}`,
    textToSpeak,
    displayScript: displayScript || textToSpeak,
    keyTakeaway
  };
}

/**
 * Générateur principal de 5 chapitres ultra-concis
 * Construit 5 chapitres dès le début, calibrés pour aller à l'essentiel
 */
export function generateFivePodcastChapters(
  articles: NewsArticle[],
  fmt: PodcastFormat,
  excludedIds?: Set<number>
): { chapters: PodcastChapter[]; selectedArticles: NewsArticle[] } {
  if (!articles || articles.length === 0) {
    return { chapters: [], selectedArticles: [] };
  }

  // 1. Classement par affinité utilisateur
  const { ranked, interestReasons } = rankArticlesByUserInterest(articles, excludedIds);

  // 2. Strictement les 5 articles les plus pertinents (garantit toujours 5 dossiers)
  let top5 = ranked.slice(0, 5);
  if (top5.length < 5 && ranked.length > 0) {
    let padIdx = 0;
    while (top5.length < 5) {
      top5.push(ranked[padIdx % ranked.length]);
      padIdx++;
    }
  }

  // 3. Construction des 5 chapitres sans aucun blabla
  const chapters: PodcastChapter[] = top5.map((art, idx) => {
    const reason = interestReasons.get(art.id) || "Dossier prioritaire";
    const brief = buildEssentialBrief(art, fmt, idx, reason);

    return {
      id: `brief-ch-${art.id}-${idx}-${Date.now()}`,
      speaker: "journaliste",
      speakerName: "Journaliste InfoPerso",
      title: brief.title,
      category: art.category || "Actualité",
      textToSpeak: brief.textToSpeak,
      displayScript: brief.displayScript,
      sourceArticle: art,
      keyTakeaway: brief.keyTakeaway,
      interestReason: reason
    };
  });

  return { chapters, selectedArticles: top5 };
}
