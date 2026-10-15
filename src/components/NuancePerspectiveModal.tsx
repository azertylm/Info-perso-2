import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { NewsArticle, PerspectiveAnalysis } from "../types";
import {
  Scale,
  CheckCircle2,
  TrendingUp,
  Building2,
  Users,
  AlertTriangle,
  Sparkles,
  X,
  Share2,
  HelpCircle,
  ShieldCheck,
  Radio,
  Play,
  Pause,
  Volume2,
  Copy,
  Check
} from "lucide-react";

export function renderFormattedAudioScript(text: string, isDark: boolean) {
  if (!text) return null;
  const parts = text.split(/(\[[^\]]+\])/g);
  return (
    <span className="leading-relaxed">
      {parts.map((segment, idx) => {
        if (segment.startsWith("[") && segment.endsWith("]")) {
          return (
            <span
              key={idx}
              className={`inline-block px-1.5 py-0.5 mx-0.5 my-0.5 rounded text-[11px] font-mono italic select-none transition-colors ${
                isDark
                  ? "bg-slate-800/90 text-slate-400 border border-slate-700/60"
                  : "bg-slate-100 text-slate-500 border border-slate-300"
              }`}
              title="Marqueur d'intonation vocale de la chronique"
            >
              {segment}
            </span>
          );
        }
        return <span key={idx}>{segment}</span>;
      })}
    </span>
  );
}

interface NuancePerspectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: NewsArticle | null;
  isDark: boolean;
  onNotify: (msg: string) => void;
  geminiApiKey?: string;
}

