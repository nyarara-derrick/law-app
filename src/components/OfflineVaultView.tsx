import React, { useState, useEffect } from "react";
import {
  Database,
  Search,
  Scale,
  BookOpen,
  FileText,
  Trash2,
  Download,
  Copy,
  CheckCircle2,
  Calendar,
  ExternalLink,
  ChevronRight,
  HardDriveDownload,
  Sparkles,
  Smartphone,
  ShieldCheck,
  HardDrive,
  Lock,
  WifiOff,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { IRACSolution, CaseBrief, NoteSynthesis } from "../types";
import {
  getStoredIRACSolutions,
  getStoredCaseBriefs,
  getStoredSyntheses,
  deleteIRACSolution,
  deleteCaseBrief,
  deleteNoteSynthesis,
} from "../utils/storage";
import {
  getPhoneStorageEstimate,
  requestPersistentPhoneStorage,
  StorageEstimateInfo,
} from "../utils/devicePermissions";
import { DevicePermissionsModal } from "./DevicePermissionsModal";
import { NativeAppInstallModal } from "./NativeAppInstallModal";

export const OfflineVaultView = ({
  onSaveNotification,
}: {
  onSaveNotification: (msg: string) => void;
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "irac" | "cases" | "notes">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [iracList, setIracList] = useState<IRACSolution[]>([]);
  const [caseList, setCaseList] = useState<CaseBrief[]>([]);
  const [noteList, setNoteList] = useState<NoteSynthesis[]>([]);

  // Storage and Native Modals
  const [storageInfo, setStorageInfo] = useState<StorageEstimateInfo>({
    usageMB: 0,
    quotaMB: 1024,
    usagePercent: 0,
    isPersistent: false,
  });
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Selected item modal / detail view
  const [selectedItem, setSelectedItem] = useState<{
    type: "irac" | "case" | "note";
    data: IRACSolution | CaseBrief | NoteSynthesis;
  } | null>(null);

  const [copied, setCopied] = useState(false);

  const refreshVault = async () => {
    setIracList(getStoredIRACSolutions());
    setCaseList(getStoredCaseBriefs());
    setNoteList(getStoredSyntheses());
    const stor = await getPhoneStorageEstimate();
    setStorageInfo(stor);
  };

  useEffect(() => {
    refreshVault();
  }, []);

  const handleLockStorage = async () => {
    const persisted = await requestPersistentPhoneStorage();
    if (persisted) {
      onSaveNotification("Phone storage locked against OS eviction!");
    } else {
      onSaveNotification("Standard device storage active.");
    }
    refreshVault();
  };

  const handleDeleteIRAC = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteIRACSolution(id);
    refreshVault();
    if (selectedItem?.data.id === id) setSelectedItem(null);
    onSaveNotification("Removed from offline storage");
  };

  const handleDeleteCase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCaseBrief(id);
    refreshVault();
    if (selectedItem?.data.id === id) setSelectedItem(null);
    onSaveNotification("Removed from offline storage");
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNoteSynthesis(id);
    refreshVault();
    if (selectedItem?.data.id === id) setSelectedItem(null);
    onSaveNotification("Removed from offline storage");
  };

  const handleExportAll = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      student: "Umma Law Scholar (LL.B Candidate)",
      iracSolutions: iracList,
      caseBriefs: caseList,
      noteSyntheses: noteList,
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `LexiMind_Vault_Backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onSaveNotification("Exported full offline vault!");
  };

  const totalSaved = iracList.length + caseList.length + noteList.length;

  return (
    <div className="pb-24 pt-6 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Phone Storage & Offline Cache
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              100% Offline Capable
            </span>
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Offline Legal Knowledge Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {totalSaved} saved items stored directly on your phone's memory
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsPermissionsModalOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-300 px-3.5 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Phone Permissions</span>
          </button>

          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold border border-indigo-200 px-3.5 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-2xs"
          >
            <Smartphone className="w-4 h-4 text-indigo-600" />
            <span>Install App</span>
          </button>

          <button
            onClick={handleExportAll}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold border border-slate-300 px-3.5 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>

      {/* Phone Storage & Hardware Sensor Dashboard Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-5 sm:p-6 shadow-md border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-xs">
              <HardDrive className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Phone Internal Storage Cache
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    storageInfo.isPersistent
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  }`}
                >
                  {storageInfo.isPersistent ? "Persistent Locked" : "Standard Storage"}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                All study data is encrypted and saved locally in your phone's memory.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!storageInfo.isPersistent && (
              <button
                onClick={handleLockStorage}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock Storage Against OS Cleanup</span>
              </button>
            )}
          </div>
        </div>

        {/* Storage Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
            <div
              className="bg-indigo-400 h-2 rounded-full transition-all"
              style={{ width: `${Math.max(4, Math.min(100, storageInfo.usagePercent))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>Used: {storageInfo.usageMB} MB (IRACs, Notes, Statutes)</span>
            <span>Allocated Quota: {storageInfo.quotaMB} MB</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search saved IRACs, cases, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all border ${
              activeCategory === "all"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            All ({totalSaved})
          </button>
          <button
            onClick={() => setActiveCategory("irac")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all border flex items-center gap-1.5 ${
              activeCategory === "irac"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>IRAC Models ({iracList.length})</span>
          </button>
          <button
            onClick={() => setActiveCategory("cases")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all border flex items-center gap-1.5 ${
              activeCategory === "cases"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Case Briefs ({caseList.length})</span>
          </button>
          <button
            onClick={() => setActiveCategory("notes")}
            className={`px-3.5 py-1.5 rounded-lg font-semibold transition-all border flex items-center gap-1.5 ${
              activeCategory === "notes"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lecture Syntheses ({noteList.length})</span>
          </button>
        </div>
      </div>

      {/* Grid of Saved Items */}
      <div className="space-y-2.5">
        {/* IRAC Solutions */}
        {(activeCategory === "all" || activeCategory === "irac") &&
          iracList
            .filter((item) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                item.title.toLowerCase().includes(q) ||
                item.scenario.toLowerCase().includes(q) ||
                item.subject.toLowerCase().includes(q)
              );
            })
            .map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem({ type: "irac", data: item })}
                className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-xl cursor-pointer transition-all text-left flex justify-between items-start shadow-2xs hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                      IRAC Model
                    </span>
                    <span className="text-xs text-slate-500">{item.subject}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 mt-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.scenario}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeleteIRAC(item.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Delete from Offline Vault"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

        {/* Case Briefs */}
        {(activeCategory === "all" || activeCategory === "cases") &&
          caseList
            .filter((item) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                item.caseName.toLowerCase().includes(q) ||
                item.citation.toLowerCase().includes(q) ||
                item.ratioDecidendi.toLowerCase().includes(q) ||
                item.subject.toLowerCase().includes(q)
              );
            })
            .map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem({ type: "case", data: item })}
                className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-xl cursor-pointer transition-all text-left flex justify-between items-start shadow-2xs hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Case Brief
                    </span>
                    <span className="text-xs text-slate-500 font-mono">{item.citation}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 mt-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {item.caseName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    Ratio: {item.ratioDecidendi}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeleteCase(item.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}

        {/* Syntheses */}
        {(activeCategory === "all" || activeCategory === "notes") &&
          noteList
            .filter((item) => {
              if (!searchQuery) return true;
              const q = searchQuery.toLowerCase();
              return (
                item.title.toLowerCase().includes(q) ||
                item.subject.toLowerCase().includes(q) ||
                item.quickSummaryCard.toLowerCase().includes(q)
              );
            })
            .map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem({ type: "note", data: item })}
                className="bg-white border border-slate-200 hover:border-indigo-400 p-4 rounded-xl cursor-pointer transition-all text-left flex justify-between items-start shadow-2xs hover:shadow-xs group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                      Revision Note
                    </span>
                    <span className="text-xs text-slate-500">{item.subject}</span>
                  </div>
                  <h3 className="font-serif font-bold text-sm text-slate-900 mt-1.5 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {item.quickSummaryCard || item.highYieldTakeaways?.[0]}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDeleteNote(item.id, e)}
                  className="p-1.5 text-slate-400 hover:text-red-600 ml-2 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
      </div>

      {/* Modal / Detailed Preview */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-xl space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {selectedItem.type.toUpperCase()}
                </span>
                <h2 className="font-serif font-bold text-lg text-slate-900 mt-1">
                  {"title" in selectedItem.data ? selectedItem.data.title : (selectedItem.data as CaseBrief).caseName}
                </h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕ Close
              </button>
            </div>

            {/* Content for IRAC */}
            {selectedItem.type === "irac" && (
              <div className="space-y-4">
                <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-900 block mb-1">Problem Scenario:</span>
                  {(selectedItem.data as IRACSolution).scenario}
                </div>
                <div className="prose prose-sm max-w-none text-slate-800 font-sans">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {(selectedItem.data as IRACSolution).rawMarkdown}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            {/* Content for Case Brief */}
            {selectedItem.type === "case" && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-indigo-700 block mb-1">Ratio Decidendi:</span>
                  {(selectedItem.data as CaseBrief).ratioDecidendi}
                </div>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-slate-800 block mb-1">Material Facts:</span>
                  {(selectedItem.data as CaseBrief).materialFacts}
                </div>
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-emerald-700 block mb-1">Kenyan Application:</span>
                  {(selectedItem.data as CaseBrief).kenyanApplication}
                </div>
              </div>
            )}

            {/* Content for Note Synthesis */}
            {selectedItem.type === "note" && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <span className="font-bold text-indigo-700 block mb-1">Executive Summary:</span>
                  {(selectedItem.data as NoteSynthesis).quickSummaryCard}
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1">High-Yield Takeaways:</span>
                  <ul className="list-disc list-inside space-y-1">
                    {(selectedItem.data as NoteSynthesis).highYieldTakeaways.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedItem(null)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Permissions & Native Installation Modals */}
      <DevicePermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        onPermissionUpdated={refreshVault}
      />

      <NativeAppInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
};
