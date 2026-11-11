import { apiFetch } from "../utils/api";
import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Search,
  Sparkles,
  Scale,
  CheckCircle2,
  Copy,
  Volume2,
  VolumeX,
  Layers,
  ChevronRight,
  GraduationCap,
  Calendar,
  FileText,
  HelpCircle,
  Tag,
  Clock,
  ArrowRight,
  Filter,
  Check,
  X,
  Sliders,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CaseBrief, LawUnit, LegalSubject, UnitTopicNote } from "../types";
import { PRELOADED_LANDMARK_CASES } from "../data/defaultVault";
import { ALL_UMMA_LAW_UNITS, SEMESTER_SECTIONS } from "../data/ummaCurriculum";
import { getStoredCaseBriefs, saveCaseBrief } from "../utils/storage";
import { speakWithEnglishFemaleVoice, stopSpeech } from "../utils/speechSynthesis";
import { SpeechSettingsModal } from "./SpeechSettingsModal";

const SUBJECTS: LegalSubject[] = [
  "Constitutional Law",
  "Law of Contract",
  "Law of Torts",
  "Criminal Law & Procedure",
  "Law of Evidence",
  "Islamic Jurisprudence & Sharia",
  "Islamic Family Law & Succession (Mirath)",
  "Civil Procedure",
  "Land Law & Property",
  "Commercial & Corporate Law",
];

