/**
 * Speech Synthesis Utility for LexiMind
 * Configured specifically for a natural, calm, warm woman's voice with a clear British / English accent.
 */

const VOICE_PREFS_KEY = "leximind_speech_voice_prefs_v1";

export interface SpeechSettings {
  pitch: number; // 0.70 to 1.10 (Default: 0.90 for a calm, warm, mature register)
  rate: number;  // 0.75 to 1.25 (Default: 0.92 for clear academic enunciation)
  selectedVoiceURI?: string;
}

const DEFAULT_SPEECH_SETTINGS: SpeechSettings = {
  pitch: 0.90, // Calibrated down to prevent any high-pitched or squeaky tones
  rate: 0.92,  // Crisp, intelligible cadence for complex legal provisions
};

export function getStoredSpeechSettings(): SpeechSettings {
  if (typeof window === "undefined") return DEFAULT_SPEECH_SETTINGS;
  try {
    const saved = localStorage.getItem(VOICE_PREFS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        pitch: typeof parsed.pitch === "number" ? Math.min(Math.max(parsed.pitch, 0.7), 1.1) : DEFAULT_SPEECH_SETTINGS.pitch,
        rate: typeof parsed.rate === "number" ? Math.min(Math.max(parsed.rate, 0.75), 1.25) : DEFAULT_SPEECH_SETTINGS.rate,
        selectedVoiceURI: parsed.selectedVoiceURI || undefined,
      };
    }
  } catch (e) {
    console.warn("Failed to load speech settings:", e);
  }
  return DEFAULT_SPEECH_SETTINGS;
}

export function saveSpeechSettings(settings: Partial<SpeechSettings>): SpeechSettings {
  const current = getStoredSpeechSettings();
  const updated: SpeechSettings = {
    ...current,
    ...settings,
  };
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(VOICE_PREFS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Failed to save speech settings:", e);
    }
  }
  return updated;
}

// Priority ranked female UK/Commonwealth English voices
const FEMALE_UK_VOICE_PATTERNS = [
  "microsoft sonia online (natural) - english (united kingdom)",
  "microsoft libby online (natural) - english (united kingdom)",
  "microsoft mia online (natural) - english (united kingdom)",
  "google uk english female",
  "microsoft sonia",
  "microsoft libby",
  "microsoft mia",
  "microsoft hazel",
  "serena",
  "alice",
  "victoria",
  "kate",
  "fiona",
  "susan",
  "stephanie",
  "en-gb-standard-a",
  "en-gb-standard-c",
  "en-gb-wavenet-a",
  "en-gb-wavenet-c",
  "en-gb-neural",
];

const SECONDARY_FEMALE_EN_PATTERNS = [
  "google us english female",
  "microsoft aria online (natural)",
  "microsoft jenny online (natural)",
  "microsoft aria",
  "microsoft jenny",
  "samantha",
  "karen",
  "moira",
  "tessa",
  "catherine",
  "female",
];

const MALE_VOICE_EXCLUSIONS = [
  "male",
  "david",
  "george",
  "mark",
  "james",
  "richard",
  "guy",
  "ryan",
  "oliver",
  "arthur",
  "daniel",
  "thomas",
  "paul",
  "brian",
  "stefan",
  "alex",
  "fred",
  "alva",
  "ralph",
  "tom",
];

/**
 * Returns all available English female voices detected on the device
 */
export function getAvailableFemaleEnglishVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return [];
  }
  const voices = window.speechSynthesis.getVoices() || [];
  return voices.filter((voice) => {
    const name = voice.name.toLowerCase();
    const lang = (voice.lang || "").toLowerCase().replace("_", "-");
    if (!lang.startsWith("en")) return false;
    const isMale = MALE_VOICE_EXCLUSIONS.some((m) => name.includes(m));
    return !isMale;
  });
}

/**
 * Selects the best natural woman's voice with a clear English accent
 */
export function getFemaleEnglishVoice(preferredURI?: string): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. If explicit user preference was saved and exists
  if (preferredURI) {
    const custom = voices.find((v) => v.voiceURI === preferredURI);
    if (custom) return custom;
  }

  const storedPref = getStoredSpeechSettings().selectedVoiceURI;
  if (storedPref) {
    const custom = voices.find((v) => v.voiceURI === storedPref);
    if (custom) return custom;
  }

  let bestVoice: SpeechSynthesisVoice | null = null;
  let bestScore = -1;

  for (const voice of voices) {
    const name = voice.name.toLowerCase();
    const lang = (voice.lang || "").toLowerCase().replace("_", "-");

    // Only English voices
    if (!lang.startsWith("en")) continue;

    // Eliminate male voices
    if (MALE_VOICE_EXCLUSIONS.some((kw) => name.includes(kw))) continue;

    let score = 0;

    // 1. Highest priority: UK / British English (en-GB)
    if (lang === "en-gb") {
      score += 45;
    } else if (lang === "en-ie" || lang === "en-au" || lang === "en-nz") {
      score += 25;
    } else {
      score += 15;
    }

    // 2. Specific preferred UK female voice matches
    const ukIdx = FEMALE_UK_VOICE_PATTERNS.findIndex((p) => name.includes(p));
    if (ukIdx !== -1) {
      score += 60 - ukIdx * 2;
    }

    // 3. Secondary natural female voices
    const secIdx = SECONDARY_FEMALE_EN_PATTERNS.findIndex((p) => name.includes(p));
    if (secIdx !== -1) {
      score += 35 - secIdx * 2;
    }

    // 4. Natural / Neural engine bonus
    if (name.includes("natural") || name.includes("online") || name.includes("neural") || name.includes("premium")) {
      score += 20;
    }

    if (score > bestScore) {
      bestScore = score;
      bestVoice = voice;
    }
  }

  // Safe fallback
  if (!bestVoice) {
    bestVoice =
      voices.find((v) => v.lang?.toLowerCase().replace("_", "-") === "en-gb") ||
      voices.find((v) => v.lang?.toLowerCase().startsWith("en")) ||
      voices[0] ||
      null;
  }

  return bestVoice;
}

