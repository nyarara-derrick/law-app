import React, { useState, useEffect } from "react";
import {
  Smartphone,
  Download,
  Share2,
  PlusSquare,
  CheckCircle2,
  X,
  Apple,
  ShieldCheck,
  Zap,
  HardDrive,
  WifiOff,
} from "lucide-react";

interface NativeAppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NativeAppInstallModal: React.FC<NativeAppInstallModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [platform, setPlatform] = useState<"ios" | "android" | "other">("android");
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect mobile platform
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform("ios");
    } else {
      setPlatform("android");
    }

    // Check if already in standalone native mode
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true);
    }

    // Capture Android PWA install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                Install as Native Phone App
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Run LexiMind Engine natively on your Apple iPhone, iPad, or Android device.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Platform Selector Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setPlatform("android")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              platform === "android"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
            <span>Android Phone</span>
          </button>

          <button
            onClick={() => setPlatform("ios")}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              platform === "ios"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Apple className="w-3.5 h-3.5 text-slate-800" />
            <span>Apple iPhone / iPad</span>
          </button>
        </div>

        {/* Value Proposition Grid */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-center">
          <div className="p-2">
            <WifiOff className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
            <div className="font-bold text-[11px] text-slate-800">100% Offline</div>
            <div className="text-[10px] text-slate-500">Zero data needed</div>
          </div>
          <div className="p-2 border-l border-slate-200">
            <HardDrive className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
            <div className="font-bold text-[11px] text-slate-800">Phone Storage</div>
            <div className="text-[10px] text-slate-500">Fast local access</div>
          </div>
          <div className="p-2 border-l border-slate-200">
            <Zap className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <div className="font-bold text-[11px] text-slate-800">Full Screen</div>
            <div className="text-[10px] text-slate-500">No browser bars</div>
          </div>
        </div>

        {/* Step-by-Step Instructions by Platform */}
        {platform === "android" ? (
          <div className="space-y-3 bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
            <h4 className="font-bold text-xs text-indigo-900 flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-indigo-600" />
              Android Installation (Google Chrome / Samsung Internet)
            </h4>

            {deferredPrompt ? (
              <button
                onClick={handleInstallClick}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Install LexiMind App (1-Tap)</span>
              </button>
            ) : (
              <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside leading-relaxed">
                <li>
                  Tap the <strong>three dots menu (⋮)</strong> at the top right of Chrome.
                </li>
                <li>
                  Select <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.
                </li>
                <li>
                  Confirm <strong>"Install"</strong>. LexiMind will appear on your phone's home
                  screen and app drawer!
                </li>
              </ol>
            )}
          </div>
        ) : (
          <div className="space-y-3 bg-slate-100/70 border border-slate-200 p-4 rounded-2xl">
            <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
              <Apple className="w-4 h-4 text-slate-800" />
              Apple iPhone & iPad Installation (Safari)
            </h4>

            <ol className="text-xs text-slate-700 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                Open this app in <strong>Safari</strong> on your iPhone or iPad.
              </li>
              <li>
                Tap the <strong>Share button</strong> <Share2 className="w-3.5 h-3.5 inline text-blue-600" /> (square with upward arrow) at the bottom toolbar.
              </li>
              <li>
                Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-slate-800" />.
              </li>
              <li>
                Tap <strong>"Add"</strong> in the top right corner. LexiMind is now installed as a native Apple app!
              </li>
            </ol>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-colors"
          >
            Got it, Continue Studying
          </button>
        </div>
      </div>
    </div>
  );
};