export const CaseVaultView = ({
  onSaveNotification,
  onLoadQuestionIntoSolver,
}: {
  onSaveNotification: (msg: string) => void;
  onLoadQuestionIntoSolver?: (scenario: string, subject: LegalSubject) => void;
}) => {
  // Navigation tabs within Vault
  const [activeVaultTab, setActiveVaultTab] = useState<"curriculum" | "landmark_cases" | "ai_briefer">("curriculum");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  // Unit Selection State
  const [selectedUnit, setSelectedUnit] = useState<LawUnit>(() => ALL_UMMA_LAW_UNITS[0]);
  const [selectedTopicIndex, setSelectedTopicIndex] = useState<number>(0);

  // Case Brief State
  const [cases, setCases] = useState<CaseBrief[]>(() => getStoredCaseBriefs());
  const [selectedCase, setSelectedCase] = useState<CaseBrief | null>(() => {
    const initial = getStoredCaseBriefs();
    return initial.length > 0 ? initial[0] : null;
  });

  // AI Case Brief Generator State
  const [aiCaseQuery, setAiCaseQuery] = useState("");
  const [aiSubject, setAiSubject] = useState<LegalSubject>("Constitutional Law");
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Copy & Audio Speech State
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Filtered Law Units arranged in chronological semester order
  const filteredUnits = useMemo(() => {
    return ALL_UMMA_LAW_UNITS.filter((unit) => {
      // Semester filter
      if (selectedSemester !== "all") {
        const [targetYear, targetSem] = selectedSemester.replace("y", "").split("s").map(Number);
        if (unit.year !== targetYear || unit.semesterNumber !== targetSem) {
          return false;
        }
      }

      // Subject filter
      if (selectedSubject !== "all" && unit.subject !== selectedSubject) {
        return false;
      }

      // Search query filter (search across code, title, overview, topics, statutes, and cases)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesCode = unit.courseCode.toLowerCase().includes(query);
        const matchesTitle = unit.courseTitle.toLowerCase().includes(query);
        const matchesOverview = unit.unitOverview.toLowerCase().includes(query);
        const matchesTags = unit.tags.some((t) => t.toLowerCase().includes(query));
        const matchesTopics = unit.topics.some(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            t.summary.toLowerCase().includes(query) ||
            t.detailedNotes.toLowerCase().includes(query) ||
            t.keyStatutes.some((s) => s.toLowerCase().includes(query)) ||
            t.landmarkCases.some((c) => c.toLowerCase().includes(query))
        );
        const matchesStatutes = unit.statutoryFramework.some(
          (s) => s.act.toLowerCase().includes(query) || s.summary.toLowerCase().includes(query)
        );
        const matchesCases = unit.landmarkPrecedents.some(
          (c) => c.citation.toLowerCase().includes(query) || c.principle.toLowerCase().includes(query)
        );

        return (
          matchesCode ||
          matchesTitle ||
          matchesOverview ||
          matchesTags ||
          matchesTopics ||
          matchesStatutes ||
          matchesCases
        );
      }

      return true;
    });
  }, [searchQuery, selectedSemester, selectedSubject]);

  // Keep selectedUnit synced when filters change if current selection is excluded
  useEffect(() => {
    if (filteredUnits.length > 0 && !filteredUnits.some((u) => u.id === selectedUnit?.id)) {
      setSelectedUnit(filteredUnits[0]);
      setSelectedTopicIndex(0);
    }
  }, [filteredUnits, selectedUnit]);

  // Filtered Landmark Case Briefs
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        !searchQuery.trim() ||
        c.caseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.citation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.ratioDecidendi.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSub = selectedSubject === "all" || c.subject === selectedSubject;
      return matchesSearch && matchesSub;
    });
  }, [cases, searchQuery, selectedSubject]);

  // AI Brief Generation Handler
  const handleGenerateBrief = async () => {
    if (!aiCaseQuery.trim()) {
      setErrorMessage("Please enter a case name, legal concept, or citation to brief.");
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const response = await apiFetch("/api/case/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseName: aiCaseQuery,
          subject: aiSubject,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const newBrief: CaseBrief = {
        id: `case-${Date.now()}`,
        caseName: data.caseName || aiCaseQuery,
        citation: data.citation || "[eKLR citation]",
        courtAndYear: data.court || data.courtAndYear || "Kenyan Court (2023)",
        subject: aiSubject,
        materialFacts: data.materialFacts || "",
        centralIssue: data.centralIssue || "",
        ratioDecidendi: data.ratioDecidendi || "",
        obiterDicta: data.obiterDicta || "",
        kenyanApplication: data.kenyanApplication || "",
        createdAt: Date.now(),
      };

      setCases((prev) => [newBrief, ...prev]);
      setSelectedCase(newBrief);
      saveCaseBrief(newBrief);
      setActiveVaultTab("landmark_cases");
      onSaveNotification("Case Brief synthesized and saved to Vault!");
      setAiCaseQuery("");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to brief case.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUnitNotes = () => {
    if (!selectedUnit) return;
    const currentTopic = selectedUnit.topics[selectedTopicIndex] || selectedUnit.topics[0];
    const text = `UMMA UNIVERSITY SCHOOL OF LAW & SHARIAH\n${selectedUnit.courseCode}: ${selectedUnit.courseTitle} (${selectedUnit.semesterLabel})\n\nTOPIC: ${currentTopic?.title}\n\nSUMMARY:\n${currentTopic?.summary}\n\nDETAILED NOTES:\n${currentTopic?.detailedNotes}\n\nKEY STATUTES:\n${currentTopic?.keyStatutes.join(", ")}\n\nLANDMARK PRECEDENTS:\n${currentTopic?.landmarkCases.join("\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCase = () => {
    if (!selectedCase) return;
    const text = `${selectedCase.caseName} ${selectedCase.citation}\n\nMATERIAL FACTS:\n${selectedCase.materialFacts}\n\nCENTRAL ISSUE:\n${selectedCase.centralIssue}\n\nRATIO DECIDENDI:\n${selectedCase.ratioDecidendi}\n\nKENYAN APPLICATION:\n${selectedCase.kenyanApplication}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = (textToRead: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    speakWithEnglishFemaleVoice(textToRead, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
    setIsSpeaking(true);
  };

  const currentTopic: UnitTopicNote | undefined = selectedUnit?.topics[selectedTopicIndex] || selectedUnit?.topics[0];

  return (
    <div className="pb-24 pt-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
      {/* Top Header & Navigation Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5" />
              Umma University LL.B Curriculum Vault
            </span>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Year 1 Sem 1 to Year 4 Sem 2 (All 8 Semesters)
            </span>
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Comprehensive Law Unit Notes & Landmark Vault
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Complete syllabus notes, statutory doctrines, and ratio decidendi repository for Kenyan & Shariah law
          </p>
        </div>

        {/* View Mode Toggle Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setActiveVaultTab("curriculum")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeVaultTab === "curriculum"
                ? "bg-white text-emerald-800 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Unit Notes ({ALL_UMMA_LAW_UNITS.length})</span>
          </button>

          <button
            onClick={() => setActiveVaultTab("landmark_cases")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeVaultTab === "landmark_cases"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Landmark Precedents ({cases.length})</span>
          </button>

          <button
            onClick={() => setActiveVaultTab("ai_briefer")}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeVaultTab === "ai_briefer"
                ? "bg-white text-purple-700 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Brief Generator</span>
          </button>
        </div>
      </div>

      {/* Instant Search Bar & Semester Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-4">
        {/* Universal Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-emerald-600" />
          <input
            type="text"
            placeholder="Search by topic, unit code (e.g. LLB 111, SHAR 202), doctrine (e.g. Consideration, Mirath, Section 106B, Basic Structure), or statute..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-10 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters: Semester Orderly Navigation Chips & Subject Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          {/* Orderly Semester Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap mr-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Semester:
            </span>
            {SEMESTER_SECTIONS.map((sec) => {
              const isSelected = selectedSemester === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSemester(sec.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isSelected
                      ? "bg-emerald-700 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  {sec.shortLabel}
                </button>
              );
            })}
          </div>

          {/* Subject Filter Dropdown */}
          <div className="sm:w-56 shrink-0">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Legal Subject Areas</option>
              {SUBJECTS.map((subj) => (
                <option key={subj} value={subj}>
                  {subj}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Results Metadata Indicator */}
        {(searchQuery || selectedSemester !== "all" || selectedSubject !== "all") && (
          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Found <strong>{filteredUnits.length}</strong> matching unit{filteredUnits.length === 1 ? "" : "s"}
                {searchQuery && <> for &quot;<strong>{searchQuery}</strong>&quot;</>}
              </span>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSemester("all");
                setSelectedSubject("all");
              }}
              className="text-emerald-700 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ================= VIEW 1: CURRICULUM & UNIT NOTES ================= */}
      {activeVaultTab === "curriculum" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Orderly Units List (Starting from Semester 1 to Last) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                Umma Law Units ({filteredUnits.length})
              </h3>
              <span className="text-[11px] font-mono text-slate-400">Orderly Y1 ➔ Y4</span>
            </div>

            <div className="space-y-2 max-h-[700px] overflow-y-auto pr-1">
              {filteredUnits.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 space-y-2">
                  <BookOpen className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-medium">No units found matching your search query</p>
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedSemester("all");
                      setSelectedSubject("all");
                    }}
                    className="text-xs text-emerald-700 font-bold hover:underline"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                filteredUnits.map((unit) => {
                  const isSelected = selectedUnit?.id === unit.id;
                  return (
                    <button
                      key={unit.id}
                      onClick={() => {
                        setSelectedUnit(unit);
                        setSelectedTopicIndex(0);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? "bg-emerald-50/80 border-emerald-400 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-900 border border-emerald-200">
                          {unit.courseCode}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded">
                          {unit.semesterLabel}
                        </span>
                      </div>

                      <div className="font-serif font-bold text-xs sm:text-sm text-slate-900 mt-2 line-clamp-1">
                        {unit.courseTitle}
                      </div>

                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                        {unit.unitOverview}
                      </p>

                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-medium">
                        <span>{unit.topics.length} Study Topics</span>
                        <span>•</span>
                        <span>{unit.statutoryFramework.length} Statutes</span>
                        <span>•</span>
                        <span>{unit.landmarkPrecedents.length} Landmark Cases</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: In-Depth Unit Study Notes, Topics & Statutes */}
          <div className="lg:col-span-8">
            {selectedUnit ? (
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-6">
                {/* Unit Header Banner */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-5 border-b border-slate-100 gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-700 text-white">
                        {selectedUnit.courseCode}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {selectedUnit.semesterLabel}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {selectedUnit.subject}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {selectedUnit.creditHours} Credit Units
                      </span>
                    </div>

                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                      {selectedUnit.courseTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                      {selectedUnit.unitOverview}
                    </p>
                  </div>

                  {/* Actions: Text-to-Speech & Copy Notes */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          toggleSpeech(
                            `${selectedUnit.courseTitle}. ${selectedUnit.unitOverview}. Current Topic: ${currentTopic?.title}. ${currentTopic?.summary}`
                          )
                        }
                        className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                          isSpeaking
                            ? "bg-emerald-700 text-white border-emerald-700"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                        title="Read Unit Overview Out Loud"
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span className="text-xs font-semibold hidden sm:inline">
                          {isSpeaking ? "Stop" : "Listen"}
                        </span>
                      </button>

                      <button
                        onClick={() => setIsVoiceSettingsOpen(true)}
                        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:text-emerald-700 border border-slate-200 hover:bg-slate-100 transition-colors"
                        title="Calibrate Voice, Pitch & Pace"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleCopyUnitNotes}
                      className="px-3 py-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? "Copied" : "Copy Notes"}</span>
                    </button>
                  </div>
                </div>

                {/* Topic Navigation Selector */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    Unit Modules & Topic Notes:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedUnit.topics.map((top, idx) => {
                      const isTopSelected = selectedTopicIndex === idx;
                      return (
                        <button
                          key={top.id}
                          onClick={() => setSelectedTopicIndex(idx)}
                          className={`text-left p-3 rounded-lg border transition-all ${
                            isTopSelected
                              ? "bg-emerald-50 border-emerald-500 shadow-2xs font-semibold text-emerald-950"
                              : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/70"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-xs font-bold line-clamp-1">{top.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{top.summary}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active Topic Detailed Study Card */}
                {currentTopic && (
                  <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Topic Module {selectedTopicIndex + 1} of {selectedUnit.topics.length}
                      </span>
                    </div>

                    <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">
                      {currentTopic.title}
                    </h3>

                    {/* Markdown Detailed Notes */}
                    <div className="prose prose-sm max-w-none text-slate-800 text-xs sm:text-sm leading-relaxed bg-white p-4 rounded-lg border border-slate-200">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {currentTopic.detailedNotes}
                      </ReactMarkdown>
                    </div>

                    {/* Key Statutes & Landmark Cases Pills */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <Scale className="w-3 h-3 text-indigo-600" />
                          Key Statutory Provisions:
                        </h5>
                        <ul className="space-y-1">
                          {currentTopic.keyStatutes.map((stat, i) => (
                            <li key={i} className="text-xs text-slate-700 font-mono flex items-start gap-1.5">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span>{stat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-slate-200">
                        <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-emerald-600" />
                          Landmark Case Precedents:
                        </h5>
                        <ul className="space-y-1">
                          {currentTopic.landmarkCases.map((cs, i) => (
                            <li key={i} className="text-xs text-slate-800 font-medium flex items-start gap-1.5">
                              <span className="text-indigo-600 font-bold">⚖</span>
                              <span>{cs}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Exam Tips Box */}
                    {currentTopic.examTips && (
                      <div className="bg-amber-50/80 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                        <HelpCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider block">
                            High-Yield Exam & Marking Tip:
                          </span>
                          <p className="text-xs text-amber-800 mt-0.5">{currentTopic.examTips}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Statutory Framework Section */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-slate-600" />
                    Statutory Framework for {selectedUnit.courseCode}:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedUnit.statutoryFramework.map((sf, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <div className="font-bold text-slate-900 font-mono">{sf.act}</div>
                        <div className="text-emerald-700 font-semibold text-[11px] mt-0.5">{sf.section}</div>
                        <div className="text-slate-600 mt-1">{sf.summary}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Landmark Precedents with Ratios */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                    Binding Precedents & Ratio Decidendi:
                  </h4>
                  <div className="space-y-2">
                    {selectedUnit.landmarkPrecedents.map((prec, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                        <div className="font-serif font-bold text-slate-900">{prec.citation}</div>
                        <div className="text-slate-700 mt-1 leading-relaxed">
                          <strong>Ratio:</strong> {prec.principle}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Common Exam Problem Scenarios */}
                {selectedUnit.commonExamQuestions.length > 0 && (
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-indigo-700" />
                      Sample Past Exam Problem Questions:
                    </h4>
                    <div className="space-y-2">
                      {selectedUnit.commonExamQuestions.map((q, idx) => (
                        <div
                          key={idx}
                          className="bg-white p-3 rounded-lg border border-indigo-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                        >
                          <p className="text-slate-800 font-medium leading-relaxed">{q}</p>
                          {onLoadQuestionIntoSolver && (
                            <button
                              onClick={() => onLoadQuestionIntoSolver(q, selectedUnit.subject)}
                              className="px-3 py-1.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] whitespace-nowrap self-start sm:self-auto flex items-center gap-1 transition-all"
                            >
                              <span>Solve in IRAC</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 shadow-2xs">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">Select a unit from the left panel to inspect full notes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: LANDMARK PRECEDENTS & RATIO DECIDENDI ================= */}
      {activeVaultTab === "landmark_cases" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Case Briefs List */}
          <div className="lg:col-span-1 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-indigo-600" />
                Landmark Precedents ({filteredCases.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-[650px] overflow-y-auto pr-1">
              {filteredCases.map((c) => {
                const isSelected = selectedCase?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-indigo-50/70 border-indigo-400 shadow-xs"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {c.citation}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium truncate max-w-[120px]">
                        {c.courtAndYear}
                      </span>
                    </div>
                    <div className="font-serif font-bold text-xs sm:text-sm text-slate-900 mt-1.5 line-clamp-1">
                      {c.caseName}
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                      {c.ratioDecidendi}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detailed Ratio Decidendi Card */}
          <div className="lg:col-span-2">
            {selectedCase ? (
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                        {selectedCase.subject}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {selectedCase.citation}
                      </span>
                    </div>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-900 mt-1.5">
                      {selectedCase.caseName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          toggleSpeech(
                            `${selectedCase.caseName}, ${selectedCase.citation}. Ratio Decidendi: ${selectedCase.ratioDecidendi}. Kenyan Application: ${selectedCase.kenyanApplication}`
                          )
                        }
                        className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                          isSpeaking
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                        title="Read Case Out Loud"
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span className="text-xs font-semibold hidden sm:inline">
                          {isSpeaking ? "Stop" : "Listen"}
                        </span>
                      </button>

                      <button
                        onClick={() => setIsVoiceSettingsOpen(true)}
                        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                        title="Calibrate Voice, Pitch & Pace"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={handleCopyCase}
                      className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span className="hidden sm:inline">{copied ? "Copied" : "Copy Brief"}</span>
                    </button>
                  </div>
                </div>

                {/* Material Facts */}
                <div className="border-l-4 border-slate-300 pl-4 py-0.5">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-tighter mb-1.5">
                    📌 Material Facts
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedCase.materialFacts}
                  </p>
                </div>

                {/* Central Issue */}
                <div className="border-l-4 border-indigo-500 pl-4 py-0.5">
                  <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-tighter mb-1.5">
                    ❓ Central Legal Question / Issue
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {selectedCase.centralIssue}
                  </p>
                </div>

                {/* Ratio Decidendi */}
                <div className="border-l-4 border-emerald-500 pl-4 py-0.5">
                  <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-tighter mb-1.5">
                    ⚖️ Ratio Decidendi (Binding Legal Principle)
                  </h4>
                  <div className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                    {selectedCase.ratioDecidendi}
                  </div>
                </div>

                {/* Kenyan Application */}
                <div className="border-l-4 border-slate-400 pl-4 py-0.5">
                  <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-tighter mb-1.5">
                    🇰🇪 Kenyan Judicial Application & Distinction
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {selectedCase.kenyanApplication}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 shadow-2xs">
                <BookOpen className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">Select a case from the list to view its complete ratio decidendi</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= VIEW 3: AI CASE BRIEF GENERATOR ================= */}
      {activeVaultTab === "ai_briefer" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="font-serif font-bold text-lg text-slate-900">
                Instant AI Case Law & Ratio Decidendi Generator
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Type any Kenyan Supreme Court, Court of Appeal, High Court, Kadhi Court, or Commonwealth precedent to extract material facts, ratio decidendi, and exam applications.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Case Citation or Landmark Legal Decision:
              </label>
              <input
                type="text"
                placeholder="e.g. Francis Karioko Muruatetu v Republic [2017] KSC or In re Estate of Lerionka Ole Ntutu..."
                value={aiCaseQuery}
                onChange={(e) => setAiCaseQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Subject Area:
              </label>
              <select
                value={aiSubject}
                onChange={(e) => setAiSubject(e.target.value as LegalSubject)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
              >
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                {errorMessage}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={handleGenerateBrief}
                disabled={isGenerating}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting Ratio Decidendi via Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Complete Case Brief</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Voice & Acoustic Calibration Modal */}
      <SpeechSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />
    </div>
  );
};
