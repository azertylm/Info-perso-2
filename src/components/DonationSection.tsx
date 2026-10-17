import React, { useState, useEffect } from "react";
import { 
  CreditCard, Copy, Check, Heart, Info, Coins, QrCode, Edit3, Save, Share2, 
  Crown, Award, Sparkles, CheckCircle2, ShieldCheck, AlertTriangle, ArrowRight, Star,
  Calculator, Wand2, RefreshCw, Flame
} from "lucide-react";
import { RibInfo } from "../types";
import { activateFounderPlan, isFounderMember } from "../lib/subscriptionService";
import { auth } from "../lib/firebase";

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
  const [tempRib, setTempRib] = useState<RibInfo>({
    bankName: rib.bankName || "",
    accountHolder: rib.accountHolder || "",
    iban: rib.iban || "",
    bic: rib.bic || "",
    bankCode: rib.bankCode || "",
    branchCode: rib.branchCode || "",
    accountNumber: rib.accountNumber || "",
    ribKey: rib.ribKey || ""
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | "libre">(30);
  const [customAmount, setCustomAmount] = useState("30");
  const [donorName, setDonorName] = useState("");
  const [donationType, setDonationType] = useState<"virement" | "cb">("virement");
  const [cbSimStep, setCbSimStep] = useState<"idle" | "submitting" | "success">("idle");
  const [isFounderActive, setIsFounderActive] = useState<boolean>(() => isFounderMember());
  const [founderSlotNumber] = useState<number>(() => {
    return Number(localStorage.getItem("infoperso_founder_number")) || 84;
  });

  const totalSlots = 500;
  const allocatedSlots = 84;
  const remainingSlots = totalSlots - allocatedSlots;
  const progressPercent = Math.round((allocatedSlots / totalSlots) * 100);

  // Synchronise tempRib whenever rib prop changes
  useEffect(() => {
    setTempRib({
      bankName: rib.bankName || "",
      accountHolder: rib.accountHolder || "",
      iban: rib.iban || "",
      bic: rib.bic || "",
      bankCode: rib.bankCode || "",
      branchCode: rib.branchCode || "",
      accountNumber: rib.accountNumber || "",
      ribKey: rib.ribKey || ""
    });
  }, [rib]);

  useEffect(() => {
    const handleUpdate = () => {
      setIsFounderActive(isFounderMember());
    };
    window.addEventListener("alphabette_plan_updated", handleUpdate);
    window.addEventListener("alphabette_quota_updated", handleUpdate);
    return () => {
      window.removeEventListener("alphabette_plan_updated", handleUpdate);
      window.removeEventListener("alphabette_quota_updated", handleUpdate);
    };
  }, []);

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    onNotify(`Copié avec succès : ${fieldName}`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Modulo 97 official French RIB key calculation
  const computeRibKey = (bank: string, branch: string, acc: string): string => {
    const b = (bank || "").replace(/\D/g, "").padStart(5, "0").slice(0, 5);
    const g = (branch || "").replace(/\D/g, "").padStart(5, "0").slice(0, 5);
    const letterMap: Record<string, string> = {
      A: "1", B: "2", C: "3", D: "4", E: "5", F: "6", G: "7", H: "8", I: "9",
      J: "1", K: "2", L: "3", M: "4", N: "5", O: "6", P: "7", Q: "8", R: "9",
      S: "2", T: "3", U: "4", V: "5", W: "6", X: "7", Y: "8", Z: "9"
    };
    const rawAcc = (acc || "").toUpperCase().replace(/[^A-Z0-9]/g, "").padStart(11, "0").slice(-11);
    const normalizedAcc = rawAcc.split("").map(c => letterMap[c] || c).join("");

    try {
      const bankBig = BigInt(b || "0");
      const branchBig = BigInt(g || "0");
      const accBig = BigInt(normalizedAcc || "0");
      const mod = (BigInt(89) * bankBig + BigInt(15) * branchBig + BigInt(3) * accBig) % BigInt(97);
      const key = BigInt(97) - mod;
      const keyNum = key === BigInt(0) ? 97 : Number(key);
      return keyNum < 10 ? `0${keyNum}` : `${keyNum}`;
    } catch {
      return "00";
    }
  };

  const handleAutoComputeKey = () => {
    if (!tempRib.bankCode && !tempRib.accountNumber) {
      onNotify("⚠️ Veuillez saisir au moins le Code Banque et le Numéro de compte.");
      return;
    }
    const calculatedKey = computeRibKey(tempRib.bankCode, tempRib.branchCode, tempRib.accountNumber);
    setTempRib(prev => ({ ...prev, ribKey: calculatedKey }));
    onNotify(`🧮 Clé RIB calculée : ${calculatedKey}`);
  };

  const handleExtractFromIban = () => {
    const clean = (tempRib.iban || "").replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (clean.startsWith("FR") && clean.length >= 27) {
      const bankCode = clean.slice(4, 9);
      const branchCode = clean.slice(9, 14);
      const accountNumber = clean.slice(14, 25);
      const ribKey = clean.slice(25, 27);
      setTempRib(prev => ({
        ...prev,
        bankCode,
        branchCode,
        accountNumber,
        ribKey
      }));
      onNotify(`⚡ Données extraites de l'IBAN : Clé RIB = ${ribKey}`);
    } else {
      onNotify("⚠️ Veuillez saisir un IBAN français valide (commençant par FR et comportant 27 caractères).");
    }
  };

  const handleGenerateIbanFromRib = () => {
    const b = (tempRib.bankCode || "").replace(/\D/g, "").padStart(5, "0").slice(0, 5);
    const g = (tempRib.branchCode || "").replace(/\D/g, "").padStart(5, "0").slice(0, 5);
    const a = (tempRib.accountNumber || "").toUpperCase().replace(/[^A-Z0-9]/g, "").padStart(11, "0").slice(-11);
    const k = (tempRib.ribKey || "").replace(/[^A-Z0-9]/g, "").padStart(2, "0").slice(0, 2);

    if (!b || !a) {
      onNotify("⚠️ Remplissez au moins Code Banque, Guichet et Numéro de compte pour générer l'IBAN.");
      return;
    }

    try {
      const ibanLetterMap = (str: string) => {
        return str.split("").map(c => {
          const code = c.charCodeAt(0);
          if (code >= 65 && code <= 90) return (code - 55).toString();
          return c;
        }).join("");
      };
      const numericAcc = ibanLetterMap(a);
      const numericPayload = `${b}${g}${numericAcc}${k}152700`;
      const mod = BigInt(numericPayload) % BigInt(97);
      const checkDigits = BigInt(98) - mod;
      const checkStr = checkDigits < 10 ? `0${checkDigits}` : `${checkDigits}`;
      const generatedIban = `FR${checkStr} ${b} ${g} ${a} ${k}`;
      setTempRib(prev => ({ ...prev, iban: generatedIban }));
      onNotify(`🔄 IBAN généré avec succès : ${generatedIban}`);
    } catch {
      const fallbackIban = `FR76 ${b} ${g} ${a} ${k}`;
      setTempRib(prev => ({ ...prev, iban: fallbackIban }));
      onNotify(`🔄 IBAN généré : ${fallbackIban}`);
    }
  };

  const handleSaveRib = () => {
    // Basic verification
    if (!tempRib.iban || !tempRib.bic || !tempRib.accountHolder) {
      onNotify("⚠️ Veuillez remplir le titulaire, l'IBAN et le BIC.");
      return;
    }
    const cleanKey = (tempRib.ribKey || "").trim();
    const finalRib: RibInfo = {
      ...tempRib,
      bankCode: tempRib.bankCode?.trim() || "",
      branchCode: tempRib.branchCode?.trim() || "",
      accountNumber: tempRib.accountNumber?.trim() || "",
      ribKey: cleanKey || "00"
    };
    onRibChange(finalRib);
    setIsEditing(false);
    onNotify(`✅ Coordonnées bancaires enregistrées avec succès (Clé RIB : ${finalRib.ribKey}) !`);
  };

  const finalDonationAmount = donationAmount === "libre" ? Number(customAmount) || 0 : donationAmount;
  const isAmountValid = finalDonationAmount >= 30;

  const handleActivateFounder = async () => {
    if (!isAmountValid) {
      onNotify("⚠️ Le montant minimum pour la Licence Perpétuelle Membre Fondateur est de 30 €.");
      return;
    }
    setCbSimStep("submitting");
    setTimeout(async () => {
      try {
        const currentUser = auth.currentUser;
        const uid = currentUser?.uid || localStorage.getItem("infoperso_user_uid") || `user-${Date.now()}`;
        const email = currentUser?.email || localStorage.getItem("infoperso_user_email") || "fondateur@alphabette.fr";
        await activateFounderPlan(uid, email, finalDonationAmount, donorName);
        setIsFounderActive(true);
        setCbSimStep("success");
        onNotify(`👑 Félicitations ! Vous êtes désormais Membre Fondateur #${founderSlotNumber} (Licence Perpétuelle à Vie débloquée) ! 🎉`);
      } catch (err: any) {
        onNotify("Erreur d'activation : " + (err?.message || "inconnue"));
        setCbSimStep("idle");
      }
    }, 1200);
  };

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
                  setTempRib({
                    bankName: rib.bankName || "",
                    accountHolder: rib.accountHolder || "",
                    iban: rib.iban || "",
                    bic: rib.bic || "",
                    bankCode: rib.bankCode || "",
                    branchCode: rib.branchCode || "",
                    accountNumber: rib.accountNumber || "",
                    ribKey: rib.ribKey || ""
                  });
                } else {
                  setTempRib({
                    bankName: rib.bankName || "",
                    accountHolder: rib.accountHolder || "",
                    iban: rib.iban || "",
                    bic: rib.bic || "",
                    bankCode: rib.bankCode || "",
                    branchCode: rib.branchCode || "",
                    accountNumber: rib.accountNumber || "",
                    ribKey: rib.ribKey || ""
                  });
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
              {isEditing ? "Annuler l'édition" : "Modifier mon RIB & Clé"}
            </button>
          </div>

          {isEditing ? (
            /* RIB Editor form */
            <div className={getPanelClass() + " space-y-4 shadow-xl"}>
              <div className="flex items-center justify-between border-b pb-3 border-slate-700/30">
                <h4 className={`font-bold text-sm flex items-center gap-2 ${getSubTitleClass()}`}>
                  <Coins className={`w-4 h-4 ${isCyber ? "text-[#00ffcc]" : isFun ? "text-black" : isDark ? "text-cyan-400" : "text-indigo-600"}`} />
                  Modifier vos coordonnées bancaires &amp; Clé RIB
                </h4>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold font-mono">
                  Clé RIB éditable
                </span>
              </div>

              <p className={`text-xs leading-normal ${
                isSobre ? isDark ? "text-zinc-300 font-sans" : "text-zinc-700 font-sans" :
                isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-900 font-serif" :
                isCyber ? "text-cyan-300 font-mono" :
                isFun ? "text-black font-medium" :
                isDark ? "text-slate-200 font-sans" : "text-slate-700 font-sans font-medium"
              }`}>
                Vous pouvez saisir ou modifier chaque élément de votre RIB, en particulier la <strong>Clé RIB (2 chiffres)</strong>. Utilisez les boutons d'assistance rapide ci-dessous pour calculer la clé ou extraire les données depuis l'IBAN.
              </p>

              {/* Titulaire & Banque */}
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
                    placeholder="M. Jean DUPONT ou ALPHABETTE SASU"
                  />
                </div>
              </div>

              {/* Les 4 composants du RIB Français */}
              <div className="p-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Composants du RIB National Français
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Banque (5) + Guichet (5) + Compte (11) + Clé (2)
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-3">
                    <label className={getLabelClass()}>Code Banque (5)</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={tempRib.bankCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                        setTempRib({ ...tempRib, bankCode: val });
                      }}
                      className={getInputClass() + " text-center font-mono"}
                      placeholder="12517"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className={getLabelClass()}>Code Guichet (5)</label>
                    <input
                      type="text"
                      maxLength={5}
                      value={tempRib.branchCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 5);
                        setTempRib({ ...tempRib, branchCode: val });
                      }}
                      className={getInputClass() + " text-center font-mono"}
                      placeholder="00001"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className={getLabelClass()}>Numéro de Compte (11)</label>
                    <input
                      type="text"
                      maxLength={11}
                      value={tempRib.accountNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 11).toUpperCase();
                        setTempRib({ ...tempRib, accountNumber: val });
                      }}
                      className={getInputClass() + " text-center font-mono uppercase"}
                      placeholder="12345678901"
                    />
                  </div>
                  {/* Champ Clé RIB nettement mis en valeur et 100% modifiable */}
                  <div className="sm:col-span-2">
                    <label className={getLabelClass() + " text-amber-400 font-extrabold flex items-center gap-1"}>
                      <span>Clé RIB (2)</span>
                      <span className="text-[9px] text-amber-500 font-normal">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={2}
                      value={tempRib.ribKey ?? ""}
                      onChange={(e) => {
                        // Autorise saisie directe de la clé (chiffres ou lettres, 2 caractères max)
                        const val = e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
                        setTempRib({ ...tempRib, ribKey: val });
                      }}
                      className={getInputClass() + " text-center font-mono font-black text-amber-400 text-sm tracking-widest border-amber-500/50 focus:border-amber-400 bg-amber-500/10"}
                      placeholder="92"
                      title="Saisissez directement votre clé RIB à 2 chiffres"
                    />
                  </div>
                </div>

                {/* Boutons d'assistance rapide */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-700/30">
                  <button
                    type="button"
                    onClick={handleAutoComputeKey}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Calculer automatiquement la clé RIB selon la formule officielle modulo 97"
                  >
                    <Calculator className="w-3.5 h-3.5 text-amber-400" />
                    <span>Calculer la Clé RIB (modulo 97)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExtractFromIban}
                    className="px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Extraire Banque, Guichet, Compte et Clé RIB depuis l'IBAN saisi ci-dessous"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Extraire Clé &amp; RIB depuis l'IBAN</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGenerateIbanFromRib}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-95"
                    title="Générer l'IBAN complet à partir des 4 champs ci-dessus"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Générer l'IBAN complet</span>
                  </button>
                </div>
              </div>

              {/* IBAN & BIC */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <label className={getLabelClass()}>Code IBAN International</label>
                  <input
                    type="text"
                    value={tempRib.iban}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase();
                      setTempRib({ ...tempRib, iban: val });
                    }}
                    className={getInputClass() + " font-mono uppercase"}
                    placeholder="FR76 1251 7000 0112 3456 7890 192"
                  />
                </div>
                <div>
                  <label className={getLabelClass()}>Code BIC / SWIFT</label>
                  <input
                    type="text"
                    value={tempRib.bic}
                    onChange={(e) => setTempRib({ ...tempRib, bic: e.target.value.toUpperCase() })}
                    className={getInputClass() + " font-mono text-center uppercase"}
                    placeholder="CRCAMFRPXXX"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleSaveRib}
                  className={getActionButtonClass() + " flex-1"}
                >
                  <Save className="w-4 h-4" />
                  Enregistrer mon RIB &amp; ma Clé
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer"
                >
                  Annuler
                </button>
              </div>
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

        {/* Right Column: Offre Officielle « Membre Fondateur — Licence Perpétuelle » */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className={`font-bold text-xs uppercase tracking-[0.15em] flex items-center gap-2 ${
              isSobre ? isDark ? "text-zinc-200 font-sans" : "text-zinc-900 font-sans" :
              isWarm ? isDark ? "text-amber-200 font-serif" : "text-amber-950 font-serif" :
              isCyber ? "text-cyan-400 font-mono" :
              isFun ? "text-black font-black" :
              isDark ? "text-amber-300 font-sans font-bold" : "text-amber-700 font-sans font-bold"
            }`}>
              <Crown className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              Offre Officielle Membre Fondateur
            </h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              500 Places Max
            </span>
          </div>

          <div className={`${getPanelClass()} space-y-5 border-2 ${
            isDark ? "border-amber-500/40 shadow-amber-950/30" : "border-amber-400/60 shadow-amber-100"
          }`}>
            {/* Header Encart Premium */}
            <div className="space-y-1.5 border-b border-amber-500/20 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 shadow-md font-bold shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h4 className={`text-base sm:text-lg font-black tracking-tight leading-snug ${
                    isDark ? "text-white" : "text-slate-950"
                  }`}>
                    Pass Fondateur — Licence Perpétuelle
                  </h4>
                  <p className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider">
                    Accès Garanti à Vie • Zéro Récurrence
                  </p>
                </div>
              </div>
              <p className={`text-xs mt-1 leading-relaxed ${
                isDark ? "text-slate-300" : "text-slate-700 font-medium"
              }`}>
                Soutenez une information souveraine, sans publicité et libérée du bruit médiatique.
              </p>
            </div>

            {/* JAUGE DE PROGRESSION DES 500 PLACES PIONNIÈRES */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${
              isDark ? "bg-slate-950/80 border-amber-500/30" : "bg-amber-50/70 border-amber-300"
            }`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold flex items-center gap-1.5 text-amber-400">
                  <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
                  Places Pionnières Attribuées
                </span>
                <span className={`font-mono font-black ${isDark ? "text-white" : "text-slate-950"}`}>
                  <strong className="text-amber-400 text-sm">{allocatedSlots}</strong> / {totalSlots} places
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 rounded-full bg-slate-800/80 p-0.5 border border-amber-500/30 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-400 to-yellow-300 transition-all duration-700 shadow-sm shadow-amber-500/50"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] opacity-80 pt-0.5">
                <span>Rareté : {remainingSlots} places restantes</span>
                <span className="font-semibold text-emerald-400">Pionnier #{founderSlotNumber}</span>
              </div>
            </div>

            {/* SÉLECTEUR DE MONTANT INTERACTIF (30€ MINIMUM STRICT) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className={`block text-xs font-bold ${
                  isDark ? "text-slate-100" : "text-slate-900"
                }`}>
                  Montant de votre contribution (30 € minimum) :
                </label>
                <span className="text-[10px] text-amber-400 font-bold font-mono">
                  Montant libre sans plafond
                </span>
              </div>

              {/* 3 boutons rapides suggérés : 30 €, 50 €, 100 € */}
              <div className="grid grid-cols-3 gap-2">
                {[30, 50, 100].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => {
                      setDonationAmount(val);
                      setCbSimStep("idle");
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                      donationAmount === val
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30 scale-102"
                        : isDark
                        ? "bg-slate-900 border-slate-750 text-slate-200 hover:bg-slate-800 hover:border-amber-500/50"
                        : "bg-white border-slate-300 text-slate-800 hover:bg-amber-50/50 hover:border-amber-400"
                    }`}
                  >
                    {val} € {val === 30 && <span className="text-[9px] block opacity-80">Minimum</span>}
                    {val === 50 && <span className="text-[9px] block opacity-80">Soutien</span>}
                    {val === 100 && <span className="text-[9px] block opacity-80">Mécène</span>}
                  </button>
                ))}
              </div>

              {/* Bouton Montant Libre */}
              <button
                type="button"
                onClick={() => {
                  setDonationAmount("libre");
                  setCbSimStep("idle");
                }}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  donationAmount === "libre"
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-black shadow-sm"
                    : isDark
                    ? "bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700"
                    : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                }`}
              >
                Autre montant (libre dès 30 €)
              </button>

              {/* Champ Autre Montant avec Validation Stricte >= 30 € */}
              {donationAmount === "libre" && (
                <div className="space-y-1.5 pt-1">
                  <div className="relative">
                    <input
                      type="number"
                      min={30}
                      step={1}
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        setCbSimStep("idle");
                      }}
                      placeholder="Saisissez un montant (min. 30 €)"
                      className={`${getInputClass()} pr-12 font-bold ${
                        Number(customAmount) > 0 && Number(customAmount) < 30
                          ? "border-rose-500 ring-1 ring-rose-500 text-rose-300"
                          : ""
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                      EUR (€)
                    </span>
                  </div>

                  {Number(customAmount) > 0 && Number(customAmount) < 30 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-400 font-bold bg-rose-500/10 border border-rose-500/30 p-2 rounded-lg">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>Validation stricte : Le montant minimum pour la Licence Perpétuelle est de 30 €.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* LISTE CLAIRE DES CONTREPARTIES INCLUSES */}
            <div className={`p-4 rounded-xl border space-y-2.5 ${
              isDark ? "bg-slate-950/60 border-slate-800" : "bg-slate-50 border-slate-200"
            }`}>
              <h5 className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? "text-amber-400" : "text-amber-700"
              }`}>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Contreparties Incluses à Vie :
              </h5>
              <ul className="space-y-2 text-xs">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Accès illimité et garanti à vie</strong> à toutes les fonctionnalités actuelles et futures d'InfoPerso.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Zéro abonnement récurrent</strong> : aucune reconduction tacite, aucun frais dissimulé.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Badge exclusif « Fondateur Pionnier »</strong> affiché fièrement dans votre profil lecteur.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Priorité sur les développements</strong> et vote consultatif sur les prochaines fonctionnalités du bouquet.
                  </span>
                </li>
              </ul>
            </div>

            {/* NOM DU DONATEUR / PIONNIER */}
            <div>
              <label className={getLabelClass()}>Nom ou Pseudo du Membre Fondateur (Optionnel)</label>
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="ex: Valentin de La Grande-Motte"
                className={getInputClass()}
              />
            </div>

            {/* MODE D'ACTIVATION : VIREMENT DIRECT SEPA vs SIMULATION EN 1-CLIC */}
            <div className={`flex text-xs font-sans border-b ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <button
                type="button"
                onClick={() => setDonationType("virement")}
                className={`flex-1 pb-2.5 text-center cursor-pointer transition-colors font-bold ${
                  donationType === "virement"
                    ? "border-b-2 border-amber-400 text-amber-400"
                    : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Virement SEPA Direct (0% frais)
              </button>
              <button
                type="button"
                onClick={() => {
                  setDonationType("cb");
                  setCbSimStep("idle");
                }}
                className={`flex-1 pb-2.5 text-center cursor-pointer transition-colors font-bold ${
                  donationType === "cb"
                    ? "border-b-2 border-amber-400 text-amber-400"
                    : isDark ? "text-slate-400 hover:text-slate-200" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Activation Directe en 1-Clic
              </button>
            </div>

            {donationType === "virement" ? (
              <div className="space-y-3 pt-1">
                <div className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                  isDark ? "bg-slate-950 border-slate-800 text-slate-200" : "bg-white border-slate-200 text-slate-800"
                }`}>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">Bénéficiaire :</span>
                    <span className="font-bold uppercase text-white dark:text-white">{rib.accountHolder}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">Montant sélectionné :</span>
                    <span className="font-black text-amber-400 text-sm">{finalDonationAmount} €</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-70">Motif de virement :</span>
                    <span className="font-mono font-bold text-emerald-400 text-xs">
                      FONDATEUR-{founderSlotNumber}{donorName ? `-${donorName.replace(/\s+/g, "").toUpperCase()}` : ""}
                    </span>
                  </div>
                </div>

                {/* Bouton d'action principal bien visible */}
                <button
                  type="button"
                  onClick={handleActivateFounder}
                  disabled={!isAmountValid || cbSimStep === "submitting"}
                  className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Crown className="w-4 h-4 text-slate-950" />
                  <span>
                    {!isAmountValid
                      ? "Montant minimum de 30 € requis"
                      : cbSimStep === "submitting"
                      ? "Activation de votre statut..."
                      : `Devenir Membre Fondateur (${finalDonationAmount} € minimum)`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Simulation en 1-clic */
              <div className="space-y-3 pt-1">
                {cbSimStep === "success" ? (
                  <div className="border border-emerald-500/40 bg-emerald-950/30 p-4 rounded-xl text-center space-y-2">
                    <Crown className="w-8 h-8 text-amber-400 mx-auto animate-bounce" />
                    <h5 className="font-black text-sm text-emerald-300">
                      Bienvenue parmi les Pionniers d'ALPHABETTE !
                    </h5>
                    <p className="text-xs text-slate-300">
                      Votre statut <strong>Membre Fondateur #{founderSlotNumber}</strong> et votre <strong>Licence Perpétuelle</strong> sont désormais enregistrés.
                    </p>
                    <button
                      type="button"
                      onClick={() => setCbSimStep("idle")}
                      className="text-xs text-amber-400 underline font-bold cursor-pointer"
                    >
                      Modifier mon inscription
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs opacity-75">
                      Activez immédiatement votre profil Fondateur pour simuler ou valider l'enregistrement de votre licence perpétuelle dans l'écosystème.
                    </p>
                    <button
                      type="button"
                      onClick={handleActivateFounder}
                      disabled={!isAmountValid || cbSimStep === "submitting"}
                      className="w-full py-3 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                    >
                      <Crown className="w-4 h-4 text-slate-950" />
                      <span>
                        {!isAmountValid
                          ? "Montant minimum de 30 € requis"
                          : cbSimStep === "submitting"
                          ? "Enregistrement en cours..."
                          : `Devenir Membre Fondateur (${finalDonationAmount} € minimum)`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* QR Code & Sécurité OVH */}
            <div className={`pt-4 flex items-center gap-3 border-t ${
              isDark ? "border-slate-800" : "border-slate-200"
            }`}>
              <div className="bg-white p-1.5 rounded-lg border border-slate-300 shrink-0 shadow-xs">
                <QrCode className="w-10 h-10 text-slate-950" />
              </div>
              <p className="text-[11px] opacity-75 leading-tight">
                Scannez ce QR Code pour accéder directement aux coordonnées bancaires sécurisées depuis votre smartphone ou application bancaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
