import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  X,
  RefreshCw,
  Check,
  RotateCcw,
  AlertCircle,
  ShieldAlert,
  Sparkles,
  Maximize2,
} from "lucide-react";
import { requestCameraPermission } from "../utils/devicePermissions";

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (imageDataUrl: string) => void;
  title?: string;
  subtitle?: string;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  title = "Scan Past Paper or Exam Question",
  subtitle = "Align the exam paper or textbook page within the frame",
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [isInitializing, setIsInitializing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize camera stream
  const startCamera = async (facing: "environment" | "user") => {
    setIsInitializing(true);
    setPermissionError(null);

    // Stop existing stream if any
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        videoRef.current.play().catch((e) => console.warn("Video play interrupted:", e));
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
        setPermissionError(
          "Camera permission was denied. Please allow camera access in your phone/browser settings to scan past papers."
        );
      } else {
        setPermissionError(err.message || "Failed to initialize phone camera.");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    if (isOpen && !capturedImage) {
      startCamera(facingMode);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCapturedImage(null);
    setPermissionError(null);
    onClose();
  };

  const toggleFacingMode = () => {
    const newMode = facingMode === "environment" ? "user" : "environment";
    setFacingMode(newMode);
    startCamera(newMode);
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);

    // Stop stream while reviewing
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera(facingMode);
  };

  const handleConfirm = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between items-center p-4 sm:p-6 animate-fadeIn select-none">
      {/* Header */}
      <div className="w-full max-w-lg flex items-center justify-between text-white pb-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/30">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-white">{title}</h3>
            <p className="text-[11px] text-slate-400">{subtitle}</p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Viewfinder / Review Container */}
      <div className="relative w-full max-w-lg flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl my-2">
        {permissionError ? (
          <div className="p-6 text-center space-y-4 max-w-xs">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Camera Permission Required</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{permissionError}</p>
            <button
              onClick={() => startCamera(facingMode)}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
            >
              Grant Camera Permission
            </button>
          </div>
        ) : capturedImage ? (
          /* Snapshot Preview */
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <img
              src={capturedImage}
              alt="Captured exam document"
              className="max-h-full max-w-full object-contain rounded-xl"
            />
            <div className="absolute top-3 left-3 bg-emerald-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
              <Check className="w-3.5 h-3.5" /> Photo Captured
            </div>
          </div>
        ) : (
          /* Live Video Stream Viewfinder */
          <div className="relative w-full h-full flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />

            {/* Document Alignment Frame Box */}
            <div className="absolute inset-6 border-2 border-indigo-400/80 rounded-xl pointer-events-none flex flex-col justify-between p-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-mono font-bold bg-black/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-400/30 backdrop-blur-xs">
                  EXAM / STATUTE SCANNER
                </span>
                <span className="w-4 h-4 border-t-2 border-r-2 border-indigo-400" />
              </div>
              <div className="text-center">
                <span className="text-[11px] font-medium text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                  Hold document flat & well-lit
                </span>
              </div>
              <div className="flex justify-between items-end">
                <span className="w-4 h-4 border-b-2 border-l-2 border-indigo-400" />
                <span className="w-4 h-4 border-b-2 border-r-2 border-indigo-400" />
              </div>
            </div>

            {isInitializing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center gap-2 text-white text-xs">
                <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <span>Initializing camera...</span>
              </div>
            )}
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls Bar */}
      <div className="w-full max-w-lg pt-3 pb-2 flex items-center justify-around">
        {capturedImage ? (
          <div className="flex items-center gap-4 w-full">
            <button
              onClick={handleRetake}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Photo</span>
            </button>

            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>Use & Analyze</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full px-6">
            {/* Flip Camera */}
            <button
              onClick={toggleFacingMode}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Switch camera (Front / Rear)"
            >
              <RefreshCw className="w-5 h-5" />
            </button>

            {/* Shutter Button */}
            <button
              onClick={takeSnapshot}
              disabled={isInitializing || !!permissionError}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <Camera className="w-6 h-6 text-indigo-700" />
              </div>
            </button>

            {/* Cancel / Close */}
            <button
              onClick={handleClose}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors text-xs font-semibold"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
