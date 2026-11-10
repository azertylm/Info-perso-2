import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Compass,
  HelpCircle,
  Volume2,
  ShieldCheck,
  Check,
  ChevronRight,
  ChevronLeft,
  X,
  Key,
  CreditCard,
  Gift,
  Newspaper,
  Smartphone,
  Copy,
  Heart,
  Bot
} from "lucide-react";

interface GuidedTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing?: () => void;
  onOpenAuth?: () => void;
  onOpenKeys?: () => void;
  isDark?: boolean;
  themeMode?: "light" | "dark";
  displayMode?: string;
  onNotify?: (msg: string) => void;
}

export default function GuidedTourModal({
  isOpen,
  onClose,
  onOpenPricing,
  onOpenAuth,
  onOpenKeys,
  isDark: isDarkProp,
  themeMode = "dark",
  displayMode = "pro",
  onNotify
}: GuidedTourModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Revenir au début à chaque ouverture
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDark = isDarkProp !== undefined ? isDarkProp : themeMode === "dark";
  const isFun = displayMode === "fun";
  const isCyber = displayMode === "cyber";
  const isWarm = displayMode === "warm";

  const STEPS = [
    {
      id: "flux-audio",
      icon: Newspaper,
      badge: "Étape 1 sur 3 • L'Information",
      title: "Mon Flux d'Actualités & Écoute 1-Clic",
      subtitle: "Une information dénuée de publicité, de popups intrusifs et d'algorithmes anxiogènes.",
      points: [
        {
          icon: Volume2,
          text: "Synthèse vocale haute fidélité : écoutez n'importe quel article en un clic avec un timbre chaleureux et naturel calibré pour la radio."
        },
        {
          icon: Copy,
          text: "Bouton de copie 1-clic : chaque synthèse et extrait clé est copiable instantanément pour vos notes ou vos partages."
        },
        {
          icon: Bot,
          text: "Esprit critique & Pourquoi : posez des questions à l'IA pour situer l'événement dans le temps long et mesurer les impacts réels."
        }
      ],
      actionLabel: "Suivant : L'Essai Gratuit",
      highlightColor: "indigo"
    },
    {
      id: "trial-managed",
      icon: Gift,
      badge: "Étape 2 sur 3 • Autonomie",
      title: "Essai Gratuit 7 Jours & Zéro Configuration",
      subtitle: "Prise en main immédiate pour le particulier : tout fonctionne dès le premier instant sans carte bancaire.",
      points: [
        {
          icon: Sparkles,
          text: "7 jours offerts sur clé Mistral managée : accédez à toutes les analyses, synthèses et chats IA sans rien paramétrer."
        },
        {
          icon: ShieldCheck,
          text: "Souveraineté & Zéro pistage : aucune revente de vos données personnelles, aucun tracker publicitaire tiers."
        },
        {
          icon: Key,
          text: "Liberté totale (BYOK) : pour les utilisateurs avancés, possibilité d'injecter vos propres clés API dans le coffre-fort."
        }
      ],
      actionLabel: "Suivant : Tarifs & Bouquet",
      highlightColor: "emerald"
    },
    {
      id: "pricing-sovereign",
      icon: CreditCard,
      badge: "Étape 3 sur 3 • Tarifs Clairs",
      title: "Tarification Simple : 15 € ou Pass 40 € / an",
      subtitle: "Un modèle économique sain et transparent édité par ALPHABETTE (La Grande-Motte).",
      points: [
        {
          icon: Check,
          text: "15 € TTC / an pour l'outil individuel InfoPerso ou 40 € TTC / an pour le Pass ALPHABETTE (accès complet aux 15 applications du bouquet)."
        },
        {
          icon: ShieldCheck,
          text: "Zéro abonnement mensuel : paiement annuel unique pour supprimer les frais bancaires intermédiaires abusifs."
        },
        {
          icon: Heart,
          text: "Codes privilèges & amis : activez un code d'invitation directement pour bénéficier d'un an d'accès sans formalités."
        }
      ],
      actionLabel: "Terminer & Explorer l'Actualité",
      highlightColor: "amber"
    }
  ];

  const currentStepData = STEPS[currentStep];
  const StepIcon = currentStepData.icon;

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(c => c + 1);
    } else {
      localStorage.setItem("infoperso_guided_tour_seen", "true");
      if (onNotify) {
        onNotify("🎉 Bienvenue sur InfoPerso ! Bonne lecture et bonne écoute.");
      }
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(c => c - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isCyber
            ? "bg-black border-cyan-500/50 text-cyan-300 font-mono shadow-[0_0_25px_rgba(6,182,212,0.25)] rounded-none"
            : isFun
              ? "bg-white border-3 border-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-3xl"
              : isWarm
                ? "bg-[#FAF6F0] border-amber-900/20 text-amber-950 font-serif"
                : isDark
                  ? "bg-zinc-950 border-zinc-800 text-zinc-100"
                  : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        {/* En-tête de la modale */}
        <div
          className={`p-4 sm:p-5 border-b flex items-start justify-between gap-3 ${
            isDark ? "border-zinc-800 bg-zinc-900/60" : "border-zinc-200 bg-zinc-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl border ${
                currentStep === 0
                  ? "bg-indigo-500/15 text-indigo-400 border-indigo-500/30"
                  : currentStep === 1
                    ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                    : "bg-amber-500/15 text-amber-400 border-amber-500/30"
              }`}
            >
              <StepIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span
                className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block mb-1 ${
                  currentStep === 0
                    ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                    : currentStep === 1
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                }`}
              >
                {currentStepData.badge}
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight leading-tight">
                {currentStepData.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              localStorage.setItem("infoperso_guided_tour_seen", "true");
              onClose();
            }}
            className="p-1.5 rounded-lg border border-transparent hover:border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Passer le guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu principal */}
        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-xs sm:text-sm opacity-85 leading-relaxed font-medium">
            {currentStepData.subtitle}
          </p>

          <div className="space-y-2.5 pt-1">
            {currentStepData.points.map((pt, idx) => {
              const PtIcon = pt.icon;
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                    isDark
                      ? "bg-zinc-900/60 border-zinc-800/80 text-zinc-200"
                      : isFun
                        ? "bg-yellow-50 border-2 border-black text-black"
                        : "bg-zinc-50 border-zinc-250 text-zinc-850"
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                    <PtIcon className="w-4 h-4" />
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {pt.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Raccourcis ou actions contextuelles selon l'étape */}
          {currentStep === 1 && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-3 text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                Essai 7 jours déjà activé sur votre navigateur
              </span>
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuth();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs shrink-0"
                >
                  Créer mon compte
                </button>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between gap-3 text-xs">
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                15 € / an (Solo) ou 40 € / an (Pass complet)
              </span>
              {onOpenPricing && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenPricing();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-[11px] transition-all cursor-pointer shadow-xs shrink-0"
                >
                  Voir les formules
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pied de page et pagination */}
        <div
          className={`p-4 border-t flex items-center justify-between gap-3 ${
            isDark ? "border-zinc-800 bg-zinc-900/40" : "border-zinc-200 bg-zinc-50"
          }`}
        >
          {/* Indicateurs de progression (3 points) */}
          <div className="flex items-center gap-2">
            {STEPS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === idx
                    ? "w-7 bg-indigo-500"
                    : "w-2 bg-zinc-600 hover:bg-zinc-400"
                }`}
                title={`Aller à l'étape ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="px-3 py-2 rounded-xl text-xs font-bold border border-zinc-700 hover:bg-zinc-800 text-zinc-300 transition-all cursor-pointer flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Précédent</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-lg flex items-center gap-1.5 ${
                currentStep === STEPS.length - 1
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                  : "bg-indigo-600 hover:bg-indigo-500"
              }`}
            >
              <span>{currentStepData.actionLabel}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Bulle d'Aide Flottante Intelligente (Accessible sur Mobile & Desktop)
 */
interface FloatingHelpBeaconProps {
  onOpenTour: () => void;
  onOpenPricing: () => void;
  isDark?: boolean;
  themeMode?: "light" | "dark";
  displayMode?: string;
}

export function FloatingHelpBeacon({
  onOpenTour,
  onOpenPricing,
  isDark: isDarkProp,
  themeMode = "dark",
  displayMode = "pro"
}: FloatingHelpBeaconProps) {
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem("infoperso_beacon_dismissed") === "true";
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const isDark = isDarkProp !== undefined ? isDarkProp : themeMode === "dark";
  const isFun = displayMode === "fun";

  return (
    <aside aria-label="Assistance et prise en main" className="fixed bottom-16 md:bottom-5 right-3 md:right-5 z-40 flex flex-col items-end gap-2">
      {/* Fenêtre bulle dépliée */}
      {isExpanded && (
        <div
          className={`w-72 sm:w-80 p-4 rounded-2xl border shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            isDark
              ? "bg-zinc-950/95 border-indigo-500/30 text-zinc-100 backdrop-blur-md"
              : isFun
                ? "bg-yellow-200 border-3 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white/95 border-zinc-300 text-zinc-900 backdrop-blur-md"
          }`}
        >
          <div className="flex items-start justify-between gap-2 border-b border-zinc-800/40 pb-2">
            <div className="flex items-center gap-1.5 font-black text-xs text-indigo-400">
              <Compass className="w-4 h-4" />
              <span>Guide Rapide InfoPerso</span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-zinc-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs opacity-85 leading-relaxed">
            Bienvenue sur votre portail d'actualité souverain ! Voici comment en tirer le maximum en 3 clics :
          </p>

          <div className="space-y-1.5 text-[11px] font-medium">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <span><strong>Écoute audio 1-clic :</strong> sur chaque article.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span><strong>Essai 7 jours :</strong> actif sans carte bancaire.</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span><strong>Formules :</strong> 15 €/an ou Pass complet 40 €/an.</span>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenTour();
              }}
              className="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-all cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Visite Guidée</span>
            </button>

            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenPricing();
              }}
              className="py-1.5 px-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all cursor-pointer"
            >
              Tarifs
            </button>
          </div>
        </div>
      )}

      {/* Bouton de la bulle d'aide / déclencheur */}
      <button
        onClick={() => setIsExpanded(prev => !prev)}
        className={`group flex items-center gap-2 px-3 py-2 rounded-full border shadow-xl cursor-pointer transition-all hover:scale-105 active:scale-95 ${
          isExpanded
            ? "bg-indigo-600 text-white border-indigo-400 ring-2 ring-indigo-500/40"
            : isDark
              ? "bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 border-zinc-700/80 backdrop-blur-md"
              : "bg-white hover:bg-zinc-50 text-zinc-900 border-zinc-300 backdrop-blur-md"
        }`}
        title="Besoin d'aide ? Découvrir InfoPerso en 3 clics"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
        </span>
        <HelpCircle className="w-4 h-4 text-indigo-400 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-bold hidden sm:inline">Comment ça marche ?</span>
        <span className="text-xs font-bold sm:hidden">Aide</span>
      </button>
    </aside>
  );
}
