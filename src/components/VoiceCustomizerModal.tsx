import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Volume2,
  Play,
  Square,
  Sparkles,
  Check,
  Mic,
  MicOff,
  User,
  Plus,
  Trash2,
  Sliders,
  Radio,
  Flame,
  Award,
  Star,
  RefreshCw,
  Clock,
  AudioWaveform,
  Activity,
  Layers,
  HelpCircle,
  Headphones,
  Upload,
  FileAudio
} from "lucide-react";
import { VoiceProfile } from "../types";
import {
  getAllVoiceProfiles,
  getActiveVoiceProfile,
  setActiveVoiceProfileId,
  saveCustomVoiceProfile,
  deleteCustomVoiceProfile,
  DEFAULT_VOICE_PROFILES
} from "../lib/voiceProfiles";
import { articleSpeechManager } from "../lib/speechService";
import { analyzeRecordedVoice, AcousticAnalysisResult } from "../lib/voiceAcousticAnalyzer";

interface VoiceCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onNotify: (message: string) => void;
  onVoiceChanged: (newVoice: VoiceProfile) => void;
}

export const VoiceCustomizerModal: React.FC<VoiceCustomizerModalProps> = ({
  isOpen,
  onClose,
  isDark,
  onNotify,
  onVoiceChanged
}) => {
  const [activeTab, setActiveTab] = useState<"archetypes" | "record" | "custom">("archetypes");
  const [allVoices, setAllVoices] = useState<VoiceProfile[]>(() => getAllVoiceProfiles());
  const [activeProfile, setActiveProfile] = useState<VoiceProfile>(() => getActiveVoiceProfile());
  const [previewingVoiceId, setPreviewingVoiceId] = useState<string | null>(null);

  // Studio d'enregistrement 15-20s
  const [targetDurationSec, setTargetDurationSec] = useState<15 | 20 | 30>(20);
  const [isRecording, setIsRecording] = useState(false);
  const [recordElapsedSec, setRecordElapsedSec] = useState(0);
  const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recordedAudioBase64, setRecordedAudioBase64] = useState<string | null>(null);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AcousticAnalysisResult | null>(null);
  const [isPlayingRecordedSample, setIsPlayingRecordedSample] = useState(false);

  // Formulaire de personnalisation
  const [customName, setCustomName] = useState("");
  const [customSubtitle, setCustomSubtitle] = useState("Empreinte vocale 20s");
  const [customGender, setCustomGender] = useState<"female" | "male">("female");
  const [customPitch, setCustomPitch] = useState<number>(-2.0);
  const [customRaspy, setCustomRaspy] = useState<number>(0.75);
  const [customSpeakingRate, setCustomSpeakingRate] = useState<number>(1.0);
  const [customStylePrompt, setCustomStylePrompt] = useState("");

  // Références d'enregistrement et Web Audio
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sampleAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Arrêt et nettoyage du micro (fonction hoistée)
  function stopRecordingCleanup() {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioStreamRef.current) {
      try {
        audioStreamRef.current.getTracks().forEach((track) => track.stop());
      } catch (_) {}
      audioStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close().catch(() => {});
      } catch (_) {}
      audioContextRef.current = null;
    }
    setIsRecording(false);
  }

  useEffect(() => {
    if (isOpen) {
      const voices = getAllVoiceProfiles();
      setAllVoices(voices);
      setActiveProfile(getActiveVoiceProfile());
    } else {
      if (audioStreamRef.current || timerIntervalRef.current) {
        stopRecordingCleanup();
      }
      if (sampleAudioElementRef.current) {
        sampleAudioElementRef.current.pause();
        sampleAudioElementRef.current = null;
      }
      setIsPlayingRecordedSample(false);
    }
  }, [isOpen]);

  // Nettoyage lors du démontage
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      if (sampleAudioElementRef.current) {
        sampleAudioElementRef.current.pause();
      }
    };
  }, []);

  if (!isOpen) return null;

  const archetypes = allVoices.filter((v) => !v.isCustom);
  const customVoices = allVoices.filter((v) => v.isCustom);

  const handleSelectVoice = (voice: VoiceProfile) => {
    setActiveVoiceProfileId(voice.id);
    setActiveProfile(voice);
    onVoiceChanged(voice);
    onNotify(`🎙️ Voix activée : ${voice.name} (${voice.subtitle})`);
  };

  const handlePreviewVoice = async (voice: VoiceProfile) => {
    if (previewingVoiceId === voice.id) {
      articleSpeechManager.stop();
      setPreviewingVoiceId(null);
      return;
    }

    setPreviewingVoiceId(voice.id);
    await articleSpeechManager.testVoice(
      voice,
      voice.samplePhrase,
      () => {},
      () => setPreviewingVoiceId(null),
      (err) => {
        setPreviewingVoiceId(null);
        onNotify(`⚠️ Aperçu audio : ${err}`);
      }
    );
  };

  // Démarrer l'enregistrement 15-20s avec visualiseur
  const handleStartRecording = async () => {
    stopRecordingCleanup();
    setRecordElapsedSec(0);
    setRecordedAudioBlob(null);
    setRecordedAudioUrl(null);
    setRecordedAudioBase64(null);
    setAnalysisResult(null);

    if (
      typeof navigator === "undefined" ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== "function"
    ) {
      onNotify("⚠️ Le micro n'est pas supporté par ce navigateur. Vous pouvez importer un fichier audio ci-dessous.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      audioStreamRef.current = stream;
      recordedChunksRef.current = [];

      // Initialisation Web Audio pour visualiseur
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Boucle de dessin de l'onde sonore
      const drawWaveform = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barWidth = (canvas.width / bufferLength) * 2.2;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, "#4f46e5");
          gradient.addColorStop(0.5, "#06b6d4");
          gradient.addColorStop(1, "#ec4899");
          ctx.fillStyle = gradient;
          ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
          x += barWidth;
        }

        animationFrameRef.current = requestAnimationFrame(drawWaveform);
      };
      drawWaveform();

      // Initialisation MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" });
        setRecordedAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedAudioUrl(url);

        // Convertir en base64 pour persistance
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = (reader.result as string)?.split(",")?.[1] || "";
          setRecordedAudioBase64(base64);
        };
        reader.readAsDataURL(blob);

        // Analyse acoustique automatique
        setIsAnalyzingAudio(true);
        try {
          const analysis = await analyzeRecordedVoice(blob);
          setAnalysisResult(analysis);
          setCustomGender(analysis.recommendedGender);
          setCustomPitch(analysis.recommendedPitchSemiTones);
          setCustomRaspy(analysis.recommendedRaspyEffect);
          setCustomSpeakingRate(analysis.recommendedSpeakingRate);
          setCustomStylePrompt(
            `Voix personnalisée, timbre ${analysis.detectedTone.toLowerCase()}, hauteur ${analysis.estimatedPitchHz} Hz, grain à ${Math.round(analysis.recommendedRaspyEffect * 100)}%.`
          );
          onNotify(`✅ Empreinte vocale analysée avec succès (${analysis.durationSec}s) !`);
        } catch (err) {
          console.warn("Erreur analyse acoustique :", err);
          onNotify("Échantillon enregistré avec succès.");
        } finally {
          setIsAnalyzingAudio(false);
          stopRecordingCleanup();
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      onNotify(`🎙️ Enregistrement démarré : lisez le texte pendant ${targetDurationSec} secondes.`);

      // Compteur précis de durée
      let elapsed = 0;
      timerIntervalRef.current = setInterval(() => {
        elapsed += 1;
        setRecordElapsedSec(elapsed);

        if (elapsed >= targetDurationSec) {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
          }
        }
      }, 1000);
    } catch (err: any) {
      console.warn("Microphone access permission warning:", err);
      onNotify("⚠️ Accès au micro refusé ou restreint par le navigateur. Vous pouvez importer un fichier audio ou choisir un étalonnage type ci-dessous.");
      stopRecordingCleanup();
    }
  };

  // Traitement d'un fichier audio importé alternativement
  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopRecordingCleanup();
    setRecordElapsedSec(0);
    setRecordedAudioBlob(file);
    const url = URL.createObjectURL(file);
    setRecordedAudioUrl(url);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string)?.split(",")?.[1] || "";
      setRecordedAudioBase64(base64);
    };
    reader.readAsDataURL(file);

    setIsAnalyzingAudio(true);
    try {
      const analysis = await analyzeRecordedVoice(file);
      setAnalysisResult(analysis);
      setCustomGender(analysis.recommendedGender);
      setCustomPitch(analysis.recommendedPitchSemiTones);
      setCustomRaspy(analysis.recommendedRaspyEffect);
      setCustomSpeakingRate(analysis.recommendedSpeakingRate);
      setCustomStylePrompt(
        `Voix personnalisée, timbre ${analysis.detectedTone.toLowerCase()}, hauteur ${analysis.estimatedPitchHz} Hz, grain à ${Math.round(analysis.recommendedRaspyEffect * 100)}%.`
      );
      if (!customName) {
        setCustomName(`Voix ${analysis.detectedTone}`);
      }
      onNotify(`✅ Fichier audio analysé avec succès (${analysis.durationSec}s, ${analysis.estimatedPitchHz} Hz) !`);
    } catch (err) {
      console.warn("Erreur analyse acoustique du fichier :", err);
      onNotify("⚠️ Analyse acoustique partielle. Les paramètres peuvent être affinés ci-dessous.");
    } finally {
      setIsAnalyzingAudio(false);
    }
  };

  // Préréglages d'étalonnage acoustique immédiats (sans micro)
  const handleApplyPresetCalibration = (preset: "grave" | "medium" | "tonique") => {
    if (preset === "grave") {
      setCustomGender("male");
      setCustomPitch(-3.2);
      setCustomRaspy(0.8);
      setCustomSpeakingRate(0.92);
      setCustomName("Signature Grave & Rocailleuse");
      setCustomSubtitle("F0 ~88 Hz • Grain 80%");
      setCustomStylePrompt("Voix grave, timbre rocailleux et profond, débit posé et chaleureux.");
      setAnalysisResult({
        durationSec: 18,
        estimatedPitchHz: 88,
        recommendedGender: "male",
        recommendedPitchSemiTones: -3.2,
        recommendedRaspyEffect: 0.8,
        recommendedSpeakingRate: 0.92,
        detectedTone: "Grave & Rocailleux"
      });
      onNotify("🎯 Étalonnage appliqué : Timbre Grave & Rocailleux (88 Hz)");
    } else if (preset === "medium") {
      setCustomGender("male");
      setCustomPitch(-1.0);
      setCustomRaspy(0.5);
      setCustomSpeakingRate(1.0);
      setCustomName("Signature Médium Chaleureuse");
      setCustomSubtitle("F0 ~135 Hz • Grain 50%");
      setCustomStylePrompt("Voix médium naturelle, timbre chaleureux et enveloppant, diction fluide.");
      setAnalysisResult({
        durationSec: 20,
        estimatedPitchHz: 135,
        recommendedGender: "male",
        recommendedPitchSemiTones: -1.0,
        recommendedRaspyEffect: 0.5,
        recommendedSpeakingRate: 1.0,
        detectedTone: "Chaleureux & Posé"
      });
      onNotify("🎯 Étalonnage appliqué : Timbre Médium Chaleureux (135 Hz)");
    } else {
      setCustomGender("female");
      setCustomPitch(2.0);
      setCustomRaspy(0.3);
      setCustomSpeakingRate(1.08);
      setCustomName("Signature Claire & Rythmée");
      setCustomSubtitle("F0 ~195 Hz • Grain 30%");
      setCustomStylePrompt("Voix claire, tonique et articulée, dynamique et entraînante.");
      setAnalysisResult({
        durationSec: 16,
        estimatedPitchHz: 195,
        recommendedGender: "female",
        recommendedPitchSemiTones: 2.0,
        recommendedRaspyEffect: 0.3,
        recommendedSpeakingRate: 1.08,
        detectedTone: "Clair & Dynamique"
      });
      onNotify("🎯 Étalonnage appliqué : Timbre Clair & Dynamique (195 Hz)");
    }
  };

  // Arrêt manuel anticipé (si au moins 8s)
  const handleStopRecordingManually = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  // Écouter l'échantillon brut enregistré
  const handleTogglePlaySample = () => {
    if (!recordedAudioUrl) return;

    if (isPlayingRecordedSample) {
      if (sampleAudioElementRef.current) {
        sampleAudioElementRef.current.pause();
        sampleAudioElementRef.current = null;
      }
      setIsPlayingRecordedSample(false);
    } else {
      const audio = new Audio(recordedAudioUrl);
      sampleAudioElementRef.current = audio;
      audio.onended = () => setIsPlayingRecordedSample(false);
      audio.onerror = () => setIsPlayingRecordedSample(false);
      audio.play().then(() => setIsPlayingRecordedSample(true)).catch(() => setIsPlayingRecordedSample(false));
    }
  };

  // Sauvegarde de la voix personnalisée
  const handleSaveCustomVoice = () => {
    const trimmedName = customName.trim();
    if (!trimmedName) {
      onNotify("⚠️ Veuillez saisir le nom de la voix (ex: Valentin, Mon Timbre, Sophie...)");
      return;
    }

    const newProfile: VoiceProfile = {
      id: `custom_${Date.now()}`,
      name: trimmedName,
      subtitle: customSubtitle.trim() || `Empreinte vocale (${analysisResult?.durationSec || 20}s)`,
      category: "custom",
      description: customStylePrompt || `Voix personnalisée de ${trimmedName}`,
      avatarEmoji: customGender === "female" ? "🎙️" : "🎙️",
      badgeText: "👤 Empreinte Vocale Réelle",
      gender: customGender,
      geminiVoiceName: customGender === "female" ? "Aoede" : "Fenrir",
      geminiStylePrompt: customStylePrompt || `Voix personnalisée de ${trimmedName}, ton naturel et fidèle à l'empreinte enregistrée.`,
      googleCloudVoiceName: customGender === "female" ? "fr-FR-Studio-A" : "fr-FR-Studio-B",
      pitchSemiTones: customPitch,
      speakingRateMultiplier: customSpeakingRate,
      raspyEffect: customRaspy,
      warmthBoost: 0.85,
      isCustom: true,
      sampleAudioBase64: recordedAudioBase64 || undefined,
      sampleAudioDuration: analysisResult?.durationSec || recordElapsedSec || undefined,
      samplePhrase: `Bonjour ! Vous écoutez InfoPerso avec ma voix personnalisée, calibrée d'après mon échantillon vocal de ${targetDurationSec} secondes.`,
      acousticAnalysis: analysisResult ? {
        estimatedPitchHz: analysisResult.estimatedPitchHz,
        spectralRoughness: analysisResult.recommendedRaspyEffect,
        cadenceWpm: Math.round(135 * analysisResult.recommendedSpeakingRate),
        recordedDurationSec: analysisResult.durationSec,
        detectedTone: analysisResult.detectedTone
      } : undefined,
      createdAt: Date.now()
    };

    const updated = saveCustomVoiceProfile(newProfile);
    setAllVoices(updated);
    handleSelectVoice(newProfile);
    setActiveTab("archetypes");
    onNotify(`✨ Empreinte vocale de "${trimmedName}" sauvegardée et activée !`);
  };

  // Suppression voix personnalisée
  const handleDeleteCustomVoice = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = deleteCustomVoiceProfile(id);
    setAllVoices(updated);
    setActiveProfile(getActiveVoiceProfile());
    onNotify("🗑️ Voix personnalisée supprimée.");
  };

  const progressPercent = Math.min(100, Math.round((recordElapsedSec / targetDurationSec) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden transition-all ${
          isDark
            ? "bg-zinc-950 border-zinc-800 text-zinc-100"
            : "bg-white border-zinc-200 text-zinc-900"
        }`}
      >
        {/* En-tête */}
        <div className={`p-4 sm:p-5 border-b flex items-start justify-between gap-3 ${isDark ? "border-zinc-800 bg-zinc-900/50" : "border-zinc-200 bg-zinc-50"}`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
                <AudioWaveform className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Studio Vocal : Timbre Réel & Empreinte Personnalisée
              </h2>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Choisissez un archétype vocal descriptif ou <strong>enregistrez 15 à 20 secondes</strong> de voix réelle pour calibrer une empreinte acoustique fidèle.
            </p>
          </div>

          <button
            onClick={() => {
              articleSpeechManager.stop();
              setPreviewingVoiceId(null);
              onClose();
            }}
            className="p-1.5 rounded-lg border border-transparent hover:border-zinc-700 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation des Onglets */}
        <div className={`flex border-b text-xs font-bold px-3 sm:px-5 gap-2 shrink-0 ${isDark ? "border-zinc-800 bg-zinc-900/30" : "border-zinc-200 bg-zinc-100/60"}`}>
          <button
            onClick={() => setActiveTab("archetypes")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === "archetypes"
                ? "border-indigo-500 text-indigo-500 font-extrabold"
                : "border-transparent text-zinc-400 hover:text-current"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Styles Prédéfinis ({archetypes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("record")}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
              activeTab === "record"
                ? "border-indigo-500 text-indigo-500 font-extrabold"
                : "border-transparent text-zinc-400 hover:text-current"
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Studio Enregistrement (15-20s)</span>
          </button>

          {customVoices.length > 0 && (
            <button
              onClick={() => setActiveTab("custom")}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 cursor-pointer transition-colors ${
                activeTab === "custom"
                  ? "border-indigo-500 text-indigo-500 font-extrabold"
                  : "border-transparent text-zinc-400 hover:text-current"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Mes Voix ({customVoices.length})</span>
            </button>
          )}
        </div>

        {/* Corps défilable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* ============================================================= */}
          {/* ONGLET 1 : STYLES VOCAUX PRÉDÉFINIS (SANS NOMS DE CÉLÉBRITÉS) */}
          {/* ============================================================= */}
          {activeTab === "archetypes" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Timbres & Styles Acoustiques
                </span>
                <span className="text-[11px] text-indigo-400 font-medium">
                  Voix active : <strong>{activeProfile.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {archetypes.map((voice) => {
                  const isSelected = activeProfile.id === voice.id;
                  const isPreviewing = previewingVoiceId === voice.id;
                  const isRaspySignature = voice.id === "raspy_rock";

                  return (
                    <div
                      key={voice.id}
                      onClick={() => handleSelectVoice(voice)}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20 shadow-lg"
                          : isDark
                          ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900"
                          : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 shadow-xs"
                      }`}
                    >
                      {/* Badge signature pour la voix rocailleuse */}
                      {isRaspySignature && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black uppercase shadow-xs flex items-center gap-1">
                          <Flame className="w-2.5 h-2.5" />
                          <span>Grain Rocailleux Signature ⭐</span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl shrink-0 p-1 rounded-lg bg-zinc-800/40">
                            {voice.avatarEmoji}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-black truncate">{voice.name}</h3>
                              {isSelected && (
                                <span className="p-0.5 rounded-full bg-emerald-500 text-white shrink-0">
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-zinc-400 truncate">{voice.subtitle}</p>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {voice.description}
                        </p>
                      </div>

                      {/* Barre d'action : Tester & Choisir */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-800/50 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewVoice(voice);
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                            isPreviewing
                              ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                              : "bg-zinc-800/60 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                          }`}
                          title="Écouter un extrait de test"
                        >
                          {isPreviewing ? (
                            <>
                              <Square className="w-3 h-3 fill-current" />
                              <span>Arrêter</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>Tester</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectVoice(voice)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white"
                          }`}
                        >
                          {isSelected ? "Active ✓" : "Choisir"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* ONGLET 2 : STUDIO D'ENREGISTREMENT VOCAL (15-20 SECONDES)     */}
          {/* ============================================================= */}
          {activeTab === "record" && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                  <span>Protocole d'Étalonnage Vocal Réel (15 à 20 secondes)</span>
                </div>
                <p className="text-zinc-300 leading-relaxed">
                  Lisez le texte ci-dessous à haute voix pendant <strong>15 à 20 secondes</strong>. L'analyseur extrait la fréquence fondamentale exacte (F0 en Hz), le niveau de rugosité du grain et le rythme naturel de diction pour calibrer la voix.
                </p>
              </div>

              {/* Sélecteur de durée cible */}
              <div className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-zinc-800 bg-zinc-900/40">
                <span className="font-bold text-zinc-300">Durée d'enregistrement ciblée :</span>
                <div className="flex items-center gap-1.5">
                  {[15, 20, 30].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      disabled={isRecording}
                      onClick={() => setTargetDurationSec(sec as any)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                        targetDurationSec === sec
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-zinc-800 text-zinc-400 hover:text-white"
                      }`}
                    >
                      {sec} secondes
                    </button>
                  ))}
                </div>
              </div>

              {/* Texte de lecture phonétique guidé */}
              <div className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                  <span>Texte de référence à lire au micro :</span>
                  <span className="text-indigo-400">~{targetDurationSec} secondes de lecture</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-zinc-200 leading-relaxed italic bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                  « Pour calibrer mon empreinte vocale sur InfoPerso, je lis ce court extrait pendant une vingtaine de secondes. L'analyseur étudie le timbre, la hauteur de mes intonations, mon débit naturel et le grain de ma voix. Ainsi, les chroniques d'actualité seront restituées avec ma propre signature sonore. »
                </p>
              </div>

              {/* Zone d'enregistrement & Visualiseur de Spectre */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-3">
                {/* Visualiseur Canvas */}
                <div className="relative h-20 rounded-lg overflow-hidden bg-zinc-950 border border-zinc-800/80 flex items-center justify-center">
                  <canvas ref={canvasRef} width={500} height={80} className="w-full h-full" />
                  {!isRecording && !recordedAudioUrl && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-zinc-500 font-mono gap-2 pointer-events-none">
                      <Mic className="w-4 h-4 text-zinc-600" />
                      <span>Visualiseur inactif • Cliquez sur Démarrer</span>
                    </div>
                  )}
                  {isRecording && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-rose-600/90 text-white text-[10px] font-bold animate-pulse flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      <span>EN COURS</span>
                    </div>
                  )}
                </div>

                {/* Barre de progression & Compteur */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-mono font-bold">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{recordElapsedSec}s / {targetDurationSec}s</span>
                    </span>
                    <span className="text-indigo-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-indigo-500 via-cyan-400 to-rose-500 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Boutons d'enregistrement micro et options alternatives */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    {!isRecording ? (
                      <button
                        type="button"
                        onClick={handleStartRecording}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-all cursor-pointer"
                      >
                        <Mic className="w-4 h-4" />
                        <span>Démarrer l'enregistrement ({targetDurationSec}s)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopRecordingManually}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-rose-400 border border-rose-500/40 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer animate-pulse"
                      >
                        <Square className="w-4 h-4 fill-current" />
                        <span>Arrêter maintenant ({recordElapsedSec}s enregistrées)</span>
                      </button>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleAudioFileUpload}
                      accept="audio/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isRecording}
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-zinc-700 transition-all cursor-pointer"
                      title="Importer un fichier audio déjà enregistré (.mp3, .wav, .m4a)"
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Importer un fichier audio</span>
                    </button>
                  </div>

                  {recordedAudioUrl && (
                    <button
                      type="button"
                      onClick={handleTogglePlaySample}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                        isPlayingRecordedSample
                          ? "bg-indigo-600 text-white border-indigo-500"
                          : "bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700"
                      }`}
                    >
                      {isPlayingRecordedSample ? (
                        <>
                          <Square className="w-3.5 h-3.5 fill-current" />
                          <span>Arrêter l'écoute</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Réécouter mon enregistrement</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Étalonnages acoustiques immédiats (sans micro requis) */}
                <div className="pt-2 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                  <span className="text-zinc-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>Ou tester un profil étalonné réel (1 clic) :</span>
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleApplyPresetCalibration("grave")}
                      className="px-2 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-all cursor-pointer font-medium"
                    >
                      Grave & Rocailleux (88 Hz)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetCalibration("medium")}
                      className="px-2 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-all cursor-pointer font-medium"
                    >
                      Médium Chaleureux (135 Hz)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPresetCalibration("tonique")}
                      className="px-2 py-1 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700/80 transition-all cursor-pointer font-medium"
                    >
                      Clair & Dynamique (195 Hz)
                    </button>
                  </div>
                </div>
              </div>

              {/* Rapport d'Analyse Acoustique Automatique */}
              {isAnalyzingAudio && (
                <div className="p-3.5 rounded-xl border border-indigo-500/30 bg-indigo-950/20 text-xs flex items-center gap-2 text-indigo-300 animate-pulse">
                  <Activity className="w-4 h-4" />
                  <span>Analyse acoustique spectrale en cours (hauteur F0, grain éraillé, débit)...</span>
                </div>
              )}

              {analysisResult && (
                <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/15 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Empreinte Vocale Analysée avec Succès</span>
                    </span>
                    <span className="font-mono text-[11px]">{analysisResult.durationSec}s capturées</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Fréquence F0</span>
                      <strong className="text-white text-xs">{analysisResult.estimatedPitchHz} Hz</strong>
                      <span className="text-[10px] text-emerald-400 block truncate">{analysisResult.detectedTone}</span>
                    </div>

                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Grain & Éraillure</span>
                      <strong className="text-white text-xs">{Math.round(analysisResult.recommendedRaspyEffect * 100)}%</strong>
                      <span className="text-[10px] text-zinc-400 block truncate">Rugosité spectrale</span>
                    </div>

                    <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-800">
                      <span className="text-[10px] text-zinc-400 block">Calibrage Pitch</span>
                      <strong className="text-white text-xs">{analysisResult.recommendedPitchSemiTones > 0 ? `+${analysisResult.recommendedPitchSemiTones}` : analysisResult.recommendedPitchSemiTones} st</strong>
                      <span className="text-[10px] text-zinc-400 block truncate">Ajustement tonal</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Formulaire de Sauvegarde & Ajustement */}
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Nom de la voix enregistrée</label>
                    <input
                      type="text"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      placeholder="Ex: Ma Voix (Valentin), Sophie, Maman..."
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-700 bg-zinc-900 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-300">Sous-titre descriptif</label>
                    <input
                      type="text"
                      value={customSubtitle}
                      onChange={(e) => setCustomSubtitle(e.target.value)}
                      placeholder="Ex: Enregistrement 20s timbre naturel"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-700 bg-zinc-900 text-white focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Curseurs acoustiques affinables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 rounded-xl border border-zinc-800 bg-zinc-900/40">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Hauteur de Voix (Pitch)</span>
                      <span className="font-mono text-indigo-400">{customPitch > 0 ? `+${customPitch}` : customPitch} st</span>
                    </div>
                    <input
                      type="range"
                      min="-6.0"
                      max="4.0"
                      step="0.5"
                      value={customPitch}
                      onChange={(e) => setCustomPitch(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Grave / Baryton</span>
                      <span>Médium</span>
                      <span>Aiguë / Clair</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span>Grain Rocailleux / Éraillure</span>
                      <span className="font-mono text-indigo-400">{Math.round(customRaspy * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1.0"
                      step="0.05"
                      value={customRaspy}
                      onChange={(e) => setCustomRaspy(parseFloat(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>Voix lisse</span>
                      <span>Grain naturel</span>
                      <span>Très rocailleux</span>
                    </div>
                  </div>
                </div>

                {/* Bouton de sauvegarde final */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    disabled={!recordedAudioBase64 && !customName}
                    onClick={handleSaveCustomVoice}
                    className={`px-5 py-2.5 rounded-xl text-white font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                      recordedAudioBase64 || customName
                        ? "bg-linear-to-r from-indigo-600 to-cyan-600 hover:opacity-95"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Sauvegarder & Activer cette Empreinte Vocale</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================= */}
          {/* ONGLET 3 : MES VOIX PERSONNALISÉES                            */}
          {/* ============================================================= */}
          {activeTab === "custom" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Voix réelles et personnalisées enregistrées
                </span>
                <button
                  onClick={() => setActiveTab("record")}
                  className="text-xs font-bold text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enregistrer une nouvelle voix (15-20s)</span>
                </button>
              </div>

              <div className="space-y-2">
                {customVoices.map((voice) => {
                  const isSelected = activeProfile.id === voice.id;
                  const isPreviewing = previewingVoiceId === voice.id;

                  return (
                    <div
                      key={voice.id}
                      onClick={() => handleSelectVoice(voice)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-950/30 border-indigo-500 shadow-sm"
                          : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl p-1.5 rounded-lg bg-zinc-800/60">{voice.avatarEmoji}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold truncate text-white">{voice.name}</span>
                            {isSelected && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500 text-white font-bold">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-zinc-400 truncate">{voice.subtitle}</p>
                          {voice.acousticAnalysis && (
                            <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-mono mt-0.5">
                              <span>F0: {voice.acousticAnalysis.estimatedPitchHz} Hz</span>
                              <span>•</span>
                              <span>Grain: {Math.round((voice.acousticAnalysis.spectralRoughness || 0) * 100)}%</span>
                              {voice.acousticAnalysis.recordedDurationSec && (
                                <>
                                  <span>•</span>
                                  <span>{voice.acousticAnalysis.recordedDurationSec}s</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreviewVoice(voice);
                          }}
                          className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                            isPreviewing
                              ? "bg-rose-600 text-white border-rose-500 animate-pulse"
                              : "bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700"
                          }`}
                          title="Tester la voix"
                        >
                          {isPreviewing ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                        </button>

                        <button
                          type="button"
                          onClick={(e) => handleDeleteCustomVoice(e, voice.id)}
                          className="p-2 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                          title="Supprimer cette voix"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pied de page informatif ALPHABETTE */}
        <div className={`p-3 sm:px-5 border-t text-[11px] flex items-center justify-between ${isDark ? "border-zinc-800 bg-zinc-900/60 text-zinc-400" : "border-zinc-200 bg-zinc-50 text-zinc-600"}`}>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Studio acoustique souverain ALPHABETTE • Traitement vocal local respectant votre vie privée</span>
          </div>
          <button
            onClick={() => {
              articleSpeechManager.stop();
              setPreviewingVoiceId(null);
              onClose();
            }}
            className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
