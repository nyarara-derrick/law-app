import React from "react";
import { Scale, BookOpen, FileText, BookmarkCheck, Database } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  savedCount?: number;
}

export const BottomNav = ({ activeTab, onSelectTab, savedCount = 0 }: BottomNavProps) => {
  const tabs = [
    {
      id: "irac",
      label: "IRAC",
      icon: Scale,
    },
    {
      id: "vault",
      label: "Law Notes",
      icon: BookOpen,
    },

    {
      id: "synthesizer",
      label: "Synthesizer",
      icon: FileText,
    },
    {
      id: "statutes",
      label: "Statutes",
      icon: BookmarkCheck,
    },
    {
      id: "offline",
      label: "Vault",
      icon: Database,
      badge: savedCount > 0 ? savedCount : undefined,
    },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-safe">
      <div className="max-w-md mx-auto px-2 flex justify-around items-center h-15">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 transition-all ${
                isActive
                  ? "text-indigo-600 font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? "scale-110 text-indigo-600" : ""
                  }`}
                />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-indigo-600 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight">
                {tab.label}
              </span>
              {isActive && (
                <div className="w-3.5 h-0.5 bg-indigo-600 rounded-full mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
