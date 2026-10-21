import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";
import { IRACSolverView } from "./components/IRACSolverView";
import { CaseVaultView } from "./components/CaseVaultView";
import { NoteSynthesizerView } from "./components/NoteSynthesizerView";
import { StatuteHubView } from "./components/StatuteHubView";
import { OfflineVaultView } from "./components/OfflineVaultView";
import { DevicePermissionsModal } from "./components/DevicePermissionsModal";
import { NativeAppInstallModal } from "./components/NativeAppInstallModal";
import { OnboardingModal } from "./components/OnboardingModal";
import {
  getStoredIRACSolutions,
  getStoredCaseBriefs,
  getStoredSyntheses,
} from "./utils/storage";
import {
  getLearnerProfile,
  isOnboardingCompleted,
  LearnerProfile,
} from "./utils/learnerProfile";

export default function App() {
  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile>(getLearnerProfile());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => !isOnboardingCompleted());
  const [activeTab, setActiveTab] = useState<string>(() => {
    const prof = getLearnerProfile();
    return prof.preferredMode || "irac";
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [iracPreset, setIracPreset] = useState<{ scenario: string; subject: any } | null>(null);

  // Global Hardware & Installation Modals
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  const updateSavedCount = () => {
    const irac = getStoredIRACSolutions().length;
    const cases = getStoredCaseBriefs().length;
    const notes = getStoredSyntheses().length;
    setSavedCount(irac + cases + notes);
  };

  useEffect(() => {
    updateSavedCount();
  }, [activeTab]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    updateSavedCount();
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleLoadQuestionIntoSolver = (scenario: string, subject: any) => {
    setIracPreset({ scenario, subject });
    setActiveTab("irac");
    triggerToast("Loaded problem question into IRAC Solver!");
  };

  const handleOnboardingComplete = (newProfile: LearnerProfile) => {
    setLearnerProfile(newProfile);
    if (newProfile.preferredMode) {
      setActiveTab(newProfile.preferredMode);
    }
    triggerToast(`Welcome to LexiMind! Ready for ${newProfile.academicLevel} studies.`);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased flex selection:bg-indigo-500 selection:text-white">
      {/* Desktop Sidebar (Professional Polish Theme) */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedCount}
        onOpenPermissions={() => setIsPermissionsModalOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenOnboarding={() => setIsOnboardingOpen(true)}
        learnerProfile={learnerProfile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onOpenPermissions={() => setIsPermissionsModalOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenOnboarding={() => setIsOnboardingOpen(true)}
        />

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 flex items-center gap-2 animate-bounce">
            <span className="text-emerald-400">✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Dynamic Views */}
        <main className="flex-1 w-full overflow-y-auto">
          {activeTab === "irac" && (
            <IRACSolverView
              onSaveNotification={triggerToast}
              initialPreset={iracPreset}
            />
          )}
          {activeTab === "vault" && (
            <CaseVaultView
              onSaveNotification={triggerToast}
              onLoadQuestionIntoSolver={handleLoadQuestionIntoSolver}
            />
          )}
          {activeTab === "synthesizer" && (
            <NoteSynthesizerView onSaveNotification={triggerToast} />
          )}
          {activeTab === "statutes" && (
            <StatuteHubView onSaveNotification={triggerToast} />
          )}
          {activeTab === "offline" && (
            <OfflineVaultView onSaveNotification={triggerToast} />
          )}
        </main>
      </div>

      {/* Mobile Sticky Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        savedCount={savedCount}
      />

      {/* Interactive Onboarding & First-Time Startup Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={handleOnboardingComplete}
        isInitialLaunch={!learnerProfile.onboardingCompleted}
      />

      {/* Global Device Permissions & Native App Modals */}
      <DevicePermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onPermissionUpdated={updateSavedCount}
      />

      <NativeAppInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
}

