import React, { useState, useEffect } from "react";
import { lireMembre } from "../lib/membreAlphabette";
import {
  Sparkles,
  Key,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Info,
  Heart
} from "lucide-react";
import { getQuotaStatus, QuotaStatus } from "../lib/quotaManager";

interface AlphabetteNavbarProps {
  onOpenPricing: () => void;
  onOpenKeyring: () => void;
  onOpenDonation?: () => void;
  themeMode?: "light" | "dark";
  activeApp?: string;
}

export const ALPHABETTE_APPS = [
  { id: "proxilien", name: "Proxilien", subtitle: "Proximité & Artisans", icon: "📍" },
  { id: "infoperso", name: "Info Perso", subtitle: "Actualité & Synthèse IA", icon: "📰", current: true },
  { id: "focusnews", name: "Focus News", subtitle: "Veille & Décryptage", icon: "🎯" },
  { id: "loeildelatelier", name: "L'Œil de l'Atelier", subtitle: "Gestion & Rentabilité", icon: "🏺" },
  { id: "papierpapier", name: "Papier Papier", subtitle: "Édition & Rédaction", icon: "✍️" },
  { id: "iadebat", name: "IA Débat", subtitle: "Contradiction & Pensée", icon: "⚖️" },
];

export default function AlphabetteNavbar({
  onOpenPricing,
  onOpenKeyring,
  onOpenDonation,
  themeMode = "dark",
  activeApp = "infoperso"
}: AlphabetteNavbarProps) {
  const [quota, setQuota] = useState<QuotaStatus>(getQuotaStatus);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setQuota(getQuotaStatus());
    window.addEventListener("alphabette_quota_updated", update);
    const interval = setInterval(update, 5000);
    return () => {
      window.removeEventListener("alphabette_quota_updated", update);
      clearInterval(interval);
    };
  }, []);

  const isDark = themeMode === "dark";

  return (
    <div
      className={`w-full border-b text-xs select-none transition-colors ${
        isDark
          ? "bg-slate-950/95 border-slate-800 text-zinc-300"
          : "bg-slate-100/95 border-slate-200 text-slate-700"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-1 flex items-center justify-end gap-2 overflow-x-auto scrollbar-none">
        {/* Quota & Access Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 text-[11px]">
          {quota.isSubscribed ? (
            <span
              onClick={onOpenKeyring}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold cursor-pointer hover:bg-emerald-500/20"
              title={lireMembre() ? "Inscrit(e) avec un code d'invitation : requêtes illimitées" : "Accès Actif : Requêtes illimitées"}
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>
                {lireMembre()
                  ? `${lireMembre()!.prenom} · accès offert`
                  : localStorage.getItem("alphabette_user_plan") === "lifetime_pioneer" ||
                localStorage.getItem("alphabette_lifetime_pioneer") === "true"
                  ? "Pionnier Gratuit à Vie"
                  : "Abonné (Illimité BYOK)"}
              </span>
            </span>
          ) : (
            <div className="flex items-center gap-1.5">
              <span
                onClick={onOpenKeyring}
                className={`flex items-center gap-1 px-2 py-0.5 rounded-md border font-semibold cursor-pointer transition-all ${
                  isDark
                    ? "bg-slate-900 border-zinc-800 text-zinc-300 hover:border-zinc-700"
                    : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
                title="IA : ajoutez votre propre clé API"
              >
                <span>IA : votre clé API</span>
              </span>

              <button
                onClick={onOpenPricing}
                className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/30 font-bold transition-all cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span className="text-[11px]">Tarifs</span>
              </button>
            </div>
          )}

          {/* Trousseau API direct button */}
          <button
            onClick={onOpenKeyring}
            className={`p-1 sm:px-2 sm:py-0.5 rounded-md border flex items-center gap-1 transition-all cursor-pointer ${
              isDark
                ? "bg-slate-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                : "bg-white border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
            title="Panneau Trousseau API (Mistral, Google, OpenAI, Anthropic, DeepSeek, Grok) - Facturation au prix coûtant"
          >
            <Key className="w-3 h-3 text-indigo-400" />
            <span className="hidden md:inline font-medium">Trousseau API</span>
          </button>
        </div>
      </div>
    </div>
  );
}
