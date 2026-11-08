import React from "react";
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Square,
  Sparkles,
  Volume2,
  Gauge
} from "lucide-react";
import { AudioEngineType } from "../lib/speechService";

interface ArticleAudioPlayerProps {
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  engine: AudioEngineType;
  voiceLabel: string;
  activeVoiceName?: string;
  activeVoiceEmoji?: string;
  isDark: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeek: (seconds: number) => void;
  onChangeSpeed: (newSpeed: number) => void;
  onOpenVoiceCustomizer?: () => void;
}

const SPEED_PRESETS = [0.75, 1.0, 1.25, 1.5, 2.0];

export const ArticleAudioPlayer: React.FC<ArticleAudioPlayerProps> = ({
  isPlaying,
  isPaused,
  currentTime,
  duration,
  speed,
  engine,
  voiceLabel,
  activeVoiceName = "Voix Rocailleuse",
  activeVoiceEmoji = "🎙️",
  isDark,
  onPlay,
  onPause,
  onStop,
  onSeek,
  onChangeSpeed,
  onOpenVoiceCustomizer
}) => {
  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const isGoogleEngine = engine === "google_gemini" || engine === "google_studio";

  return (
    <div
      className={`rounded-2xl border p-3 sm:p-4 shadow-xl transition-all duration-300 backdrop-blur-md ${
        isDark
          ? "bg-zinc-950/90 border-indigo-500/30 text-zinc-100 shadow-indigo-950/20"
          : "bg-white/95 border-indigo-200 text-zinc-900 shadow-slate-200/80"
      }`}
    >
      {/* En-tête : Badge Moteur, Bouton Choix de Voix & Animation */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
              isGoogleEngine
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
            }`}
          >
            {isGoogleEngine ? <Sparkles className="w-3 h-3 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
            <span>{isGoogleEngine ? "Voix Naturelle Google HD" : "Voix Système Locale"}</span>
          </span>

          {/* Bouton de personnalisation et sélection de la voix */}
          {onOpenVoiceCustomizer && (
            <button
              type="button"
              onClick={onOpenVoiceCustomizer}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black border transition-all cursor-pointer bg-linear-to-r from-amber-500/15 via-rose-500/15 to-indigo-500/15 hover:from-amber-500/25 hover:to-indigo-500/25 border-amber-500/35 text-amber-500 dark:text-amber-300 shadow-2xs hover:scale-105 active:scale-95"
              title="Changer de timbre ou enregistrer une empreinte vocale (15-20s)..."
            >
              <span>{activeVoiceEmoji}</span>
              <span>Voix : {activeVoiceName}</span>
              <span className="text-[9px] opacity-75">▾</span>
            </button>
          )}

          <span className="text-[11px] opacity-75 font-mono truncate max-w-[160px] sm:max-w-xs">
            {voiceLabel}
          </span>
        </div>

        {/* Animation ondes sonores pendant la lecture */}
        {isPlaying && !isPaused && (
          <div className="flex items-center gap-0.5 px-2 py-1">
            <span className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1 h-2 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.45s]"></span>
            <span className="w-1 h-4 bg-indigo-400 rounded-full animate-bounce"></span>
          </div>
        )}
      </div>

      {/* Barre de progression (si durée connue) */}
      {duration > 0 && (
        <div className="space-y-1 mb-3">
          <div className="relative w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden cursor-pointer group">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-200"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono opacity-70">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Commandes audio & sélecteur de vitesse */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Commandes centrales : Recul 10s, Play/Pause, Avance 10s, Stop */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {duration > 0 && (
            <button
              type="button"
              onClick={() => onSeek(-10)}
              className="p-1.5 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs transition-colors cursor-pointer"
              title="Reculer de 10 secondes"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={isPlaying && !isPaused ? onPause : onPlay}
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            title={isPlaying && !isPaused ? "Mettre en pause" : "Écouter l'article"}
          >
            {isPlaying && !isPaused ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{isPaused ? "Reprendre" : "Écouter"}</span>
              </>
            )}
          </button>

          {duration > 0 && (
            <button
              type="button"
              onClick={() => onSeek(10)}
              className="p-1.5 rounded-lg border border-transparent hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs transition-colors cursor-pointer"
              title="Avancer de 10 secondes"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onStop}
            className="p-1.5 rounded-lg border border-transparent hover:border-rose-300 dark:hover:border-rose-900/40 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 text-xs transition-colors cursor-pointer"
            title="Arrêter la lecture"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>

        {/* Sélecteur de vitesse de lecture interactif (0.75x, 1x, 1.25x, 1.5x, 2x) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="flex items-center gap-1 text-[11px] font-bold text-indigo-500 dark:text-indigo-400">
            <Gauge className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Vitesse :</span>
          </span>
          <div className="inline-flex rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-100/70 dark:bg-zinc-900/80 p-0.5">
            {SPEED_PRESETS.map((preset) => {
              const isCurrent = Math.abs(speed - preset) < 0.05;
              return (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onChangeSpeed(preset)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono font-bold transition-all cursor-pointer ${
                    isCurrent
                      ? "bg-indigo-600 text-white shadow-2xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  }`}
                  title={`Régler la vitesse à ${preset}x`}
                >
                  {preset}x
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
