import React, { useState, useEffect } from "react";
import {
  Scale,
  Camera,
  Mic,
  HardDrive,
  Bell,
  CheckCircle2,
  Sparkles,
  Smartphone,
  BookOpen,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  Award,
  BookMarked,
  Check,
  WifiOff,
  X,
} from "lucide-react";
import {
  checkDevicePermissions,
  requestCameraPermission,
  requestMicrophonePermission,
  requestPersistentPhoneStorage,
  requestNotificationPermission,
  PermissionStatusMap,
  getPhoneStorageEstimate,
} from "../utils/devicePermissions";
import {
  LearnerProfile,
  getLearnerProfile,
  completeOnboarding,
} from "../utils/learnerProfile";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (profile: LearnerProfile) => void;
  isInitialLaunch?: boolean;
}

const ACADEMIC_LEVELS = [
  { id: "llb-1", label: "LL.B Year 1", desc: "Legal Systems, Law of Contract & Torts" },
  { id: "llb-2", label: "LL.B Year 2", desc: "Criminal Law, Islamic Law (Fiqh) & Constitution" },
  { id: "llb-3", label: "LL.B Year 3", desc: "Commercial Law, Land Law & Evidence" },
  { id: "llb-4", label: "LL.B Year 4", desc: "Jurisprudence, Human Rights & Succession" },
  { id: "ksl", label: "Kenya School of Law (ATP)", desc: "Bar Exams, Civil & Criminal Litigation" },
  { id: "scholar", label: "Legal Researcher / Scholar", desc: "Comparative Law & Sharia Research" },
];

