import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Square,
  Play,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  Volume2,
  Sparkles,
} from "lucide-react";
import { requestMicrophonePermission } from "../utils/devicePermissions";

interface VoiceRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady: (transcript: string) => void;
  title?: string;
  subtitle?: string;
}

export const VoiceRecorderModal: React.FC<VoiceRecorderModalProps> = ({
  isOpen,
  onClose,
  onTranscriptReady,
  title = "Voice Dictation & Problem Input",
  subtitle = "Speak your legal problem facts, case law query, or lecture notes",
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [duration, setDuration] = useState(0);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Initialize speech recognition and audio analysis
  const startRecording = async () => {
    setPermissionError(null);
    setTranscript("");
    setInterimText("");
    setDuration(0);

    // 1. Request microphone permission
    const { granted, stream, error } = await requestMicrophonePermission();
    if (!granted || !stream) {
      setPermissionError(error || "Microphone permission is required for voice recording.");
      return;
    }

    mediaStreamRef.current = stream;

    // 2. Audio Level Analyzer for visual waveform
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;

        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateLevel = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const avg = sum / dataArray.length;
          setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
          animFrameRef.current = requestAnimationFrame(updateLevel);
        };
        updateLevel();
      }
    } catch (e) {
      console.warn("Audio analyzer failed to initialize:", e);
    }

    // 3. Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-KE"; // Kenyan English / standard English

        recognition.onresult = (event: any) => {
          let currentFinal = "";
          let currentInterim = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const trans = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentFinal += trans + " ";
            } else {
              currentInterim += trans;
            }
          }

          if (currentFinal) {
            setTranscript((prev) => prev + currentFinal);
          }
          setInterimText(currentInterim);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn("Speech recognition couldn't start:", e);
      }
    }

    setIsRecording(true);

    // Duration timer
    timerRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    setAudioLevel(0);
  };

  useEffect(() => {
    if (isOpen) {
      startRecording();
    } else {
      stopRecording();
    }

    return () => {
      stopRecording();
    };
  }, [isOpen]);

  const handleClose = () => {
    stopRecording();
    setTranscript("");
    setInterimText("");
    onClose();
  };

  const handleApplyTranscript = () => {
    const fullText = (transcript + " " + interimText).trim();
    if (fullText) {
      onTranscriptReady(fullText);
    }
    handleClose();
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">{subtitle}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {permissionError ? (
          <div className="bg-rose-950/60 border border-rose-800 p-4 rounded-xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <h4 className="font-bold text-xs text-rose-200">Microphone Access Needed</h4>
            <p className="text-[11px] text-rose-300/80">{permissionError}</p>
            <button
              onClick={startRecording}
              className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold transition-colors"
            >
              Retry Microphone Permission
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Live Audio Meter & Pulse */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-center space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-center gap-1.5">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isRecording ? "bg-rose-500 animate-ping" : "bg-slate-600"
                  }`}
                />
                <span className="font-mono text-xs font-bold text-slate-300">
                  {isRecording ? "RECORDING & TRANSCRIBING" : "RECORDING PAUSED"}
                </span>
                <span className="font-mono text-xs text-indigo-400 font-bold ml-2">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Dynamic waveform visualizer bars */}
              <div className="flex items-center justify-center gap-1 h-12 py-2">
                {[0.4, 0.7, 1.2, 0.9, 1.5, 0.8, 1.3, 0.6, 1.1, 0.5, 1.4, 0.7].map(
                  (mult, i) => {
                    const barHeight = isRecording
                      ? Math.max(4, Math.min(36, (audioLevel * mult) / 2))
                      : 4;
                    return (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-75 ${
                          isRecording ? "bg-emerald-400" : "bg-slate-700"
                        }`}
                        style={{ height: `${barHeight}px` }}
                      />
                    );
                  }
                )}
              </div>
            </div>

            {/* Transcript Preview Box */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                <span>Real-Time Transcript:</span>
                <span>{(transcript + interimText).split(/\s+/).filter(Boolean).length} words</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 min-h-[100px] max-h-[160px] overflow-y-auto text-xs text-slate-200 leading-relaxed font-sans select-text">
                {transcript || interimText ? (
                  <>
                    <span>{transcript}</span>
                    <span className="text-emerald-400 italic">{interimText}</span>
                  </>
                ) : (
                  <span className="text-slate-500 italic">
                    Start speaking... your words will appear here in real time.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {isRecording ? (
            <button
              onClick={stopRecording}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Square className="w-4 h-4 text-rose-400" />
              <span>Pause / Stop</span>
            </button>
          ) : (
            <button
              onClick={startRecording}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Mic className="w-4 h-4 text-emerald-400" />
              <span>Resume Dictating</span>
            </button>
          )}

          <button
            onClick={handleApplyTranscript}
            disabled={!transcript.trim() && !interimText.trim()}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Solver</span>
          </button>
        </div>
      </div>
    </div>
  );
};
