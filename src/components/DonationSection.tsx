import React, { useState } from "react";
import { CreditCard, Copy, Check, Heart, Info, Coins, QrCode, Edit3, Save, Share2 } from "lucide-react";
import { RibInfo } from "../types";

interface DonationSectionProps {
  rib: RibInfo;
  onRibChange: (newRib: RibInfo) => void;
  onNotify: (msg: string) => void;
  displayMode?: "sobre" | "pro" | "warm" | "cyber" | "fun";
  themeMode?: "light" | "dark";
}

export default function DonationSection({
  rib,
  onRibChange,
  onNotify,
  displayMode = "pro",
  themeMode = "dark"
}: DonationSectionProps) {
  const isSobre = displayMode === "sobre";
  const isWarm = displayMode === "warm";
  const isCyber = displayMode === "cyber";
  const isFun = displayMode === "fun";
  const isPro = displayMode === "pro";
  const isDark = themeMode === "dark";

  // Class helper selectors
  const getPanelClass = () => {
    if (isSobre) return isDark ? "bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-xs text-white" : "bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs text-zinc-900";
    if (isWarm) return isDark ? "bg-[#2b2420] border border-amber-900/30 rounded-2xl p-5 shadow-xs font-serif text-amber-50" : "bg-[#FDFBF7] border border-amber-900/10 rounded-2xl p-5 shadow-xs font-serif text-amber-950";
    if (isCyber) return "bg-zinc-950 border border-cyan-500/30 rounded-none p-5 shadow-md font-mono text-cyan-300";
    if (isFun) return "bg-pink-100 border-3 border-black rounded-3xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black";
    return isDark 
      ? "bg-slate-900/90 backdrop-blur-md border border-indigo-500/20 rounded-2xl p-5 shadow-xl text-slate-100" 
      : "bg-white border border-slate-200 rounded-2xl p-5 shadow-md text-slate-900";
  };

  const getSubTitleClass = () => {
    if (isSobre) return isDark ? "text-white font-bold font-sans" : "text-zinc-900 font-bold font-sans";
    if (isWarm) return isDark ? "text-amber-100 font-bold font-serif" : "text-amber-950 font-bold font-serif";
    if (isCyber) return "text-[#00ffcc] font-black font-mono";
    if (isFun) return "text-black font-black font-sans uppercase italic";
    return isDark ? "text-white font-sans font-bold" : "text-slate-950 font-sans font-bold";
  };

  const getInputClass = () => {
    if (isSobre) return isDark 
      ? "w-full bg-zinc-950 border border-zinc-750 focus:border-zinc-500 rounded-lg p-2.5 text-xs text-white outline-hidden transition-all" 
      : "w-full bg-zinc-50 border border-zinc-300 focus:border-zinc-600 rounded-lg p-2.5 text-xs text-zinc-900 outline-hidden transition-all";
    if (isWarm) return isDark 
      ? "w-full bg-[#1e1916] border border-amber-900/40 focus:border-amber-600 rounded-lg p-2.5 text-xs text-amber-50 outline-hidden transition-all font-serif" 
      : "w-full bg-[#FAF6F0] border border-amber-900/20 focus:border-amber-900 rounded-lg p-2.5 text-xs text-amber-950 outline-hidden transition-all font-serif";
    if (isCyber) return "w-full bg-black border border-cyan-500/40 focus:border-cyan-400 rounded-none p-2.5 text-xs text-cyan-300 outline-hidden transition-all font-mono";
    if (isFun) return "w-full bg-white border-3 border-black rounded-xl p-2.5 text-xs text-black font-bold outline-hidden transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]";
    return isDark 
      ? "w-full bg-slate-950 border border-slate-750 rounded-lg p-2.5 text-xs text-white outline-hidden focus:border-indigo-400 transition-colors" 
      : "w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-medium outline-hidden focus:border-indigo-600 transition-colors shadow-xs";
  };

  const getLabelClass = () => {
    if (isSobre) return isDark ? "block text-[11px] text-zinc-300 uppercase tracking-widest mb-1.5 font-bold" : "block text-[11px] text-zinc-700 uppercase tracking-widest mb-1.5 font-bold";
    if (isWarm) return isDark ? "block text-[11px] text-amber-200 uppercase tracking-widest mb-1.5 font-bold font-serif" : "block text-[11px] text-amber-900 uppercase tracking-widest mb-1.5 font-bold font-serif";
    if (isCyber) return "block text-[11px] text-cyan-400 uppercase tracking-widest mb-1.5 font-mono font-bold";
    if (isFun) return "block text-[11px] text-black uppercase font-black mb-1.5";
    return isDark ? "block text-[11px] text-slate-300 uppercase tracking-widest mb-1.5 font-bold" : "block text-[11px] text-slate-800 uppercase tracking-widest mb-1.5 font-bold";
  };

  const getButtonClass = (isActive: boolean = false) => {
    if (isSobre) return `py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${isActive ? "bg-zinc-950 border-zinc-950 text-white" : isDark ? "bg-zinc-900 border-zinc-750 text-zinc-200 hover:bg-zinc-800" : "bg-white border-zinc-300 text-zinc-800 hover:bg-zinc-50"}`;
    if (isWarm) return `py-2 rounded-lg text-xs font-serif font-bold transition-all border cursor-pointer ${isActive ? "bg-amber-900 border-amber-900 text-white" : isDark ? "bg-[#332a24] border-amber-900/30 text-amber-100 hover:bg-[#3d322b]" : "bg-[#FAF6F0] border-amber-900/20 text-amber-950 hover:bg-[#F2E6D0]"}`;
    if (isCyber) return `py-2 rounded-none text-xs font-mono transition-all border cursor-pointer ${isActive ? "bg-cyan-500 border-cyan-400 text-black shadow-[0_0_8px_rgba(6,182,212,0.3)] font-bold" : "bg-black border-cyan-500/40 text-cyan-300 hover:border-cyan-400"}`;
    if (isFun) return `py-2 rounded-xl text-xs font-black transition-all border-3 border-black cursor-pointer ${isActive ? "bg-fuchsia-300 text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] scale-102" : "bg-white text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-zinc-50"}`;
    return `py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
      isActive 
        ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-500/25" 
        : isDark 
          ? "bg-slate-900 border border-slate-750 hover:border-slate-600 text-slate-200 hover:text-white" 
          : "bg-white border border-slate-300 hover:border-slate-400 text-slate-800 hover:bg-slate-50 shadow-xs"
    }`;
  };

  const getActionButtonClass = () => {
    if (isSobre) return "w-full py-2.5 bg-zinc-900 hover:bg-black text-white text-xs font-sans font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer";
    if (isWarm) return "w-full py-2.5 bg-amber-900 hover:bg-amber-950 text-white text-xs font-serif font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer";
    if (isCyber) return "w-full py-2.5 bg-black hover:bg-zinc-900 text-cyan-400 text-xs font-mono font-bold border border-cyan-400/50 hover:border-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center justify-center gap-1.5 transition-all cursor-pointer";
    if (isFun) return "w-full py-2.5 bg-yellow-300 hover:bg-yellow-400 text-black text-xs font-sans font-black border-3 border-black rounded-xl flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer";
    return "w-full py-2.5 bg-linear-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-sans font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-indigo-500/20";
  };
  const [isEditing, setIsEditing] = useState(false);
  const [tempRib, setTempRib] = useState<RibInfo>({ ...rib });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | "libre">(20);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [donationType, setDonationType] = useState<"virement" | "cb">("virement");
  const [cbSimStep, setCbSimStep] = useState<"idle" | "submitting" | "success">("idle");

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    onNotify(`Copié avec succès : ${fieldName}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSaveRib = () => {
    // Basic verification
    if (!tempRib.iban || !tempRib.bic || !tempRib.accountHolder) {
      onNotify("⚠️ Veuillez remplir le titulaire, l'IBAN et le BIC.");
      return;
    }
    onRibChange(tempRib);
    setIsEditing(false);
    onNotify("✅ Coordonnées bancaires (RIB) enregistrées !");
  };

  const handleSimulateCb = (e: React.FormEvent) => {
    e.preventDefault();
    setCbSimStep("submitting");
    setTimeout(() => {
      setCbSimStep("success");
      onNotify(`❤️ Merci infiniment pour votre don de ${donationAmount === "libre" ? customAmount : donationAmount}€ !`);
    }, 1500);
  };

  const finalDonationAmount = donationAmount === "libre" ? Number(customAmount) || 0 : donationAmount;

  return (
    <div id="donations-and-rib-view" className="max-w-4xl mx-auto space-y-6">
      {/* Introduction */}
      <div className={`flex flex-col gap-1 border-b pb-4 ${isSobre ? isDark ? "border-zinc-800" : "border-zinc-200" : isWarm ? isDark ? "border-amber-900/30" : "border-amber-900/15" : isCyber ? "border-cyan-500/25" : isFun ? "border-black" : isDark ? "border-slate-800" : "border-slate-200"}`}>
        <h2 className={`font-bold tracking-tight text-2xl flex items-center gap-2 ${
          isSobre ? isDark ? "text-white font-sans" : "text-zinc-950 font-sans" :
          isWarm ? isDark ? "text-amber-100 font-serif" : "text-amber-950 font-serif" :
          isCyber ? "text-[#00ffcc] font-mono" :
          isFun ? "text-black font-black" :
          isDark ? "text-white font-sans" : "text-slate-950 font-sans font-extrabold"
        }`}>
          <Heart className={`w-5 h-5 text-rose-500 animate-pulse ${isFun ? "fill-rose-500" : "fill-rose-500/20"}`} />
          Espace Dons &amp; Soutien Financier
        </h2>
        <p className={`text-sm ${
          isSobre ? isDark ? "text-zinc-300 font-sans" : "text-zinc-700 font-sans" :
          isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-900 font-serif" :
          isCyber ? "text-cyan-300 font-mono" :
          isFun ? "text-black font-semibold" :
          isDark ? "text-slate-200 font-sans" : "text-slate-700 font-sans font-medium"
        }`}>
          Soutenez le développement d'InfoPerso et l'écosystème souverain Alphabette. Configurez votre RIB ou faites un virement instantané sécurisé.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: RIB Display */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-2 ${
              isSobre ? isDark ? "text-zinc-200 font-sans" : "text-zinc-900 font-sans" :
              isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-950 font-serif" :
              isCyber ? "text-cyan-400 font-mono" :
              isFun ? "text-black font-black" :
              isDark ? "text-slate-200 font-sans font-bold" : "text-slate-900 font-sans font-bold"
            }`}>
              <CreditCard className={`w-4 h-4 ${isCyber ? "text-cyan-400" : isFun ? "text-black" : isDark ? "text-cyan-400" : "text-indigo-600"}`} />
              Relevé d'Identité Bancaire (RIB)
            </h3>

            <button
              onClick={() => {
                if (isEditing) {
                  setTempRib({ ...rib });
                }
                setIsEditing(!isEditing);
              }}
              className={`text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer shadow-xs border font-semibold ${
                isSobre ? isDark ? "bg-zinc-900 border-zinc-750 text-white hover:bg-zinc-800" : "bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-100" :
                isWarm ? isDark ? "bg-[#332a24] border-amber-900/30 text-amber-100 hover:bg-[#3d322b]" : "bg-[#FAF6F0] border-amber-900/20 text-amber-950 hover:bg-[#F2E6D0]" :
                isCyber ? "bg-black border-cyan-400 text-cyan-300 font-mono hover:bg-zinc-900" :
                isFun ? "bg-yellow-300 border-2 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5" :
                isDark ? "bg-slate-900 border border-slate-750 text-slate-100 hover:text-white hover:border-indigo-400" : "bg-white border border-slate-300 text-slate-900 hover:bg-slate-50 hover:border-slate-400 shadow-xs"
              }`}
            >
              <Edit3 className={`w-3.5 h-3.5 ${isFun ? "text-black" : isDark ? "text-cyan-400" : "text-indigo-600"}`} />
              {isEditing ? "Annuler l'édition" : "Modifier mon RIB"}
            </button>
          </div>

          {isEditing ? (
            /* RIB Editor form */
            <div className={getPanelClass() + " space-y-4 shadow-xl"}>
              <h4 className={`font-bold text-sm flex items-center gap-1.5 ${getSubTitleClass()}`}>
                <Coins className={`w-4 h-4 ${isCyber ? "text-[#00ffcc]" : isFun ? "text-black" : isDark ? "text-cyan-400" : "text-indigo-600"}`} />
                Configuration de votre RIB personnel
              </h4>
              <p className={`text-xs leading-normal ${
                isSobre ? isDark ? "text-zinc-300 font-sans" : "text-zinc-700 font-sans" :
                isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-900 font-serif" :
                isCyber ? "text-cyan-300 font-mono" :
                isFun ? "text-black font-medium" :
                isDark ? "text-slate-200 font-sans" : "text-slate-700 font-sans font-medium"
              }`}>
                Saisissez les informations de votre RIB ci-dessous. Elles s'afficheront sur la carte ci-dessous pour que vos utilisateurs puissent faire des dons.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className={getLabelClass()}>Nom de la Banque</label>
                  <input
                    type="text"
                    value={tempRib.bankName}
                    onChange={(e) => setTempRib({ ...tempRib, bankName: e.target.value })}
                    className={getInputClass()}
                    placeholder="ex: Crédit Agricole Occitanie"
                  />
                </div>
                <div>
                  <label className={getLabelClass()}>Titulaire du Compte</label>
                  <input
                    type="text"
                    value={tempRib.accountHolder}
                    onChange={(e) => setTempRib({ ...tempRib, accountHolder: e.target.value })}
                    className={getInputClass()}
                    placeholder="M. Jean DUPONT"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className={getLabelClass()}>Code Banque</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={tempRib.bankCode}
                    onChange={(e) => setTempRib({ ...tempRib, bankCode: e.target.value })}
                    className={getInputClass() + " text-center font-mono"}
                    placeholder="12345"
                  />
                </div>
                <div>
                  <label className={getLabelClass()}>Code Guichet</label>
                  <input
                    type="text"
                    maxLength={5}
                    value={tempRib.branchCode}
                    onChange={(e) => setTempRib({ ...tempRib, branchCode: e.target.value })}
                    className={getInputClass() + " text-center font-mono"}
                    placeholder="67890"
                  />
                </div>
                <div className="col-span-2">
                  <label className={getLabelClass()}>Numéro de Compte</label>
                  <input
                    type="text"
                    maxLength={11}
                    value={tempRib.accountNumber}
                    onChange={(e) => setTempRib({ ...tempRib, accountNumber: e.target.value })}
                    className={getInputClass() + " text-center font-mono"}
                    placeholder="00012345678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className={getLabelClass()}>Code IBAN</label>
                  <input
                    type="text"
                    value={tempRib.iban}
                    onChange={(e) => setTempRib({ ...tempRib, iban: e.target.value })}
                    className={getInputClass() + " font-mono"}
                    placeholder="FR76 1234 5678 9012 3456 7890 123"
                  />
                </div>
                <div>
                  <label className={getLabelClass()}>Code BIC</label>
                  <input
                    type="text"
                    value={tempRib.bic}
                    onChange={(e) => setTempRib({ ...tempRib, bic: e.target.value })}
                    className={getInputClass() + " font-mono text-center"}
                    placeholder="CRCAFR2RXXX"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveRib}
                className={getActionButtonClass()}
              >
                <Save className="w-4 h-4" />
                Enregistrer mon RIB
              </button>
            </div>
          ) : (
            /* Styled RIB Slip Render */
            <div id="french-rib-card" className={`rounded-2xl overflow-hidden font-mono relative transition-all duration-300 ${
              isSobre ? isDark ? "bg-zinc-900 border border-zinc-750 text-zinc-100 shadow-md" : "bg-zinc-50 border border-zinc-300 text-zinc-900 shadow-xs" :
              isWarm ? isDark ? "bg-[#2b2420] border border-amber-900/30 text-amber-100 font-serif shadow-md" : "bg-[#FDFBF7] border border-amber-900/20 text-amber-950 font-serif shadow-xs" :
              isCyber ? "bg-black border border-cyan-400 text-cyan-300 font-mono shadow-md" :
              isFun ? "bg-white border-3 border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-2xl" :
              isDark ? "bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 border border-indigo-500/30 text-white shadow-2xl" : "bg-gradient-to-br from-white via-indigo-50/50 to-slate-100 border-2 border-indigo-200 text-slate-950 shadow-lg"
            }`}>
              {!isSobre && !isWarm && (
                <>
                  <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute -left-20 -top-20 w-60 h-60 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
                </>
              )}

              {/* Slip Header */}
              <div className={`p-4 flex items-center justify-between relative ${
                isSobre ? isDark ? "bg-zinc-950 border-b border-zinc-800 text-zinc-200" : "bg-zinc-100 border-b border-zinc-200 text-zinc-900" :
                isWarm ? isDark ? "bg-[#1f1916] border-b border-amber-900/30 text-amber-100" : "bg-[#FAF6F0] border-b border-amber-900/15 text-amber-950" :
                isCyber ? "bg-black border-b border-cyan-500/40 text-cyan-300" :
                isFun ? "bg-yellow-300 border-b-3 border-black font-black text-black" :
                isDark ? "bg-slate-950/80 border-b border-slate-800 text-white" : "bg-slate-100 border-b border-slate-200 text-slate-950"
              }`}>
                <span className={
                  isSobre ? isDark ? "text-[10px] text-zinc-300 font-sans font-bold uppercase tracking-wider" : "text-[10px] text-zinc-700 font-sans font-bold uppercase tracking-wider" :
                  isWarm ? isDark ? "text-[10px] text-amber-200 font-serif uppercase tracking-wider font-bold" : "text-[10px] text-amber-900 font-serif uppercase tracking-wider font-bold" :
                  isCyber ? "text-[10px] text-cyan-400 font-mono tracking-widest font-bold" :
                  isFun ? "text-xs text-black font-sans font-black uppercase" :
                  isDark ? "text-[10px] text-cyan-300 font-sans font-extrabold tracking-[0.2em] uppercase" : "text-[10px] text-indigo-800 font-sans font-extrabold tracking-[0.2em] uppercase"
                }>
                  RELEVÉ D'IDENTITÉ BANCAIRE
                </span>
                <span className={
                  isSobre ? isDark ? "text-xs font-bold text-white" : "text-xs font-bold text-zinc-950" :
                  isWarm ? isDark ? "text-xs font-serif font-bold text-amber-100" : "text-xs font-serif font-bold text-amber-950" :
                  isCyber ? "text-xs font-mono font-bold text-[#00ffcc]" :
                  isFun ? "text-xs font-sans font-black text-black uppercase" :
                  isDark ? "text-xs text-indigo-300 font-sans font-bold uppercase tracking-wider" : "text-xs text-indigo-950 font-sans font-black uppercase tracking-wider"
                }>
                  {rib.bankName || "BANQUE GENERALE"}
                </span>
              </div>

              {/* Slip Details Grid */}
              <div className="p-5 space-y-4 text-xs relative">
                {/* Account Holder */}
                <div>
                  <span className={
                    isSobre ? isDark ? "block text-[9px] text-zinc-300 uppercase tracking-[0.25em] font-bold" : "block text-[9px] text-zinc-600 uppercase tracking-[0.25em] font-bold" :
                    isWarm ? isDark ? "block text-[9px] text-amber-200 uppercase tracking-[0.25em] font-bold" : "block text-[9px] text-amber-900 uppercase tracking-[0.25em] font-bold" :
                    isCyber ? "block text-[9px] text-cyan-400 uppercase tracking-widest font-bold" :
                    isFun ? "block text-[9px] text-black uppercase font-black" :
                    isDark ? "block text-[9px] text-slate-300 uppercase tracking-[0.25em] font-bold" : "block text-[9px] text-slate-600 uppercase tracking-[0.25em] font-bold"
                  }>Titulaire du compte</span>
                  <span className={`text-sm uppercase tracking-wide ${
                    isSobre ? isDark ? "text-white font-bold" : "text-zinc-950 font-bold" :
                    isWarm ? isDark ? "text-amber-100 font-serif font-bold" : "text-amber-950 font-serif font-bold" :
                    isCyber ? "text-[#00ffcc] font-mono font-bold" :
                    isFun ? "text-black font-sans font-black" :
                    isDark ? "text-sm font-bold text-white uppercase tracking-wide" : "text-sm font-extrabold text-slate-950 uppercase tracking-wide"
                  }`}>{rib.accountHolder}</span>
                </div>

                {/* Classic French RIB Table */}
                <div className={
                  isSobre ? isDark ? "border border-zinc-750 rounded-xl overflow-hidden bg-zinc-950" : "border border-zinc-300 rounded-xl overflow-hidden bg-zinc-100" :
                  isWarm ? isDark ? "border border-amber-900/30 rounded-xl overflow-hidden bg-[#1f1916]" : "border border-amber-900/15 rounded-xl overflow-hidden bg-amber-100/10" :
                  isCyber ? "border border-cyan-400/40 rounded-none overflow-hidden bg-black" :
                  isFun ? "border-3 border-black rounded-xl overflow-hidden bg-yellow-50" :
                  isDark ? "border border-slate-750 rounded-xl overflow-hidden bg-slate-950" : "border border-slate-300 rounded-xl overflow-hidden bg-white shadow-xs"
                }>
                  <div className={
                    isSobre ? isDark ? "grid grid-cols-5 text-center bg-zinc-850 text-[9px] text-zinc-200 uppercase py-2 border-b border-zinc-750 font-sans font-bold" : "grid grid-cols-5 text-center bg-zinc-200 text-[9px] text-zinc-800 uppercase py-2 border-b border-zinc-300 font-sans font-bold" :
                    isWarm ? isDark ? "grid grid-cols-5 text-center bg-[#332a24] text-[9px] text-amber-200 uppercase py-2 border-b border-amber-900/30 font-serif font-bold" : "grid grid-cols-5 text-center bg-amber-100/50 text-[9px] text-amber-950 uppercase py-2 border-b border-amber-900/20 font-serif font-bold" :
                    isCyber ? "grid grid-cols-5 text-center bg-zinc-950 text-[9px] text-cyan-300 uppercase py-2 border-b border-cyan-500/40 font-mono font-bold" :
                    isFun ? "grid grid-cols-5 text-center bg-fuchsia-200 text-[9px] text-black uppercase py-2 border-b-2 border-black font-sans font-black" :
                    isDark ? "grid grid-cols-5 text-center bg-slate-900 text-[9px] text-slate-200 uppercase py-2 border-b border-slate-750 font-sans font-bold" : "grid grid-cols-5 text-center bg-slate-150 text-[9px] text-slate-800 uppercase py-2 border-b border-slate-300 font-sans font-extrabold"
                  }>
                    <div>Code Banque</div>
                    <div>Code Guichet</div>
                    <div className="col-span-2">Numéro de compte</div>
                    <div>Clé RIB</div>
                  </div>
                  <div className={
                    isSobre ? isDark ? "grid grid-cols-5 text-center text-white py-2.5 font-bold text-[11px]" : "grid grid-cols-5 text-center text-zinc-950 py-2.5 font-bold text-[11px]" :
                    isWarm ? isDark ? "grid grid-cols-5 text-center text-amber-100 py-2.5 font-serif font-bold text-[11px]" : "grid grid-cols-5 text-center text-amber-950 py-2.5 font-serif font-bold text-[11px]" :
                    isCyber ? "grid grid-cols-5 text-center text-[#00ffcc] py-2.5 font-mono font-bold text-[11px]" :
                    isFun ? "grid grid-cols-5 text-center text-black py-2.5 font-sans font-black text-[11px]" :
                    isDark ? "grid grid-cols-5 text-center text-slate-100 py-2.5 font-bold text-[11px]" : "grid grid-cols-5 text-center text-slate-950 py-2.5 font-extrabold text-[11px]"
                  }>
                    <div className={isSobre ? isDark ? "border-r border-zinc-800" : "border-r border-zinc-200" : isWarm ? isDark ? "border-r border-amber-900/30" : "border-r border-amber-900/10" : isCyber ? "border-r border-cyan-500/20" : isFun ? "border-r-2 border-black" : isDark ? "border-r border-slate-800" : "border-r border-slate-200"}>{rib.bankCode || "12345"}</div>
                    <div className={isSobre ? isDark ? "border-r border-zinc-800" : "border-r border-zinc-200" : isWarm ? isDark ? "border-r border-amber-900/30" : "border-r border-amber-900/10" : isCyber ? "border-r border-cyan-500/20" : isFun ? "border-r-2 border-black" : isDark ? "border-r border-slate-800" : "border-r border-slate-200"}>{rib.branchCode || "67890"}</div>
                    <div className={`col-span-2 font-bold ${isSobre ? isDark ? "border-r border-zinc-800 text-white" : "border-r border-zinc-200 text-zinc-950" : isWarm ? isDark ? "border-r border-amber-900/30 text-amber-100" : "border-r border-amber-900/10 text-amber-950" : isCyber ? "border-r border-cyan-500/20 text-cyan-300" : isFun ? "border-r-2 border-black text-black" : isDark ? "border-r border-slate-800 text-cyan-300" : "border-r border-slate-200 text-indigo-950"}`}>{rib.accountNumber || "00012345678"}</div>
                    <div className="font-bold">{rib.ribKey || "90"}</div>
                  </div>
                </div>

                {/* IBAN Section */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={
                      isSobre ? isDark ? "text-[9px] text-zinc-300 uppercase tracking-[0.25em] font-bold" : "text-[9px] text-zinc-600 uppercase tracking-[0.25em] font-bold" :
                      isWarm ? isDark ? "text-[9px] text-amber-200 uppercase tracking-[0.25em] font-bold" : "text-[9px] text-amber-900 uppercase tracking-[0.25em] font-bold" :
                      isCyber ? "text-[9px] text-cyan-400 uppercase tracking-widest font-bold" :
                      isFun ? "text-[9px] text-black uppercase font-black" :
                      isDark ? "text-[9px] text-slate-300 uppercase tracking-[0.25em] font-bold" : "text-[9px] text-slate-700 uppercase tracking-[0.25em] font-extrabold"
                    }>Code IBAN (International Bank Account Number)</span>
                    <button
                      onClick={() => handleCopy(rib.iban, "IBAN")}
                      className={`p-1 transition-colors cursor-pointer flex items-center gap-1 ${isFun ? "text-black hover:text-rose-500" : isDark ? "hover:text-cyan-300 text-cyan-400 font-bold" : "hover:text-indigo-800 text-indigo-600 font-bold"}`}
                      title="Copier l'IBAN"
                    >
                      {copiedField === "IBAN" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">Copier</span>
                    </button>
                  </div>
                  <div className={
                    isSobre ? isDark ? "bg-zinc-950 p-2.5 rounded-lg border border-zinc-750 text-white select-all font-bold tracking-wider text-[11px] sm:text-xs" : "bg-zinc-150 p-2.5 rounded-lg border border-zinc-350 text-zinc-950 select-all font-bold tracking-wider text-[11px] sm:text-xs" :
                    isWarm ? isDark ? "bg-[#1f1916] p-2.5 rounded-lg border border-amber-900/30 text-amber-100 select-all font-serif font-bold tracking-wider text-[11px] sm:text-xs" : "bg-[#FAF6F0] p-2.5 rounded-lg border border-amber-900/20 text-amber-950 select-all font-serif font-bold tracking-wider text-[11px] sm:text-xs" :
                    isCyber ? "bg-black p-2.5 border border-cyan-400/50 text-cyan-300 select-all font-mono font-bold tracking-wider text-[11px] sm:text-xs" :
                    isFun ? "bg-white p-2.5 border-2 border-black text-black select-all font-sans font-black tracking-wider text-[11px] sm:text-xs rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" :
                    isDark ? "bg-slate-950 p-2.5 rounded-lg border border-slate-750 text-cyan-300 select-all font-bold tracking-wider text-[11px] sm:text-xs" : "bg-white p-2.5 rounded-lg border-2 border-indigo-200 text-indigo-950 select-all font-black tracking-wider text-[11px] sm:text-xs shadow-inner"
                  }>
                    {rib.iban}
                  </div>
                </div>

                {/* BIC Section */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className={
                      isSobre ? isDark ? "text-[9px] text-zinc-300 uppercase tracking-[0.25em] font-bold" : "text-[9px] text-zinc-600 uppercase tracking-[0.25em] font-bold" :
                      isWarm ? isDark ? "text-[9px] text-amber-200 uppercase tracking-[0.25em] font-bold" : "text-[9px] text-amber-900 uppercase tracking-[0.25em] font-bold" :
                      isCyber ? "text-[9px] text-cyan-400 uppercase tracking-widest font-bold" :
                      isFun ? "text-[9px] text-black uppercase font-black" :
                      isDark ? "text-[9px] text-slate-300 uppercase tracking-[0.25em] font-bold" : "text-[9px] text-slate-700 uppercase tracking-[0.25em] font-extrabold"
                    }>Code BIC (Bank Identifier Code)</span>
                    <button
                      onClick={() => handleCopy(rib.bic, "BIC")}
                      className={`p-1 transition-colors cursor-pointer flex items-center gap-1 ${isFun ? "text-black hover:text-rose-500" : isDark ? "hover:text-cyan-300 text-cyan-400 font-bold" : "hover:text-indigo-800 text-indigo-600 font-bold"}`}
                      title="Copier le BIC"
                    >
                      {copiedField === "BIC" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">Copier</span>
                    </button>
                  </div>
                  <div className={
                    isSobre ? isDark ? "bg-zinc-950 p-2.5 rounded-lg border border-zinc-750 text-white select-all font-bold tracking-wider text-[11px] sm:text-xs" : "bg-zinc-150 p-2.5 rounded-lg border border-zinc-350 text-zinc-950 select-all font-bold tracking-wider text-[11px] sm:text-xs" :
                    isWarm ? isDark ? "bg-[#1f1916] p-2.5 rounded-lg border border-amber-900/30 text-amber-100 select-all font-serif font-bold tracking-wider text-[11px] sm:text-xs" : "bg-[#FAF6F0] p-2.5 rounded-lg border border-amber-900/20 text-amber-950 select-all font-serif font-bold tracking-wider text-[11px] sm:text-xs" :
                    isCyber ? "bg-black p-2.5 border border-cyan-400/50 text-cyan-300 select-all font-mono font-bold tracking-wider text-[11px] sm:text-xs" :
                    isFun ? "bg-white p-2.5 border-2 border-black text-black select-all font-sans font-black tracking-wider text-[11px] sm:text-xs rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" :
                    isDark ? "bg-slate-950 p-2.5 rounded-lg border border-slate-750 text-cyan-300 select-all font-bold tracking-wider text-[11px] sm:text-xs" : "bg-white p-2.5 rounded-lg border-2 border-indigo-200 text-indigo-950 select-all font-black tracking-wider text-[11px] sm:text-xs shadow-inner"
                  }>
                    {rib.bic}
                  </div>
                </div>
              </div>

              {/* Slip Action Footer */}
              <div className={`p-3.5 flex items-center justify-between gap-2 relative border-t ${
                isSobre ? isDark ? "bg-zinc-950 border-zinc-800" : "bg-zinc-100 border-zinc-200" :
                isWarm ? isDark ? "bg-[#1f1916] border-amber-900/30" : "bg-[#FAF6F0] border-amber-900/15" :
                isCyber ? "bg-black border-cyan-500/30" :
                isFun ? "bg-yellow-200 border-t-3 border-black" :
                isDark ? "bg-slate-950/80 border-slate-800" : "bg-slate-100 border-slate-200"
              }`}>
                <div className={`flex items-center gap-1.5 text-xs font-semibold ${
                  isSobre ? isDark ? "text-zinc-200" : "text-zinc-800" :
                  isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-950 font-serif" :
                  isCyber ? "text-cyan-300 font-mono" :
                  isFun ? "text-black font-black" :
                  isDark ? "text-slate-200 font-sans" : "text-slate-900 font-sans"
                }`}>
                  <Info className={`w-4 h-4 shrink-0 ${isCyber ? "text-[#00ffcc]" : isFun ? "text-black" : isDark ? "text-cyan-400" : "text-indigo-600"}`} />
                  <span>Virement SEPA instantané supporté</span>
                </div>
                <button
                  onClick={() =>
                    handleCopy(
                      `Titulaire: ${rib.accountHolder}\nIBAN: ${rib.iban}\nBIC: ${rib.bic}\nBanque: ${rib.bankName}`,
                      "RIB complet"
                    )
                  }
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 border cursor-pointer shadow-xs ${
                    isSobre ? isDark ? "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-750" : "bg-white border-zinc-300 text-zinc-900 hover:bg-zinc-100" :
                    isWarm ? isDark ? "bg-amber-900/40 border-amber-800 text-amber-100 hover:bg-amber-900/60" : "bg-amber-900 border-amber-900 text-white hover:bg-amber-950" :
                    isCyber ? "bg-black border-cyan-400 text-cyan-300 font-mono hover:bg-cyan-950/40" :
                    isFun ? "bg-fuchsia-300 border-2 border-black text-black font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5" :
                    isDark ? "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/40 shadow-xs" : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-xs"
                  }`}
                >
                  <Share2 className={`w-3.5 h-3.5 ${isFun ? "text-black" : "text-white"}`} />
                  Partager / Copier Tout
                </button>
              </div>
            </div>
          )}

          {/* Virement Instructions - Ultra High Contrast Box */}
          <div className={`border-2 rounded-xl p-4 flex gap-3 shadow-md ${
            isSobre ? isDark ? "bg-zinc-900 border-zinc-700 text-zinc-100" : "bg-zinc-50 border-zinc-300 text-zinc-900" :
            isWarm ? isDark ? "bg-[#2c2420] border-[#55433a] text-amber-100 font-serif" : "bg-[#FAF6F0] border-amber-900/20 text-amber-950 font-serif" :
            isCyber ? "bg-black border-cyan-400 text-cyan-200 font-mono" :
            isFun ? "bg-pink-100 border-3 border-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rounded-xl" :
            isDark ? "bg-slate-900/95 border-indigo-500/50 text-slate-100" : "bg-blue-50 border-blue-300 text-slate-950"
          }`}>
            <Info className={`w-5 h-5 shrink-0 mt-0.5 ${isFun ? "text-black" : isDark ? "text-cyan-400" : "text-blue-700"}`} />
            <div className="space-y-1.5 flex-1">
              <h5 className={`font-bold text-sm ${
                isSobre ? isDark ? "text-white font-bold" : "text-zinc-950 font-bold" :
                isWarm ? isDark ? "text-amber-100 font-serif font-bold" : "text-amber-950 font-serif font-bold" :
                isCyber ? "text-[#00ffcc] font-mono font-bold" :
                isFun ? "text-black font-black uppercase font-sans" :
                isDark ? "text-white font-sans font-bold" : "text-slate-950 font-sans font-extrabold"
              }`}>
                Comment faire un virement ?
              </h5>
              <div className={`text-xs leading-relaxed space-y-1.5 ${
                isSobre ? isDark ? "text-zinc-200 font-sans" : "text-zinc-800 font-sans font-medium" :
                isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-900 font-serif font-medium" :
                isCyber ? "text-cyan-300 font-mono" :
                isFun ? "text-black font-medium" :
                isDark ? "text-slate-200 font-sans" : "text-slate-800 font-sans font-medium"
              }`}>
                <p><span className="font-extrabold text-indigo-500 dark:text-cyan-400">1.</span> Copiez l'<strong className="font-extrabold underline decoration-indigo-400/80">IBAN</strong> et le <strong className="font-extrabold underline decoration-indigo-400/80">BIC</strong> ci-dessus.</p>
                <p><span className="font-extrabold text-indigo-500 dark:text-cyan-400">2.</span> Rendez-vous sur votre application bancaire personnelle.</p>
                <p><span className="font-extrabold text-indigo-500 dark:text-cyan-400">3.</span> Ajoutez un nouveau bénéficiaire en collant ces coordonnées.</p>
                <p><span className="font-extrabold text-indigo-500 dark:text-cyan-400">4.</span> Effectuez le virement (un virement de type "instantané" permet de recevoir le don en quelques secondes).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Support & Credit Card Simulator */}
        <div className="lg:col-span-5 space-y-6">
          <h3 className={`font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-2 ${
            isSobre ? isDark ? "text-zinc-200 font-sans" : "text-zinc-900 font-sans" :
            isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-950 font-serif" :
            isCyber ? "text-cyan-400 font-mono" :
            isFun ? "text-black font-black" :
            isDark ? "text-slate-200 font-sans font-bold" : "text-slate-900 font-sans font-bold"
          }`}>
            <Coins className={`w-4 h-4 ${isFun ? "text-black" : isDark ? "text-cyan-400" : "text-indigo-600"}`} />
            Don Rapide
          </h3>

          <div className={getPanelClass() + " space-y-5"}>
            {/* Amount Presets */}
            <div className="space-y-2">
              <label className={`block text-xs font-bold ${
                isSobre ? isDark ? "text-white font-sans" : "text-zinc-950 font-sans" :
                isWarm ? isDark ? "text-amber-100 font-serif" : "text-amber-950 font-serif" :
                isCyber ? "text-cyan-400 font-mono font-bold" :
                isFun ? "text-black font-black" :
                isDark ? "text-slate-100 font-sans font-bold" : "text-slate-900 font-sans font-bold"
              }`}>Choisir un montant :</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 20, 50].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setDonationAmount(val);
                      setCbSimStep("idle");
                    }}
                    className={getButtonClass(donationAmount === val)}
                  >
                    {val}€
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setDonationAmount("libre");
                  setCbSimStep("idle");
                }}
                className={getButtonClass(donationAmount === "libre") + " w-full font-bold"}
              >
                Montant Libre
              </button>

              {donationAmount === "libre" && (
                <div className="relative mt-2">
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setCbSimStep("idle");
                    }}
                    placeholder="Saisir le montant en €"
                    className={getInputClass()}
                  />
                  <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${
                    isSobre ? isDark ? "text-zinc-400" : "text-zinc-600" :
                    isWarm ? isDark ? "text-amber-300" : "text-amber-900" :
                    isCyber ? "text-cyan-400 font-mono" :
                    isFun ? "text-black font-black font-sans" :
                    isDark ? "text-slate-300 font-sans" : "text-slate-700 font-sans"
                  }`}>
                    EUR
                  </span>
                </div>
              )}
            </div>

            {/* Donation Channel toggle */}
            <div className={`flex text-xs font-sans border-b ${
              isSobre ? isDark ? "border-zinc-800" : "border-zinc-200" :
              isWarm ? isDark ? "border-amber-900/30" : "border-amber-900/15" :
              isCyber ? "border-cyan-500/30" :
              isFun ? "border-black" :
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <button
                onClick={() => setDonationType("virement")}
                className={`flex-1 pb-2.5 text-center cursor-pointer transition-colors ${
                  donationType === "virement"
                    ? isSobre ? isDark ? "border-b-2 border-white text-white font-bold" : "border-b-2 border-zinc-950 text-zinc-950 font-bold"
                      : isWarm ? isDark ? "border-b-2 border-amber-400 text-amber-200 font-serif font-bold" : "border-b-2 border-amber-900 text-amber-950 font-serif font-bold"
                      : isCyber ? "border-b-2 border-cyan-400 text-[#00ffcc] font-mono font-bold"
                      : isFun ? "border-b-3 border-black text-black font-black bg-pink-200 rounded-t-lg"
                      : isDark ? "border-b-2 border-indigo-400 text-cyan-300 font-bold" : "border-b-2 border-indigo-600 text-indigo-950 font-extrabold"
                    : isSobre ? isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-950 font-medium"
                      : isWarm ? isDark ? "text-amber-300/60 hover:text-amber-200 font-serif" : "text-amber-900/70 hover:text-amber-950 font-serif font-medium"
                      : isCyber ? "text-cyan-500/70 hover:text-cyan-300 font-mono"
                      : isFun ? "text-black opacity-70 hover:opacity-100 font-bold"
                      : isDark ? "text-slate-300 hover:text-white font-medium" : "text-slate-600 hover:text-slate-950 font-semibold"
                }`}
              >
                Virement bancaire
              </button>
              <button
                onClick={() => {
                  setDonationType("cb");
                  setCbSimStep("idle");
                }}
                className={`flex-1 pb-2.5 text-center cursor-pointer transition-colors ${
                  donationType === "cb"
                    ? isSobre ? isDark ? "border-b-2 border-white text-white font-bold" : "border-b-2 border-zinc-950 text-zinc-950 font-bold"
                      : isWarm ? isDark ? "border-b-2 border-amber-400 text-amber-200 font-serif font-bold" : "border-b-2 border-amber-900 text-amber-950 font-serif font-bold"
                      : isCyber ? "border-b-2 border-cyan-400 text-[#00ffcc] font-mono font-bold"
                      : isFun ? "border-b-3 border-black text-black font-black bg-pink-200 rounded-t-lg"
                      : isDark ? "border-b-2 border-indigo-400 text-cyan-300 font-bold" : "border-b-2 border-indigo-600 text-indigo-950 font-extrabold"
                    : isSobre ? isDark ? "text-zinc-400 hover:text-zinc-200" : "text-zinc-600 hover:text-zinc-950 font-medium"
                      : isWarm ? isDark ? "text-amber-300/60 hover:text-amber-200 font-serif" : "text-amber-900/70 hover:text-amber-950 font-serif font-medium"
                      : isCyber ? "text-cyan-500/70 hover:text-cyan-300 font-mono"
                      : isFun ? "text-black opacity-70 hover:opacity-100 font-bold"
                      : isDark ? "text-slate-300 hover:text-white font-medium" : "text-slate-600 hover:text-slate-950 font-semibold"
                }`}
              >
                Simulation Carte
              </button>
            </div>

            {donationType === "virement" ? (
              /* Virement display details */
              <div className={`space-y-3 pt-2 text-xs leading-relaxed ${
                isSobre ? isDark ? "text-zinc-200 font-sans" : "text-zinc-800 font-sans" :
                isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-950 font-serif" :
                isCyber ? "text-cyan-300 font-mono" :
                isFun ? "text-black font-medium" :
                isDark ? "text-slate-200 font-sans" : "text-slate-800 font-sans font-medium"
              }`}>
                <p>
                  Les virements SEPA n'engendrent <strong className="font-extrabold">aucun frais de commission</strong>. C'est le moyen de soutien le plus direct et efficace.
                </p>
                <div className={`p-3.5 rounded-xl border ${
                  isSobre ? isDark ? "bg-zinc-950 border-zinc-800 text-white space-y-2" : "bg-zinc-100 border-zinc-300 text-zinc-950 space-y-2" :
                  isWarm ? isDark ? "bg-[#1f1916] border-amber-900/30 text-amber-100 space-y-2 font-serif" : "bg-[#FAF6F0] border-amber-900/15 text-amber-950 space-y-2 font-serif" :
                  isCyber ? "bg-black border-cyan-400/30 text-cyan-300 space-y-2 font-mono" :
                  isFun ? "bg-white border-3 border-black rounded-xl text-black space-y-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" :
                  isDark ? "bg-slate-950 border border-slate-750 text-slate-100 space-y-2 font-sans" : "bg-slate-50 border border-slate-300 text-slate-950 space-y-2 font-sans shadow-xs"
                }`}>
                  <div className="flex justify-between items-center">
                    <span className={
                      isSobre ? isDark ? "text-zinc-300 font-medium" : "text-zinc-700 font-medium" :
                      isWarm ? isDark ? "text-amber-300 font-medium" : "text-amber-900 font-medium" :
                      isCyber ? "text-cyan-400 font-mono font-medium" :
                      isFun ? "text-black font-bold" :
                      isDark ? "text-slate-300 font-semibold" : "text-slate-700 font-bold"
                    }>Bénéficiaire :</span>
                    <span className={`font-bold uppercase ${
                      isSobre ? isDark ? "text-white" : "text-zinc-950 font-black" :
                      isWarm ? isDark ? "text-amber-100" : "text-amber-950 font-black" :
                      isCyber ? "text-[#00ffcc]" :
                      isFun ? "text-black font-black" :
                      isDark ? "text-white font-extrabold" : "text-slate-950 font-black"
                    }`}>{rib.accountHolder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={
                      isSobre ? isDark ? "text-zinc-300 font-medium" : "text-zinc-700 font-medium" :
                      isWarm ? isDark ? "text-amber-300 font-medium" : "text-amber-900 font-medium" :
                      isCyber ? "text-cyan-400 font-mono font-medium" :
                      isFun ? "text-black font-bold" :
                      isDark ? "text-slate-300 font-semibold" : "text-slate-700 font-bold"
                    }>Montant suggéré :</span>
                    <span className={`font-bold ${
                      isSobre ? isDark ? "text-white" : "text-zinc-950 font-black" :
                      isWarm ? isDark ? "text-amber-100" : "text-amber-950 font-black" :
                      isCyber ? "text-[#00ffcc]" :
                      isFun ? "text-black font-black" :
                      isDark ? "text-cyan-300 font-extrabold" : "text-indigo-700 font-black text-sm"
                    }`}>{finalDonationAmount} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={
                      isSobre ? isDark ? "text-zinc-300 font-medium" : "text-zinc-700 font-medium" :
                      isWarm ? isDark ? "text-amber-300 font-medium" : "text-amber-900 font-medium" :
                      isCyber ? "text-cyan-400 font-mono font-medium" :
                      isFun ? "text-black font-bold" :
                      isDark ? "text-slate-300 font-semibold" : "text-slate-700 font-bold"
                    }>Motif conseillé :</span>
                    <span className={`font-mono font-bold text-xs ${
                      isSobre ? isDark ? "text-zinc-200" : "text-zinc-950" :
                      isWarm ? isDark ? "text-amber-200" : "text-amber-950" :
                      isCyber ? "text-[#00ffcc]" :
                      isFun ? "text-black" :
                      isDark ? "text-cyan-300" : "text-indigo-950"
                    }`}>DON INFOPERSO {donorName ? `- ${donorName}` : ""}</span>
                  </div>
                </div>

                <div>
                  <label className={getLabelClass()}>Votre Nom (Optionnel)</label>
                  <input
                    type="text"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="ex: Jean de Montpellier"
                    className={getInputClass()}
                  />
                </div>
              </div>
            ) : (
              /* Credit Card Mock Simulator */
              <form onSubmit={handleSimulateCb} className="space-y-3 pt-2">
                {cbSimStep === "success" ? (
                  <div className={`border p-4 text-center space-y-2 rounded-xl ${
                    isSobre ? isDark ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" : "bg-emerald-50 border-emerald-300 text-zinc-900 shadow-xs" :
                    isWarm ? isDark ? "bg-[#1f281e] border-emerald-800 text-emerald-200 font-serif" : "bg-[#F5F8F2] border-emerald-300 text-amber-950 font-serif" :
                    isCyber ? "bg-black border-cyan-400 text-[#00ffcc] font-mono" :
                    isFun ? "bg-emerald-100 border-3 border-black rounded-2xl text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" :
                    isDark ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200" : "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs"
                  }`}>
                    <Heart className={`w-8 h-8 text-rose-500 mx-auto animate-bounce ${isFun ? "fill-rose-500" : "fill-rose-500/20"}`} />
                    <h4 className={`font-bold text-base ${
                      isSobre ? isDark ? "text-emerald-300" : "text-emerald-900 font-extrabold" :
                      isWarm ? isDark ? "text-emerald-300 font-serif" : "text-emerald-950 font-serif font-extrabold" :
                      isCyber ? "text-[#00ffcc] font-mono" :
                      isFun ? "text-black font-black uppercase font-sans" :
                      isDark ? "text-emerald-300 font-sans" : "text-emerald-900 font-sans font-extrabold"
                    }`}>Paiement Simulé Réussi !</h4>
                    <p className={`text-xs leading-relaxed ${
                      isSobre ? isDark ? "text-zinc-200" : "text-zinc-800 font-medium" :
                      isWarm ? isDark ? "text-amber-200" : "text-amber-950 font-medium" :
                      isCyber ? "text-cyan-300 font-mono" :
                      isFun ? "text-black font-semibold" :
                      isDark ? "text-slate-200 font-sans" : "text-slate-800 font-sans font-medium"
                    }`}>
                      Votre don fictif de <strong>{finalDonationAmount}€</strong> a été simulé.
                      Pour un vrai soutien, veuillez utiliser le virement vers l'IBAN à gauche !
                    </p>
                    <button
                      type="button"
                      onClick={() => setCbSimStep("idle")}
                      className={`text-xs font-bold underline cursor-pointer transition-colors ${
                        isSobre ? isDark ? "text-zinc-200 hover:text-white" : "text-zinc-950 hover:text-black font-extrabold" :
                        isWarm ? isDark ? "text-amber-200 hover:text-white font-serif" : "text-amber-950 hover:text-black font-serif font-bold" :
                        isCyber ? "text-[#00ffcc] hover:text-cyan-300 font-mono" :
                        isFun ? "text-black font-sans font-black bg-yellow-350 border-2 border-black px-3 py-1 rounded-xl inline-block hover:translate-y-0.5" :
                        isDark ? "text-cyan-300 hover:text-white font-sans" : "text-indigo-700 hover:text-indigo-950 font-extrabold"
                      }`}
                    >
                      Refaire une simulation
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className={`text-xs leading-normal ${
                      isSobre ? isDark ? "text-zinc-300 font-sans" : "text-zinc-700 font-sans" :
                      isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-900 font-serif" :
                      isCyber ? "text-cyan-300 font-mono" :
                      isFun ? "text-black font-semibold" :
                      isDark ? "text-slate-200 font-sans" : "text-slate-700 font-sans font-medium"
                    }`}>
                      Simulez instantanément un don sécurisé par carte bancaire.
                    </p>
                    <div>
                      <label className={getLabelClass()}>Numéro de carte</label>
                      <input
                        type="text"
                        required
                        className={getInputClass() + " font-mono"}
                        placeholder="4973 8274 9182 0384"
                        defaultValue="4973 8274 9182 0384"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className={getLabelClass()}>Date d'exp.</label>
                        <input
                          type="text"
                          required
                          className={getInputClass() + " text-center font-mono"}
                          placeholder="12/28"
                          defaultValue="08/29"
                        />
                      </div>
                      <div>
                        <label className={getLabelClass()}>CVC / Cryptogramme</label>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          className={getInputClass() + " text-center font-mono"}
                          placeholder="382"
                          defaultValue="382"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={cbSimStep === "submitting"}
                      className={getActionButtonClass()}
                    >
                      {cbSimStep === "submitting" ? "Simulation en cours..." : `Faire un don simulé de ${finalDonationAmount} €`}
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* QR Code section */}
            <div className={`pt-4 flex items-center gap-3 border-t ${
              isSobre ? isDark ? "border-zinc-800" : "border-zinc-200" :
              isWarm ? isDark ? "border-amber-900/30" : "border-amber-900/15" :
              isCyber ? "border-cyan-500/25" :
              isFun ? "border-black" :
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <div className={isFun ? "border-3 border-black p-1 rounded-xl bg-white shrink-0" : "bg-white p-1.5 rounded-lg border border-slate-300 dark:border-transparent shrink-0 shadow-xs"}>
                <QrCode className="w-12 h-12 text-slate-950" />
              </div>
              <p className={`text-xs leading-snug ${
                isSobre ? isDark ? "text-zinc-300 font-sans" : "text-zinc-700 font-sans font-medium" :
                isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-900 font-serif font-medium" :
                isCyber ? "text-cyan-300 font-mono" :
                isFun ? "text-black font-bold" :
                isDark ? "text-slate-300 font-sans" : "text-slate-700 font-sans font-medium"
              }`}>
                Scannez pour accéder rapidement aux informations de virement SEPA depuis votre mobile.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
