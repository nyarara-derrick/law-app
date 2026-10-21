import React, { useState, useEffect } from "react";
import {
  Scale,
  Wifi,
  WifiOff,
  BookmarkCheck,
  BookOpen,
  FileText,
  Database,
  Menu,
  Sparkles,
  Smartphone,
  ShieldCheck,
  Download,
  Camera,
  Mic,
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenPermissions?: () => void;
  onOpenInstallModal?: () => void;
  onOpenOnboarding?: () => void;
}

export const Header = ({
  activeTab,
  onSelectTab,
  onOpenPermissions,
  onOpenInstallModal,
  onOpenOnboarding,
}: HeaderProps) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const getModeTitle = () => {
    switch (activeTab) {
      case "irac":
        return "IRAC EXAM SOLVER";
      case "vault":
        return "CASE LAW VAULT";
      case "synthesizer":
        return "NOTE SYNTHESIZER";
      case "statutes":
        return "SHARIA & KENYAN STATUTES";
      case "offline":
        return "OFFLINE LEGAL VAULT";
      default:
        return "LEGAL INTELLIGENCE";
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Mobile Branding & Desktop Mode Title */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-sm">
            <Scale className="w-4 h-4" />
          </div>
          <span className="font-bold text-slate-900 tracking-tight text-base">LexiMind</span>
        </div>

        <div className="hidden sm:block">
          <h2 className="text-slate-500 text-xs sm:text-sm font-medium italic">
            System Mode:{" "}
            <span className="text-indigo-600 font-bold not-italic tracking-wide">
              {getModeTitle()}
            </span>
          </h2>
        </div>
      </div>

      {/* Status Badges & Native Hardware / Permissions Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Startup & Curriculum Setup Trigger */}
        {onOpenOnboarding && (
          <button
            onClick={onOpenOnboarding}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
            title="Configure study level, focus units & hardware permissions"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden md:inline">Curriculum Setup</span>
            <span className="md:hidden">Setup</span>
          </button>
        )}

        {/* Device Permissions Trigger */}
        {onOpenPermissions && (
          <button
            onClick={onOpenPermissions}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors"
            title="Manage Phone Hardware & Storage Permissions"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Phone Permissions</span>
            <span className="sm:hidden">Sensors</span>
          </button>
        )}

        {/* Install Native App Trigger */}
        {onOpenInstallModal && (
          <button
            onClick={onOpenInstallModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors"
            title="Install as Native App on Android or Apple iOS"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Install Native App</span>
            <span className="sm:hidden">Install</span>
          </button>
        )}

        {/* Offline Sync Badge */}
        <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-600">
          <div
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span className="font-mono text-[11px] hidden md:inline">
            {isOnline ? "OFFLINE SYNC: READY" : "OFFLINE MODE"}
          </span>
        </div>
      </div>
    </header>
  );
};