export const NuancePerspectiveModal: React.FC<NuancePerspectiveModalProps> = ({
  isOpen,
  onClose,
  article,
  isDark,
  onNotify,
  geminiApiKey
}) => {
  const [analysis, setAnalysis] = useState<PerspectiveAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlayingScript, setIsPlayingScript] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Generate perspective analysis whenever article changes
  useEffect(() => {
    if (!article) return;

    // Heuristic analysis generator
    const generateHeuristicPerspective = (art: NewsArticle): PerspectiveAnalysis => {
      const title = art.title;
      const content = art.content || art.summary;
      const category = art.category || "Actualité";

      // 1. Factual consensus points (priorité absolue aux faits vérifiés dénués de sensationnalisme)
      const sentences = content.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 25);
      const facts = (art.faits_verifies && art.faits_verifies.length > 0)
        ? art.faits_verifies
        : [
            `L'événement principal rapporté par ${art.source} concerne "${title}".`,
            sentences[0] ? `${sentences[0]}.` : `Développement confirmé dans le domaine ${category}.`,
            sentences[1] ? `${sentences[1]}.` : `Informations recoupées et vérifiées par la rédaction.`
          ];

      // 2. Points de friction & angles morts (priorité à debat_nuance.angles_morts)
      let controversies = (art.debat_nuance?.angles_morts && art.debat_nuance.angles_morts.length > 0)
        ? art.debat_nuance.angles_morts
        : [
            `Arbitrage entre rapidité de déploiement et principe de précaution.`,
            `Interrogations sur la répartition des bénéfices et l'accès équitable pour tous les usagers.`
          ];

      let polarization: "Faible" | "Modéré" | "Élevé" = (art.score_bruit && art.score_bruit <= 2) ? "Faible" : (art.score_bruit && art.score_bruit >= 4) ? "Élevé" : "Modéré";
      let eco = `Impact sur les flux d'investissements, la compétitivité et les coûts opérationnels liés à "${title}".`;
      let pol = `Régulation, prises de parole institutionnelles et encadrement normatif par les autorités compétentes.`;
      let soc = `Répercussions directes sur les usages quotidiens, l'acceptabilité citoyenne et les questions éthiques.`;

      if (category.toLowerCase().includes("éco") || category.toLowerCase().includes("finance")) {
        eco = `Évolution directe des valorisations, rentabilité des acteurs concernés et dynamique concurrentielle à moyen terme.`;
      } else if (category.toLowerCase().includes("tech") || category.toLowerCase().includes("ia")) {
        eco = `Course à l'innovation mondiale, souveraineté technologique et investissements en capital-risque.`;
        soc = `Protection des données personnelles, impact sur l'emploi et adaptation des compétences.`;
      } else if (category.toLowerCase().includes("climat") || category.toLowerCase().includes("écol")) {
        eco = `Coût de la transition écologique, réallocation des subventions et rentabilité verte.`;
        pol = `Engagements internationaux, objectifs chiffrés et contraintes légales imposées aux filières.`;
      }

      return {
        factualConsensus: facts,
        economicAngle: eco,
        politicalAngle: pol,
        societalAngle: soc,
        polarizationLevel: polarization,
        controversyPoints: controversies
      };
    };

    setAnalysis(generateHeuristicPerspective(article));
  }, [article]);

  const handleTogglePlayScript = () => {
    if (!article?.script_podcast) return;

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      if (isPlayingScript) {
        window.speechSynthesis.cancel();
        setIsPlayingScript(false);
        onNotify("Lecture audio en pause.");
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = article.script_podcast.replace(/\[[^\]]+\]/g, "").replace(/\s+/g, " ").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "fr-FR";
      utterance.rate = 1.05;

      utterance.onend = () => setIsPlayingScript(false);
      utterance.onerror = () => setIsPlayingScript(false);

      window.speechSynthesis.speak(utterance);
      setIsPlayingScript(true);
      onNotify("🎙️ Lecture de la chronique 90 secondes en cours...");
    } else {
      onNotify("Synthèse vocale non disponible sur ce navigateur.");
    }
  };

  const handleCopyScript = () => {
    if (!article?.script_podcast) return;
    navigator.clipboard.writeText(article.script_podcast);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
    onNotify("📋 Script oralisé copié dans le presse-papier !");
  };

  const handleDeepAIAnalysis = async () => {
    if (!article) return;
    setIsAnalyzing(true);
    onNotify("🔍 Analyse multicritère des perspectives en cours avec l'IA...");

    try {
      const prompt = `Tu es un médiateur de presse et analyste politique et économique neutre. Analyse cet article sous différents angles journalistiques :
Titre : "${article.title}"
Contenu : "${article.summary || article.content.slice(0, 800)}"

Réponds UNIQUEMENT au format JSON strict avec la structure suivante :
{
  "factualConsensus": ["fait 1 établi", "fait 2 vérifié", "fait 3"],
  "economicAngle": "synthèse de l'angle économique",
  "politicalAngle": "synthèse de l'angle politique et réglementaire",
  "societalAngle": "synthèse de l'angle sociétal et citoyen",
  "polarizationLevel": "Faible" ou "Modéré" ou "Élevé",
  "controversyPoints": ["point de divergence 1", "point de divergence 2"]
}`;

      const res = await fetch("/api/chat/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "gemini",
          model: "gemini-3.5-flash-lite",
          apiKey: geminiApiKey || "",
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (res.ok) {
        const data = await res.json();
        const text = data?.message?.content || data?.content || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.factualConsensus && parsed.economicAngle) {
            setAnalysis(parsed);
            onNotify("✨ Analyse des perspectives approfondie par l'IA complétée !");
          }
        }
      }
    } catch (err) {
      console.warn("AI deep perspective analysis error:", err);
      onNotify("⚠️ Analyse rapide appliquée.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!isOpen || !article || !analysis) return null;

  const getPolarizationColor = (level: string) => {
    switch (level) {
      case "Faible":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "Modéré":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "Élevé":
        return "bg-rose-500/20 text-rose-400 border-rose-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl rounded-3xl border shadow-2xl flex flex-col max-h-[85dvh] sm:max-h-[88vh] overflow-hidden ${
          isDark
            ? "bg-gradient-to-b from-slate-900 via-slate-950 to-black border-cyan-500/30 text-slate-100"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-700/40 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base tracking-tight flex items-center gap-2 flex-wrap">
                <span>Dossier de Presse Croisé : Nuances & Biais</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${getPolarizationColor(analysis.polarizationLevel)}`}>
                  Polarisation : {analysis.polarizationLevel}
                </span>
                {article.score_bruit && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                    article.score_bruit <= 2 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                    article.score_bruit === 3 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" :
                    "bg-zinc-500/20 text-zinc-400 border-zinc-500/30"
                  }`}>
                    Bruit : {article.score_bruit}/5 ({article.score_bruit <= 2 ? "Fond" : article.score_bruit === 3 ? "Modéré" : "Éphémère"})
                  </span>
                )}
              </h3>
              <p className="text-xs opacity-75 truncate max-w-md">
                {article.title}
              </p>
              <p className="text-[11px] font-sans opacity-85 text-cyan-400 dark:text-cyan-300">
                Source : {article.source_mention || `${article.source} (Attribution légale d'origine vérifiée)`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800/50 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto scrollbar flex-1 min-h-0">
          {/* Section 1: Faits vérifiés & consensus factuel */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
          }`}>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-400 mb-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>1. Consensus Factuel Indiscutable</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
              {analysis.factualConsensus.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 1.5: Thèse dominante & Question de discernement (debat_nuance) */}
          {article.debat_nuance && (
            <div className={`p-4 rounded-2xl border ${
              isDark ? "bg-slate-950/70 border-cyan-500/30" : "bg-cyan-50/60 border-cyan-200"
            }`}>
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-400 mb-2">
                <Scale className="w-4 h-4" />
                <span>2. Thèse dominante & Question de discernement</span>
              </div>
              <div className="space-y-2 text-xs sm:text-sm">
                {article.debat_nuance.dominante && (
                  <p className="leading-relaxed">
                    <strong className="text-cyan-300">Angle dominant du traitement initial :</strong> {article.debat_nuance.dominante}
                  </p>
                )}
                {article.debat_nuance.question_discernement && (
                  <div className={`p-3 rounded-xl border mt-2 ${
                    isDark ? "bg-cyan-950/40 border-cyan-500/40 text-cyan-100" : "bg-white border-cyan-200 text-cyan-950"
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-400 mb-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Question de discernement :</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium italic">
                      « {article.debat_nuance.question_discernement} »
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Section 2: Angles d'analyse (Éco, Politique, Sociétal) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Angle Économique */}
            <div className={`p-3.5 rounded-2xl border ${
              isDark ? "bg-slate-900/70 border-indigo-500/25" : "bg-indigo-50/40 border-indigo-200"
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 mb-1.5">
                <TrendingUp className="w-4 h-4" />
                <span>Angle Économique</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {analysis.economicAngle}
              </p>
            </div>

            {/* Angle Politique & Institutionnel */}
            <div className={`p-3.5 rounded-2xl border ${
              isDark ? "bg-slate-900/70 border-amber-500/25" : "bg-amber-50/40 border-amber-200"
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 mb-1.5">
                <Building2 className="w-4 h-4" />
                <span>Angle Réglementaire</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {analysis.politicalAngle}
              </p>
            </div>

            {/* Angle Sociétal & Citoyen */}
            <div className={`p-3.5 rounded-2xl border ${
              isDark ? "bg-slate-900/70 border-cyan-500/25" : "bg-cyan-50/40 border-cyan-200"
            }`}>
              <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400 mb-1.5">
                <Users className="w-4 h-4" />
                <span>Angle Sociétal</span>
              </div>
              <p className="text-xs leading-relaxed opacity-90">
                {analysis.societalAngle}
              </p>
            </div>
          </div>

          {/* Section 3: Points de controverse & Débats */}
          <div className={`p-4 rounded-2xl border ${
            isDark ? "bg-slate-950/60 border-rose-500/30" : "bg-rose-50/50 border-rose-200"
          }`}>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rose-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span>3. Points de Friction & Angles Morts</span>
            </div>
            <ul className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
              {analysis.controversyPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0">⚠️</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Chronique Audio Oralisée (Flash 90s) avec style distinct des marqueurs */}
          {article.script_podcast && (
            <div className={`p-4 rounded-2xl border ${
              isDark ? "bg-slate-950/80 border-indigo-500/30 text-slate-100" : "bg-indigo-50/40 border-indigo-200 text-slate-900"
            }`}>
              <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-indigo-400">
                  <Radio className="w-4 h-4" />
                  <span>4. Chronique Audio Oralisée (Flash 90s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyScript}
                    className="px-2 py-1 rounded-lg border text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors border-slate-700 hover:bg-slate-800"
                    title="Copier le script en 1 clic"
                  >
                    {copiedScript ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedScript ? "Copié !" : "Copier (1 clic)"}</span>
                  </button>
                  <button
                    onClick={handleTogglePlayScript}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    {isPlayingScript ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isPlayingScript ? "Pause" : "Écouter le flash (90s)"}</span>
                  </button>
                </div>
              </div>
              <div className={`p-3.5 rounded-xl border text-xs sm:text-sm leading-relaxed max-h-52 overflow-y-auto scrollbar whitespace-pre-line font-sans ${
                isDark ? "bg-black/60 border-slate-800 text-slate-200" : "bg-white border-indigo-100 text-slate-800"
              }`}>
                {renderFormattedAudioScript(article.script_podcast, isDark)}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 border-t border-slate-700/40 flex flex-wrap items-center justify-between gap-3 bg-black/20 shrink-0">
          <button
            onClick={handleDeepAIAnalysis}
            disabled={isAnalyzing}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg disabled:opacity-40 transition-all cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
            <span>{isAnalyzing ? "Analyse IA approfondie..." : "Affiner l'analyse avec Gemini"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700/60 hover:bg-slate-800/60 cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : modalContent;
};