const CURRICULUM_SUBJECTS = [
  "Law of Contract",
  "Islamic Family Law & Succession (Mirath)",
  "Constitutional Law of Kenya",
  "Criminal Law & Procedure",
  "Law of Torts",
  "Land Law & Conveyancing",
  "Commercial Law & Sale of Goods",
  "Kadhis' Courts Act & Jurisdiction",
  "Law of Evidence",
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  isInitialLaunch = true,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [profile, setProfile] = useState<LearnerProfile>(getLearnerProfile());

  // Hardware Permissions State
  const [permissions, setPermissions] = useState<PermissionStatusMap>({
    camera: "prompt",
    microphone: "prompt",
    storage: "prompt",
    notifications: "prompt",
  });
  const [storagePersisted, setStoragePersisted] = useState(false);
  const [hardwareToast, setHardwareToast] = useState<string | null>(null);
  const [isProcessingAllPerms, setIsProcessingAllPerms] = useState(false);

  useEffect(() => {
    if (isOpen) {
      checkDevicePermissions().then(setPermissions);
      getPhoneStorageEstimate().then((info) => setStoragePersisted(info.isPersistent));
      setProfile(getLearnerProfile());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGrantCamera = async () => {
    setHardwareToast("Requesting Camera access...");
    const { granted, stream, error } = await requestCameraPermission();
    if (granted && stream) {
      stream.getTracks().forEach((t) => t.stop());
      setHardwareToast("✅ Camera access granted for live paper scanning!");
    } else {
      setHardwareToast(`❌ Camera error: ${error || "Access denied"}`);
    }
    const updated = await checkDevicePermissions();
    setPermissions(updated);
  };

  const handleGrantMic = async () => {
    setHardwareToast("Requesting Microphone access...");
    const { granted, stream, error } = await requestMicrophonePermission();
    if (granted && stream) {
      stream.getTracks().forEach((t) => t.stop());
      setHardwareToast("✅ Microphone granted for voice dictation!");
    } else {
      setHardwareToast(`❌ Microphone error: ${error || "Access denied"}`);
    }
    const updated = await checkDevicePermissions();
    setPermissions(updated);
  };

  const handleGrantStorage = async () => {
    setHardwareToast("Locking phone storage cache...");
    const persisted = await requestPersistentPhoneStorage();
    setStoragePersisted(persisted);
    if (persisted) {
      setHardwareToast("✅ Phone storage locked against OS auto-cleanup!");
    } else {
      setHardwareToast("ℹ️ Storage standard active.");
    }
    const updated = await checkDevicePermissions();
    setPermissions(updated);
  };

  const handleGrantNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setHardwareToast("✅ Exam & revision alerts enabled!");
    } else {
      setHardwareToast("ℹ️ Notifications declined.");
    }
    const updated = await checkDevicePermissions();
    setPermissions(updated);
  };

  const handleGrantAllHardware = async () => {
    setIsProcessingAllPerms(true);
    setHardwareToast("Configuring all native phone sensors...");

    await requestPersistentPhoneStorage();
    await requestCameraPermission().then(({ stream }) => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    });
    await requestMicrophonePermission().then(({ stream }) => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    });
    await requestNotificationPermission();

    const updated = await checkDevicePermissions();
    setPermissions(updated);
    const stor = await getPhoneStorageEstimate();
    setStoragePersisted(stor.isPersistent);
    setIsProcessingAllPerms(false);
    setHardwareToast("✅ Device hardware sensors configured!");
  };

  const toggleSubject = (subj: string) => {
    setProfile((prev) => {
      const exists = prev.focusSubjects.includes(subj);
      if (exists) {
        if (prev.focusSubjects.length <= 1) return prev; // keep at least 1
        return { ...prev, focusSubjects: prev.focusSubjects.filter((s) => s !== subj) };
      } else {
        return { ...prev, focusSubjects: [...prev.focusSubjects, subj] };
      }
    });
  };

  const handleFinishOnboarding = () => {
    const finalProfile = completeOnboarding(profile);
    onComplete(finalProfile);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden my-auto">
        {/* Top Progress Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 relative">
          {!isInitialLaunch && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Step {currentStep} of 4
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  100% Offline
                </span>
              </div>
              <h2 className="font-serif font-bold text-lg sm:text-xl text-white mt-1">
                {currentStep === 1 && "Welcome to LexiMind Engine"}
                {currentStep === 2 && "Device Hardware & Sensor Setup"}
                {currentStep === 3 && "Curriculum & Study Focus"}
                {currentStep === 4 && "Workspace Ready to Launch"}
              </h2>
            </div>
          </div>

          {/* Step Progress Indicators */}
          <div className="grid grid-cols-4 gap-2 mt-5">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentStep >= step ? "bg-indigo-500" : "bg-slate-800"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 max-h-[68vh] overflow-y-auto space-y-6">
          {/* STEP 1: Welcome & Mission */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="bg-indigo-50/70 border border-indigo-100 p-4 sm:p-5 rounded-2xl space-y-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-indigo-950 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Kenyan Law & Islamic Jurisprudence Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  LexiMind Engine is designed for law learners across Kenya, integrating the full
                  curriculum of statutory laws, landmark common law precedents, and Islamic
                  Jurisprudence (Fiqh & Mirath) in an offline-first architecture.
                </p>
              </div>

              {/* 3 Core Capability Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="p-2 w-fit rounded-xl bg-indigo-100 text-indigo-700">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">IRAC Exam Solver</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Solve past papers with structured Issue, Rule, Application & Conclusion rubrics.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="p-2 w-fit rounded-xl bg-emerald-100 text-emerald-700">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Landmark Precedents</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Instant access to Kenyan & Islamic case briefs, ratio decidendi, and facts.
                  </p>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <div className="p-2 w-fit rounded-xl bg-amber-100 text-amber-700">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">Zero Internet Needed</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    All statutes, case notes, and drafted solutions are cached locally on your device.
                  </p>
                </div>
              </div>

              {/* Welcome Tips */}
              <div className="text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  No account registration or cloud subscription required. Everything runs locally on your phone or laptop.
                </span>
              </div>
            </div>
          )}

          {/* STEP 2: Device Hardware & Sensors */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fadeIn">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Enable Hardware Sensor Capabilities
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Grant native browser & device permissions for optical scanning, voice dictation, and storage locks.
                </p>
              </div>

              {hardwareToast && (
                <div className="p-3 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between animate-fadeIn">
                  <span>{hardwareToast}</span>
                  <button
                    onClick={() => setHardwareToast(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Sensor Permission List */}
              <div className="space-y-2.5">
                {/* 1. Camera */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <span>Live Camera Scanner</span>
                        {permissions.camera === "granted" && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Granted
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Scan past exam papers, lecture handouts & statute pages
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleGrantCamera}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    {permissions.camera === "granted" ? "Test Camera" : "Grant Access"}
                  </button>
                </div>

                {/* 2. Microphone */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <span>Voice Dictation & Oral Recording</span>
                        {permissions.microphone === "granted" && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Granted
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Dictate problem question hypotheticals & lecture notes
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleGrantMic}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    {permissions.microphone === "granted" ? "Test Mic" : "Grant Access"}
                  </button>
                </div>

                {/* 3. Persistent Storage */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                      <HardDrive className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <span>Phone Storage Persistence</span>
                        {storagePersisted && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Locked & Safe
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Prevents iOS and Android from clearing saved revision notes
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleGrantStorage}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    {storagePersisted ? "Locked" : "Lock Storage"}
                  </button>
                </div>

                {/* 4. Notifications */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                        <span>Study Alerts & Milestone Reminders</span>
                        {permissions.notifications === "granted" && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                            Enabled
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Exam countdowns and active recall notifications
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleGrantNotifications}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
                  >
                    {permissions.notifications === "granted" ? "Enabled" : "Request"}
                  </button>
                </div>
              </div>

              {/* Master 1-Tap Hardware Setup Button */}
              <button
                onClick={handleGrantAllHardware}
                disabled={isProcessingAllPerms}
                className="w-full py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs sm:text-sm border border-indigo-200 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Grant All Hardware Permissions (1-Tap)</span>
              </button>
            </div>
          )}

          {/* STEP 3: Curriculum & Study Profile */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fadeIn">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-slate-900">
                  Select Your Academic Level & Study Focus
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tailor the IRAC problem solver and case vault to your year of study.
                </p>
              </div>

              {/* Academic Level Cards */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Current Academic Level:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ACADEMIC_LEVELS.map((lvl) => {
                    const isSelected = profile.academicLevel === lvl.label;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, academicLevel: lvl.label })}
                        className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                          isSelected
                            ? "bg-indigo-50/80 border-indigo-400 text-indigo-950 ring-2 ring-indigo-500/20"
                            : "bg-white border-slate-200 text-slate-800 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-bold text-xs sm:text-sm">{lvl.label}</span>
                          {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{lvl.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Target Subjects Multi-Select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Select Your Focus Units (Tap to toggle):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CURRICULUM_SUBJECTS.map((subj) => {
                    const isSelected = profile.focusSubjects.includes(subj);
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => toggleSubject(subj)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{subj}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Preferred Initial Module */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Preferred Default Workspace:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "irac", label: "IRAC Solver", icon: Scale },
                    { id: "vault", label: "Law Notes Vault", icon: BookOpen },
                    { id: "statutes", label: "Statute Hub", icon: BookMarked },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = profile.preferredMode === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, preferredMode: tab.id as any })}
                        className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1 ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-400 text-indigo-700 shadow-2xs"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Launch */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fadeIn">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white space-y-3">
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Setup Ready for Legal Study
                </div>
                <h3 className="font-serif font-bold text-lg sm:text-xl">
                  Your LexiMind Study Environment is Initialized
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Your workspace is primed with Kenyan statutes, Umma past papers, landmark case briefs,
                  and Islamic jurisprudence modules.
                </p>
              </div>

              {/* Configuration Summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Academic Focus:</span>
                  <span className="font-bold text-slate-900">{profile.academicLevel}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Focus Units:</span>
                  <span className="font-bold text-slate-900">{profile.focusSubjects.length} Units Active</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Offline Persistence:</span>
                  <span className="font-bold text-emerald-600">
                    {storagePersisted ? "Locked & Active" : "Active Local Cache"}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Default Workspace:</span>
                  <span className="font-bold text-indigo-600 uppercase">
                    {profile.preferredMode === "irac" && "IRAC Exam Solver"}
                    {profile.preferredMode === "vault" && "Law Notes & Case Vault"}
                    {profile.preferredMode === "statutes" && "Statutes & Sharia Compendium"}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>
                  Tip: You can change these settings, re-test hardware sensors, or export backups anytime from the navigation bar.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs sm:text-sm font-semibold transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinishOnboarding}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold transition-all shadow-lg active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Workspace</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
