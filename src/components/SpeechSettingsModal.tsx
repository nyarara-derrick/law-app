import React, { useState, useEffect } from "react";
import {
  Volume2,
  X,
  Sliders,
  Check,
  RotateCcw,
  Sparkles,
  Play,
  Square,
} from "lucide-react";
import {
  getStoredSpeechSettings,
  saveSpeechSettings,
  getAvailableFemaleEnglishVoices,
  getFemaleEnglishVoice,
  speakWithEnglishFemaleVoice,
  stopSpeech,
  SpeechSettings,
} from "../utils/speechSynthesis";

interface SpeechSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsChanged?: (settings: SpeechSettings) => void;
}

export const SpeechSettingsModal: React.FC<SpeechSettingsModalProps> = ({
  isOpen,
  onClose,
  onSettingsChanged,
}) => {
  const [settings, setSettings] = useState<SpeechSettings>(getStoredSpeechSettings());
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingSample, setIsPlayingSample] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(getStoredSpeechSettings());
      const loadVoices = () => {
        const detected = getAvailableFemaleEnglishVoices();
        setAvailableVoices(detected);
      };
      loadVoices();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    return () => {
      stopSpeech();
      setIsPlayingSample(false);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePitchChange = (pitch: number) => {
    const updated = saveSpeechSettings({ pitch });
    setSettings(updated);
    onSettingsChanged?.(updated);
  };

  const handleRateChange = (rate: number) => {
    const updated = saveSpeechSettings({ rate });
    setSettings(updated);
    onSettingsChanged?.(updated);
  };

  const handleVoiceSelect = (voiceURI: string) => {
    const updated = saveSpeechSettings({ selectedVoiceURI: voiceURI });
    setSettings(updated);
    onSettingsChanged?.(updated);
  };

  const handleResetDefaults = () => {
    const defaults: SpeechSettings = {
      pitch: 0.90, // Calibrated warm, deep, authoritative female tone
      rate: 0.92,
      selectedVoiceURI: undefined,
    };
    saveSpeechSettings(defaults);
    setSettings(defaults);
    onSettingsChanged?.(defaults);
  };

  const handlePlaySample = () => {
    if (isPlayingSample) {
      stopSpeech();
      setIsPlayingSample(false);
      return;
    }

    setIsPlayingSample(true);
    const sampleText =
      "Constitution of Kenya, Article 1: All sovereign power belongs to the people of Kenya, and shall be exercised in accordance with this Constitution.";

    speakWithEnglishFemaleVoice(sampleText, {
      pitch: settings.pitch,
      rate: settings.rate,
      voiceURI: settings.selectedVoiceURI,
      onEnd: () => setIsPlayingSample(false),
      onError: () => setIsPlayingSample(false),
    });
  };

  const currentVoice = getFemaleEnglishVoice(settings.selectedVoiceURI);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-700 flex items-center justify-center border border-indigo-200/60 shadow-xs">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                Voice & Acoustic Calibration
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Natural English Female Narrator (Oxford / BBC tone)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Active Voice Info */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                Selected Voice Engine
              </span>
              <p className="text-sm font-semibold text-slate-800 truncate">
                {currentVoice?.name || "British / Commonwealth English (Female)"}
              </p>
              <span className="text-[11px] text-slate-500 font-mono">
                {currentVoice?.lang || "en-GB"} • Clear English Accent
              </span>
            </div>
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[11px] font-semibold shrink-0">
              Active
            </span>
          </div>

          {/* Pitch Control (Warmth & Pitch depth) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-600" />
                Vocal Pitch (Tone Warmth)
              </label>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                {settings.pitch <= 0.85
                  ? "Deep Warm (0.85)"
                  : settings.pitch <= 0.92
                  ? "Calm Academic (0.90)"
                  : settings.pitch <= 0.98
                  ? "Balanced (0.95)"
                  : "Standard (1.00)"}
              </span>
            </div>

            <input
              type="range"
              min="0.75"
              max="1.05"
              step="0.05"
              value={settings.pitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Deep & Warm (0.75)</span>
              <span className="font-semibold text-indigo-700">Default Calm (0.90)</span>
              <span>Bright Standard (1.05)</span>
            </div>
          </div>

          {/* Reading Speed / Cadence */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Reading Pace (Cadence)
              </label>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {settings.rate}x
              </span>
            </div>

            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={settings.rate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0.75x (Deliberate)</span>
              <span className="font-semibold text-slate-600">0.92x (Academic)</span>
              <span>1.25x (Fast)</span>
            </div>
          </div>

          {/* Voice Selector if multiple female voices available */}
          {availableVoices.length > 1 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Available Female Voices
              </label>
              <div className="max-h-32 overflow-y-auto space-y-1 pr-1">
                {availableVoices.map((v) => {
                  const isSelected =
                    settings.selectedVoiceURI === v.voiceURI ||
                    (!settings.selectedVoiceURI && currentVoice?.voiceURI === v.voiceURI);
                  return (
                    <button
                      key={v.voiceURI}
                      onClick={() => handleVoiceSelect(v.voiceURI)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium border flex items-center justify-between transition-colors ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-300 text-indigo-900 font-semibold"
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="truncate pr-2">
                        {v.name} ({v.lang})
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Test Voice Sample Button */}
          <div className="pt-2 flex items-center gap-2.5">
            <button
              onClick={handlePlaySample}
              className={`flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border transition-all ${
                isPlayingSample
                  ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 shadow-xs"
              }`}
            >
              {isPlayingSample ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>Stop Sample</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Test Voice Tone & Pitch</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetDefaults}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="Reset to recommended natural presets (Pitch 0.90, Speed 0.92)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Settings saved automatically to device</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
