import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Camera,
  Mic,
  HardDrive,
  Bell,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Smartphone,
  Layers,
  Lock,
  Download,
  Info,
  Check,
} from "lucide-react";
import {
  checkDevicePermissions,
  requestCameraPermission,
  requestMicrophonePermission,
  requestPersistentPhoneStorage,
  getPhoneStorageEstimate,
  requestNotificationPermission,
  PermissionStatusMap,
  StorageEstimateInfo,
} from "../utils/devicePermissions";

interface DevicePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPermissionUpdated?: () => void;
}

export const DevicePermissionsModal: React.FC<DevicePermissionsModalProps> = ({
  isOpen,
  onClose,
  onPermissionUpdated,
}) => {
  const [permissions, setPermissions] = useState<PermissionStatusMap>({
    camera: "prompt",
    microphone: "prompt",
    storage: "prompt",
    notifications: "prompt",
  });
  const [storageInfo, setStorageInfo] = useState<StorageEstimateInfo>({
    usageMB: 0,
    quotaMB: 1024,
    usagePercent: 0,
    isPersistent: false,
  });
  const [activeTestMessage, setActiveTestMessage] = useState<string | null>(null);
  const [isRequestingAll, setIsRequestingAll] = useState(false);

  const refreshStatus = async () => {
    const perms = await checkDevicePermissions();
    setPermissions(perms);
    const stor = await getPhoneStorageEstimate();
    setStorageInfo(stor);
    if (onPermissionUpdated) onPermissionUpdated();
  };

  useEffect(() => {
    if (isOpen) {
      refreshStatus();
    }
  }, [isOpen]);

  const handleRequestCamera = async () => {
    setActiveTestMessage("Requesting Camera access...");
    const { granted, stream, error } = await requestCameraPermission();
    if (granted && stream) {
      stream.getTracks().forEach((t) => t.stop());
      setActiveTestMessage("✅ Camera permission granted!");
    } else {
      setActiveTestMessage(`❌ Camera error: ${error}`);
    }
    refreshStatus();
  };

  const handleRequestMic = async () => {
    setActiveTestMessage("Requesting Microphone access...");
    const { granted, stream, error } = await requestMicrophonePermission();
    if (granted && stream) {
      stream.getTracks().forEach((t) => t.stop());
      setActiveTestMessage("✅ Microphone permission granted!");
    } else {
      setActiveTestMessage(`❌ Mic error: ${error}`);
    }
    refreshStatus();
  };

  const handleRequestStorage = async () => {
    setActiveTestMessage("Requesting persistent phone storage lock...");
    const persisted = await requestPersistentPhoneStorage();
    if (persisted) {
      setActiveTestMessage("✅ Phone storage locked against OS auto-cleanup!");
    } else {
      setActiveTestMessage("ℹ️ Standard phone storage active.");
    }
    refreshStatus();
  };

  const handleRequestNotifications = async () => {
    setActiveTestMessage("Requesting notification permissions...");
    const granted = await requestNotificationPermission();
    if (granted) {
      setActiveTestMessage("✅ Notifications granted for exam alerts!");
    } else {
      setActiveTestMessage("❌ Notifications not granted.");
    }
    refreshStatus();
  };

  const handleGrantAll = async () => {
    setIsRequestingAll(true);
    setActiveTestMessage("Requesting native device permissions...");

    await requestPersistentPhoneStorage();
    await requestCameraPermission().then(({ stream }) => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    });
    await requestMicrophonePermission().then(({ stream }) => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    });
    await requestNotificationPermission();

    await refreshStatus();
    setIsRequestingAll(false);
    setActiveTestMessage("✅ Device permissions requested!");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                  Native Phone & Storage Permissions
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  iOS & Android
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage hardware sensors, camera scanning, voice dictation, and offline device storage.
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

        {/* Status Toast Notification */}
        {activeTestMessage && (
          <div className="p-3 rounded-xl bg-slate-900 text-white text-xs font-semibold flex items-center justify-between animate-fadeIn">
            <span>{activeTestMessage}</span>
            <button
              onClick={() => setActiveTestMessage(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Phone Storage Meter Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-xs sm:text-sm text-slate-800">
                Phone Storage & Offline Persistence
              </span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                storageInfo.isPersistent
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-amber-100 text-amber-800 border border-amber-200"
              }`}
            >
              {storageInfo.isPersistent ? "Persistent Locked" : "Standard Storage"}
            </span>
          </div>

          {/* Storage progress bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                style={{ width: `${Math.max(3, Math.min(100, storageInfo.usagePercent))}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Used: {storageInfo.usageMB} MB</span>
              <span>Device Quota: {storageInfo.quotaMB} MB</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed">
            All your IRAC answers, case briefs, note syntheses, and compendium bookmarks are stored
            directly in your phone’s memory and remain intact with zero cellular data needed.
          </p>
        </div>

        {/* Permission Rows */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Hardware Sensor Permissions
          </h4>

          {/* 1. Camera */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  Camera Access
                </div>
                <div className="text-[11px] text-slate-500">
                  Scan past exam papers & statute pages via live viewfinder
                </div>
              </div>
            </div>

            <button
              onClick={handleRequestCamera}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Request / Test
            </button>
          </div>

          {/* 2. Microphone */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  Microphone Access
                </div>
                <div className="text-[11px] text-slate-500">
                  Voice dictation for problem questions & lecture recording
                </div>
              </div>
            </div>

            <button
              onClick={handleRequestMic}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Request / Test
            </button>
          </div>

          {/* 3. Persistent Phone Storage */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  Phone Storage Persistence
                </div>
                <div className="text-[11px] text-slate-500">
                  Prevents iOS/Android from clearing your saved revision data
                </div>
              </div>
            </div>

            <button
              onClick={handleRequestStorage}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Lock Storage
            </button>
          </div>

          {/* 4. Notifications */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-xs sm:text-sm text-slate-900">
                  Notifications & Exam Alerts
                </div>
                <div className="text-[11px] text-slate-500">
                  Active recall streak reminders & revision milestones
                </div>
              </div>
            </div>

            <button
              onClick={handleRequestNotifications}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Request
            </button>
          </div>
        </div>

        {/* Master Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleGrantAll}
            disabled={isRequestingAll}
            className="flex-1 py-3 px-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Enable All Phone Permissions</span>
          </button>

          <button
            onClick={onClose}
            className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
