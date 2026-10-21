import React from "react";
import {
  Scale,
  BookOpen,
  FileText,
  BookmarkCheck,
  Database,
  GraduationCap,
  Wifi,
  WifiOff,
  Smartphone,
  ShieldCheck,
  Download,
  HardDrive,
  Settings,
  Sparkles,
} from "lucide-react";
import { LearnerProfile } from "../utils/learnerProfile";

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedCount: number;
  onOpenPermissions?: () => void;
  onOpenInstallModal?: () => void;
  onOpenOnboarding?: () => void;
  learnerProfile?: LearnerProfile;
}

export const Sidebar = ({
  activeTab,
  onSelectTab,
  savedCount,
  onOpenPermissions,
  onOpenInstallModal,
  onOpenOnboarding,
  learnerProfile,
}: SidebarProps) => {
  const navItems = [
    { id: "irac", label: "IRAC Exam Solver", icon: Scale },
    { id: "vault", label: "Umma Law Notes & Vault", icon: BookOpen },
    { id: "synthesizer", label: "Note Synthesizer", icon: FileText },
    { id: "statutes", label: "Sharia & Kenyan Statutes", icon: BookmarkCheck },
    { id: "offline", label: "Offline Vault", icon: Database, badge: savedCount > 0 ? savedCount : null },
  ];

  const displayName = learnerProfile?.displayName || "Law Scholar";
  const academicLevel = learnerProfile?.academicLevel || "LL.B Candidate";
  const institution = learnerProfile?.institution || "Umma University Faculty of Law";

  return (
    <aside className="hidden lg:flex w-72 bg-[#0F172A] flex-col border-r border-slate-800 text-slate-200 select-none flex-shrink-0">
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/30">
          <Scale className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-tight flex items-center">
            LexiMind
            <span className="ml-1.5 text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80">
              Engine
            </span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Kenyan Legal Intelligence</p>
        </div>
      </div>

      {/* Nav Section */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest px-4 mb-3">
          Main Modules
        </div>
        <div className="space-y-1 mb-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-400 border-l-4 border-indigo-500 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Device & Native App Tools */}
        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest px-4 mb-2">
          Setup & Hardware
        </div>
        <div className="space-y-1 mb-6">
          {onOpenOnboarding && (
            <button
              onClick={onOpenOnboarding}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Startup & Curriculum Setup</span>
            </button>
          )}

          {onOpenPermissions && (
            <button
              onClick={onOpenPermissions}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Phone Permissions</span>
            </button>
          )}

          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/80 hover:text-white transition-colors text-left"
            >
              <Smartphone className="w-4 h-4 text-indigo-400" />
              <span>Install iOS / Android App</span>
            </button>
          )}
        </div>

        {/* Academic Jurisdiction Status */}
        <div className="text-slate-500 text-xs font-bold uppercase tracking-widest px-4 mb-2">
          Jurisdiction
        </div>
        <div className="px-4 space-y-2.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span>Constitution 2010</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span>Islamic Fiqh & Mirath</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          <div className="flex items-center justify-between text-slate-300 text-xs">
            <span>Kadhis' Courts (Cap 11)</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          </div>
        </div>
      </nav>

      {/* Learner Profile & Study Status Card */}
      <div
        onClick={onOpenOnboarding}
        className="p-4 bg-slate-900/90 border-t border-slate-800/90 mt-auto cursor-pointer hover:bg-slate-800/60 transition-colors group"
        title="Click to customize study focus or hardware sensors"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-indigo-700 border border-indigo-400/40 flex items-center justify-center font-bold text-white text-xs shadow-inner">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="text-xs">
              <div className="text-white font-semibold flex items-center gap-1">
                <span>{displayName}</span>
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400 inline" />
              </div>
              <div className="text-slate-400 text-[11px] truncate max-w-[140px]">
                {academicLevel}
              </div>
            </div>
          </div>
          <Settings className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
        </div>

        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div className="bg-indigo-500 h-1.5 rounded-full w-3/4 transition-all duration-500"></div>
        </div>
        <div className="text-[10px] text-slate-400 mt-1.5 flex justify-between font-mono uppercase tracking-wider">
          <span>{institution.split(" ")[0]} Law Prep</span>
          <span className="text-indigo-400 font-bold">Active</span>
        </div>
      </div>
    </aside>
  );
};

