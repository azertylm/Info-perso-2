/**
 * Analyseur Acoustique Vocal & Calibrage d'Empreinte Vocale (15-30s)
 * ALPHABETTE SASU - InfoPerso
 * 
 * Analyse en direct via l'API Web Audio :
 * - Fréquence fondamentale F0 (hauteur naturelle de la voix via autocorrélation temporelle)
 * - Rugosité spectrale & grain (évaluation de l'éraillure / voix rauque)
 * - Énergie et cadence de diction
 */

export interface AcousticAnalysisResult {
  durationSec: number;
  estimatedPitchHz: number;
  detectedTone: string;
  recommendedGender: "female" | "male";
  recommendedPitchSemiTones: number;
  recommendedRaspyEffect: number;
  recommendedSpeakingRate: number;
  summaryReport: string;
}

/**
 * Estime la fréquence fondamentale F0 (Hz) par autocorrélation normalisée
 */
function estimatePitchFromBuffer(channelData: Float32Array, sampleRate: number): number {
  const minFreq = 65; // Fréquence basse (baryton / basse profonde)
  const maxFreq = 420; // Fréquence haute (soprano / voix aiguë)

  const minPeriod = Math.floor(sampleRate / maxFreq);
  const maxPeriod = Math.floor(sampleRate / minFreq);

  // Échantillonner au milieu de l'enregistrement pour éviter les silences du début/fin
  const sampleLength = Math.min(channelData.length, 44100 * 4); // 4 secondes
  const startIndex = Math.max(0, Math.floor(channelData.length / 2 - sampleLength / 2));
  
  let bestCorrelation = -1;
  let bestPeriod = -1;

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let sum = 0;
    let norm1 = 0;
    let norm2 = 0;

    const testLength = Math.min(sampleLength - period, 2048);
    for (let i = 0; i < testLength; i++) {
      const val1 = channelData[startIndex + i];
      const val2 = channelData[startIndex + i + period];
      sum += val1 * val2;
      norm1 += val1 * val1;
      norm2 += val2 * val2;
    }

    const norm = Math.sqrt(norm1 * norm2);
    const correlation = norm > 0 ? sum / norm : 0;

    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestPeriod = period;
    }
  }

  if (bestPeriod > 0 && bestCorrelation > 0.45) {
    return Math.round(sampleRate / bestPeriod);
  }

  // Repli moyen si non concluant
  return 150;
}

/**
 * Évalue la rugosité spectrale (grain / éraillure vocale)
 */
function estimateRoughnessFromBuffer(channelData: Float32Array): number {
  let zeroCrossings = 0;
  let energy = 0;

  for (let i = 1; i < channelData.length; i++) {
    if ((channelData[i] >= 0 && channelData[i - 1] < 0) || (channelData[i] < 0 && channelData[i - 1] >= 0)) {
      zeroCrossings++;
    }
    energy += Math.abs(channelData[i]);
  }

  const avgEnergy = energy / channelData.length;
  const zcr = zeroCrossings / channelData.length;

  // Voix éraillée : taux de passage par zéro plus dispersé et haute fréquence de micro-bruit
  const roughnessIndex = Math.min(1.0, Math.max(0.05, zcr * 8.0 * (avgEnergy > 0.02 ? 1.2 : 0.8)));
  return Math.round(roughnessIndex * 100) / 100;
}

/**
 * Analyse complète d'un blob audio (15 à 30 secondes)
 */
export async function analyzeRecordedVoice(audioBlob: Blob): Promise<AcousticAnalysisResult> {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  try {
    const arrayBuffer = await audioBlob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const durationSec = Math.round(audioBuffer.duration * 10) / 10;
    const channelData = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;

    // 1. Détection de la fréquence fondamentale (Hz)
    const pitchHz = estimatePitchFromBuffer(channelData, sampleRate);

    // 2. Détection de la rugosité spectrale (éraillure / grain rauque)
    const roughness = estimateRoughnessFromBuffer(channelData);

    // 3. Classification du timbre
    let detectedTone = "Voix Médium / Posée";
    let recommendedGender: "female" | "male" = "male";
    let recommendedPitchSemiTones = 0.0;
    let recommendedSpeakingRate = 1.0;

    if (pitchHz < 115) {
      detectedTone = "Voix Baryton-Basse (Très grave & profonde)";
      recommendedGender = "male";
      recommendedPitchSemiTones = -3.5;
      recommendedSpeakingRate = 0.94;
    } else if (pitchHz < 155) {
      detectedTone = "Voix Baryton / Médium (Grave & chaleureuse)";
      recommendedGender = "male";
      recommendedPitchSemiTones = -1.5;
      recommendedSpeakingRate = 0.98;
    } else if (pitchHz < 195) {
      detectedTone = "Voix Ténor / Alto (Timbre équilibré & clair)";
      recommendedGender = pitchHz > 175 ? "female" : "male";
      recommendedPitchSemiTones = 0.0;
      recommendedSpeakingRate = 1.02;
    } else if (pitchHz < 255) {
      detectedTone = "Voix Mezzo-Soprano (Claire & expressive)";
      recommendedGender = "female";
      recommendedPitchSemiTones = 1.2;
      recommendedSpeakingRate = 1.05;
    } else {
      detectedTone = "Voix Aiguë & Vive (Haute fréquence & dynamique)";
      recommendedGender = "female";
      recommendedPitchSemiTones = 2.5;
      recommendedSpeakingRate = 1.08;
    }

    const recommendedRaspyEffect = Math.min(0.95, Math.max(0.1, roughness * 1.5));

    const summaryReport = `Échantillon analysé (${durationSec}s) : Fréquence fondamentale de ${pitchHz} Hz (${detectedTone}). Grain acoustique estimé à ${Math.round(recommendedRaspyEffect * 100)}% de texture éraillée.`;

    return {
      durationSec,
      estimatedPitchHz: pitchHz,
      detectedTone,
      recommendedGender,
      recommendedPitchSemiTones,
      recommendedRaspyEffect,
      recommendedSpeakingRate,
      summaryReport
    };
  } finally {
    if (audioContext.state !== "closed") {
      audioContext.close().catch(() => {});
    }
  }
}