// Pre-warm voices
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getFemaleEnglishVoice();
  };
}

/**
 * Clean markdown, legal citations, and transliterate Arabic script
 * to guarantee smooth acoustic enunciation without high-pitched glitches.
 */
export function cleanTextForSpeech(rawText: string): string {
  if (!rawText) return "";

  let text = rawText;

  // 1. Strip raw Unicode Arabic characters (prevents TTS engines from squeaking on non-Latin script)
  // Replace Arabic text with a clean spoken placeholder or strip if transliteration is adjacent
  text = text.replace(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]+/g, " ");

  // 2. Clean markdown and formatting noise
  text = text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/https?:\/\/\S+/g, "")
    .replace(/^[\s*•\-–—]+\s*/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

  // 3. Expand Statutory, Case Law, and Sharia Terms into clear spoken English
  text = text
    // Kenyan Statutes & Constitutional abbreviations
    .replace(/\bCOK\s*2010\b/gi, "Constitution of Kenya 2010")
    .replace(/\bCOK\b/g, "Constitution of Kenya")
    .replace(/\beKLR\b/gi, "Kenya Law Reports")
    .replace(/\bKLR\b/g, "Kenya Law Reports")
    .replace(/\bCap\.?\s*(\d+)/gi, "Chapter $1")
    .replace(/\bSec\.?\s*(\d+)/gi, "Section $1")
    .replace(/\bSection\s*(\d+)\s*\(([a-z0-9]+)\)/gi, "Section $1, subsection $2")
    .replace(/\bArt\.?\s*(\d+)/gi, "Article $1")
    .replace(/\bArticle\s*(\d+)\s*\(([a-z0-9]+)\)/gi, "Article $1, clause $2")
    .replace(/\bSubsec\.?\s*(\d+)/gi, "Subsection $1")
    .replace(/\bPara\.?\s*(\d+)/gi, "Paragraph $1")
    .replace(/\bNo\.?\s*(\d+)/gi, "Number $1")
    .replace(/\bv\.?\s+/gi, " versus ")
    .replace(/\bv\.\b/gi, " versus ")
    .replace(/\bLL\.?B\b/gi, "Bachelor of Laws")
    .replace(/\bIRAC\b/g, "I-R-A-C")
    .replace(/\bCLE\b/g, "Council of Legal Education")
    // Sharia and Islamic Jurisprudence enunciation aids
    .replace(/\bUsul\s+al-Fiqh\b/gi, "Usul al Fiqh")
    .replace(/\bMajallah\b/gi, "The Majallah")
    .replace(/\bHadith\b/gi, "Hadith")
    .replace(/\bSunnah\b/gi, "Sunnah")
    .replace(/\bFiqh\b/gi, "Fiqh")
    .replace(/\bQadi\b/gi, "Kadhee")
    .replace(/\bKadhi\b/gi, "Kadhee")
    .replace(/\bKadhis\b/gi, "Kadhees")
    .replace(/\bNikah\b/gi, "Nikah")
    .replace(/\bTalaq\b/gi, "Talaq")
    .replace(/\bKhul'?\b/gi, "Khula")
    .replace(/\bMahr\b/gi, "Mahr")
    .replace(/\bWaqf\b/gi, "Wakf")
    .replace(/\bIjtihad\b/gi, "Ijtihad")
    .replace(/\bQiyas\b/gi, "Qiyas")
    .replace(/\bIjma\b/gi, "Ijma")
    .replace(/\bSurah\b/gi, "Surah")
    .replace(/\bAyah\b/gi, "Ayah")
    .replace(/\bQur'?an\b/gi, "Quran")
    // Punctuation and spacing cleanup
    .replace(/\s*([;:])\s*/g, "$1 ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();

  return text;
}

export interface SpeechOptions {
  rate?: number;
  pitch?: number;
  voiceURI?: string;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

/**
 * Speaks the provided legal text using a high-quality woman's voice with a clear English accent
 * calibrated to a warm, calm, non-high-pitched tone.
 */
export function speakWithEnglishFemaleVoice(
  rawText: string,
  options?: SpeechOptions
): SpeechSynthesisUtterance | null {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    console.warn("Speech synthesis is not supported in this browser.");
    options?.onError?.(new Error("Speech synthesis unsupported"));
    return null;
  }

  // Cancel any prior speech to prevent audio overlapping
  window.speechSynthesis.cancel();

  const cleanedText = cleanTextForSpeech(rawText);
  if (!cleanedText) return null;

  const utterance = new SpeechSynthesisUtterance(cleanedText);
  const userSettings = getStoredSpeechSettings();

  // Pick voice
  const femaleVoice = getFemaleEnglishVoice(options?.voiceURI || userSettings.selectedVoiceURI);
  if (femaleVoice) {
    utterance.voice = femaleVoice;
    utterance.lang = femaleVoice.lang || "en-GB";
  } else {
    utterance.lang = "en-GB";
  }

  // Set acoustic properties:
  // Default pitch 0.90 gives a deep, warm, professional English narration (eliminating any high pitch / squeakiness)
  utterance.pitch = options?.pitch ?? userSettings.pitch; 
  utterance.rate = options?.rate ?? userSettings.rate;
  utterance.volume = 1.0;

  utterance.onend = () => {
    options?.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn("Speech synthesis notice:", e);
    options?.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeech(): void {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}
