import { Info, CreditCard } from "lucide-react";
import { RibInfo } from "../types";

interface DonationSectionProps {
  rib: RibInfo;
  onRibChange: (newRib: RibInfo) => void;
  onNotify: (msg: string) => void;
  displayMode?: "sobre" | "pro" | "warm" | "cyber" | "fun";
  themeMode?: "light" | "dark";
}

/**
 * Page « Soutenir / Tarifs » volontairement sobre et sans rien de simulé :
 * aucun paiement, aucun faux statut « Fondateur », aucun compteur de places.
 * Le paiement en ligne n'est pas ouvert ; seuls les tarifs prévus sont affichés.
 */
export default function DonationSection({ themeMode = "dark" }: DonationSectionProps) {
  const isDark = themeMode === "dark";
  return (
    <div
      id="donations-and-rib-view"
      className={`max-w-xl mx-auto rounded-2xl border p-5 space-y-4 text-sm ${
        isDark ? "bg-slate-900/90 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-900"
      }`}
    >
      <div className="flex items-center gap-2 font-bold text-base">
        <CreditCard className="w-5 h-5 shrink-0" />
        <h2>Tarifs Alphabette</h2>
      </div>
      <p className="flex items-start gap-2 leading-relaxed">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <span>
          <strong>Aujourd'hui, Info Perso s'utilise librement.</strong> Le paiement en ligne n'est pas encore ouvert :
          rien ne peut être payé ni activé depuis cette page.
        </span>
      </p>
      <ul className="space-y-1 leading-relaxed">
        <li>Tarif prévu pour Info Perso : <strong>15 € par an</strong></li>
        <li>Tarif prévu pour le Pass Alphabette (toutes les applications) : <strong>40 € par an</strong></li>
      </ul>
      <p className="text-xs opacity-80 leading-relaxed">
        Les fonctions d'intelligence artificielle utilisent votre propre clé API, à ajouter dans le Trousseau de clés.
      </p>
    </div>
  );
}
