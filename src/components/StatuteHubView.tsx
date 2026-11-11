import { apiFetch } from "../utils/api";
import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  BookOpen,
  Copy,
  CheckCircle2,
  AlertCircle,
  Scale,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  ExternalLink,
  ChevronRight,
  Filter,
  PlusCircle,
  FileText,
  ShieldCheck,
  Landmark,
  Layers,
  Scroll,
  Sliders,
} from "lucide-react";
import { COMPREHENSIVE_STATUTE_LIBRARY } from "../data/statutoryLibrary";
import { StatuteReference } from "../types";
import {
  getBookmarkedStatuteIds,
  toggleStatuteBookmark,
} from "../utils/storage";
import { speakWithEnglishFemaleVoice, stopSpeech } from "../utils/speechSynthesis";
import { SpeechSettingsModal } from "./SpeechSettingsModal";

type CompendiumTab = "all" | "constitution" | "act" | "bill" | "sharia";

export const StatuteHubView = ({
  onSaveNotification,
}: {
  onSaveNotification: (msg: string) => void;
}) => {
  const [library, setLibrary] = useState<StatuteReference[]>(COMPREHENSIVE_STATUTE_LIBRARY);
  const [activeCompendiumTab, setActiveCompendiumTab] = useState<CompendiumTab>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatute, setSelectedStatute] = useState<StatuteReference | null>(
    COMPREHENSIVE_STATUTE_LIBRARY[0]
  );
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(false);

  // AI Deep Statutory Lookup State
  const [aiQuery, setAiQuery] = useState("");
  const [aiCategoryFocus, setAiCategoryFocus] = useState<string>("Statutory & Islamic Jurisprudence");
  const [isSearchingAI, setIsSearchingAI] = useState(false);
  const [aiLookupResult, setAiLookupResult] = useState<StatuteReference | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);

  // Load Bookmarks on Mount
  useEffect(() => {
    setBookmarkedIds(getBookmarkedStatuteIds());
  }, []);

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isNowBookmarked = toggleStatuteBookmark(id);
    setBookmarkedIds(getBookmarkedStatuteIds());
    onSaveNotification(
      isNowBookmarked ? "Bookmarked to Legal Vault" : "Removed bookmark"
    );
  };

  const handleAILookup = async () => {
    if (!aiQuery.trim()) return;
    setIsSearchingAI(true);
    setAiError(null);
    setAiLookupResult(null);

    try {
      const response = await apiFetch("/api/statute/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: aiQuery,
          statute: aiCategoryFocus,
          compendiumType: activeCompendiumTab === "all" ? "act" : activeCompendiumTab,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Lookup failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.statute) {
        setAiLookupResult(data.statute);
        setSelectedStatute(data.statute);
        onSaveNotification("Statutory analysis generated!");
      }
    } catch (err: any) {
      console.error(err);
      setAiError(err.message || "Failed to lookup statutory provision.");
    } finally {
      setIsSearchingAI(false);
    }
  };

  const handleAddAILookupToLibrary = () => {
    if (!aiLookupResult) return;
    const exists = library.some((item) => item.id === aiLookupResult.id);
    if (!exists) {
      setLibrary([aiLookupResult, ...library]);
      setSelectedStatute(aiLookupResult);
      onSaveNotification("Saved provision to your Active Compendium!");
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleSpeech = (text: string) => {
    if (!text) return;

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    speakWithEnglishFemaleVoice(text, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
    setIsSpeaking(true);
  };

  // Distinct categories in the library
  const availableCategories = Array.from(
    new Set(library.map((item) => item.category))
  );

  // Filtered statutes
  const filteredStatutes = library.filter((stat) => {
    // 1. Tab filter
    if (activeCompendiumTab !== "all" && stat.compendiumType !== activeCompendiumTab) {
      return false;
    }

    // 2. Category filter
    if (selectedCategory !== "all" && stat.category !== selectedCategory) {
      return false;
    }

    // 3. Bookmark filter
    if (showOnlyBookmarked && !bookmarkedIds.includes(stat.id)) {
      return false;
    }

    // 4. Search query
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      stat.actName.toLowerCase().includes(q) ||
      stat.sectionOrArticle.toLowerCase().includes(q) ||
      stat.title.toLowerCase().includes(q) ||
      stat.keyPrinciple.toLowerCase().includes(q) ||
      (stat.chapterOrPart && stat.chapterOrPart.toLowerCase().includes(q)) ||
      (stat.landmarkCases && stat.landmarkCases.some((c) => c.toLowerCase().includes(q))) ||
      (stat.arabicText && stat.arabicText.includes(q))
    );
  });

  const getCompendiumIcon = (type: string) => {
    switch (type) {
      case "constitution":
        return <Landmark className="w-3.5 h-3.5 text-amber-600" />;
      case "bill":
        return <Layers className="w-3.5 h-3.5 text-blue-600" />;
      case "sharia":
        return <Scroll className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Scale className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  const getCompendiumBadge = (type: string) => {
    switch (type) {
      case "constitution":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            <Landmark className="w-3 h-3" /> Constitution 2010
          </span>
        );
      case "bill":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
            <Layers className="w-3 h-3" /> Passed Bill / Act
          </span>
        );
      case "sharia":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Scroll className="w-3 h-3" /> Shariah Law & Fiqh
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
            <Scale className="w-3 h-3" /> Act of Parliament
          </span>
        );
    }
  };

  return (
    <div className="pb-28 pt-6 px-4 sm:px-8 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Legal Compendium & Library
            </span>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Umma University LL.B & CLE Aligned
            </span>
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Kenyan Statutory & Sharia Compendium
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Searchable statutory library covering the Constitution of Kenya (2010), all Acts of
            Parliament, passed Parliamentary Bills, and the Shariah Law compendium (Ayat al-Ahkam,
            Mirath, Legal Maxims, and Kadhis' Court jurisprudence).
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 border border-slate-200 p-2.5 rounded-xl">
          <div className="text-center px-2 py-1">
            <div className="font-bold text-sm text-amber-700">18</div>
            <div className="text-[10px] text-slate-500 font-medium">Const. Chapters</div>
          </div>
          <div className="text-center px-2 py-1 border-l border-slate-200">
            <div className="font-bold text-sm text-indigo-700">100+</div>
            <div className="text-[10px] text-slate-500 font-medium">Acts & Caps</div>
          </div>
          <div className="text-center px-2 py-1 border-l border-slate-200">
            <div className="font-bold text-sm text-blue-700">Recent</div>
            <div className="text-[10px] text-slate-500 font-medium">Passed Bills</div>
          </div>
          <div className="text-center px-2 py-1 border-l border-slate-200">
            <div className="font-bold text-sm text-emerald-700">Complete</div>
            <div className="text-[10px] text-slate-500 font-medium">Sharia & Mirath</div>
          </div>
        </div>
      </div>

      {/* Primary Category Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => {
            setActiveCompendiumTab("all");
            setSelectedCategory("all");
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCompendiumTab === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>All Legal Resources</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-700 text-white">
            {library.length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveCompendiumTab("constitution");
            setSelectedCategory("all");
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCompendiumTab === "constitution"
              ? "bg-amber-700 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-900"
          }`}
        >
          <Landmark className="w-4 h-4 text-amber-500" />
          <span>Constitution of Kenya (2010)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
            {library.filter((i) => i.compendiumType === "constitution").length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveCompendiumTab("act");
            setSelectedCategory("all");
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCompendiumTab === "act"
              ? "bg-indigo-700 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-indigo-50 hover:text-indigo-900"
          }`}
        >
          <Scale className="w-4 h-4 text-indigo-500" />
          <span>Acts of Parliament (Caps & Statutes)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800">
            {library.filter((i) => i.compendiumType === "act").length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveCompendiumTab("bill");
            setSelectedCategory("all");
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCompendiumTab === "bill"
              ? "bg-blue-700 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-blue-50 hover:text-blue-900"
          }`}
        >
          <Layers className="w-4 h-4 text-blue-500" />
          <span>Passed Parliamentary Bills</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
            {library.filter((i) => i.compendiumType === "bill").length}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveCompendiumTab("sharia");
            setSelectedCategory("all");
          }}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeCompendiumTab === "sharia"
              ? "bg-emerald-700 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-emerald-50 hover:text-emerald-900"
          }`}
        >
          <Scroll className="w-4 h-4 text-emerald-500" />
          <span>Shariah Law & Islamic Jurisprudence</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
            {library.filter((i) => i.compendiumType === "sharia").length}
          </span>
        </button>
      </div>

      {/* AI Deep Statutory & Sharia Provision Search / Generator Box */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-indigo-400" /> AI Statutory & Sharia Deep Query
            </span>
            <h2 className="font-serif font-bold text-base sm:text-lg text-white mt-1">
              Look Up Any Specific Act, Bill, Article, or Sharia Injunction
            </h2>
          </div>
          <span className="text-xs text-slate-300">
            Instant verbatim wording, ratio decidendi, landmark decisions & exam pitfalls
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="e.g. Section 106B Evidence Act, Article 201 Public Finance, Affordable Housing Act Sec 4, Surah An-Nisa 4:11 Mirath, Section 143 Companies Act..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAILookup()}
              className="w-full bg-slate-800/90 border border-slate-700 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-slate-800 shadow-inner"
            />
          </div>

          <button
            onClick={handleAILookup}
            disabled={isSearchingAI || !aiQuery.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-sm shrink-0"
          >
            {isSearchingAI ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Searching Compendium...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze & Retrieve</span>
              </>
            )}
          </button>
        </div>

        {aiError && (
          <div className="bg-rose-950/70 border border-rose-800 text-rose-200 text-xs px-3.5 py-2 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{aiError}</span>
          </div>
        )}

        {/* AI Result notification badge */}
        {aiLookupResult && (
          <div className="bg-indigo-900/60 border border-indigo-700/60 p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-xs text-indigo-100 font-semibold">
                Retrieved: <strong className="text-white">{aiLookupResult.actName}</strong> —{" "}
                {aiLookupResult.sectionOrArticle}: {aiLookupResult.title}
              </span>
            </div>
            <button
              onClick={handleAddAILookupToLibrary}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Save to Active Compendium</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Two-Column Library Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Search Filter, Subject Chips & Provision Index (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Sub-Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search provisions, Cap 63, Art 170, Mirath, ratio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Subject Chips / Filter */}
            <div className="flex flex-wrap gap-1.5 items-center">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                  selectedCategory === "all"
                    ? "bg-indigo-100 text-indigo-800 font-bold border border-indigo-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                All Subjects
              </button>
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] font-semibold px-2.5 py-1 rounded-md transition-colors ${
                    selectedCategory === cat
                      ? "bg-indigo-100 text-indigo-800 font-bold border border-indigo-300"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}

              <button
                onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
                className={`ml-auto text-[10px] font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 transition-colors ${
                  showOnlyBookmarked
                    ? "bg-amber-100 text-amber-800 font-bold border border-amber-300"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                <Bookmark className="w-3 h-3" />
                <span>Saved ({bookmarkedIds.length})</span>
              </button>
            </div>
          </div>

          {/* Provision List */}
          <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1">
            {filteredStatutes.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">
                  No provisions match your search criteria.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setShowOnlyBookmarked(false);
                  }}
                  className="text-xs text-indigo-600 font-bold hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredStatutes.map((stat) => {
                const isSelected = selectedStatute?.id === stat.id;
                const isBookmarked = bookmarkedIds.includes(stat.id);

                return (
                  <div
                    key={stat.id}
                    onClick={() => setSelectedStatute(stat)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? "bg-indigo-50/80 border-indigo-400 shadow-xs ring-1 ring-indigo-400/50"
                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getCompendiumBadge(stat.compendiumType)}
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {stat.sectionOrArticle}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleToggleBookmark(stat.id, e)}
                        className={`p-1 rounded-md transition-colors ${
                          isBookmarked
                            ? "text-amber-500 hover:text-amber-600"
                            : "text-slate-300 hover:text-slate-500 opacity-0 group-hover:opacity-100"
                        }`}
                        title={isBookmarked ? "Remove bookmark" : "Bookmark provision"}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="font-serif font-bold text-xs sm:text-sm text-slate-900 mt-1.5 line-clamp-1">
                      {stat.title}
                    </div>

                    <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">
                      {stat.actName}
                    </div>

                    <p className="text-[11px] text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                      {stat.keyPrinciple}
                    </p>

                    {stat.chapterOrPart && (
                      <div className="text-[10px] text-slate-400 mt-2 truncate font-medium">
                        📂 {stat.chapterOrPart}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Statutory & Jurisprudential Viewer (7 cols) */}
        <div className="lg:col-span-7">
          {selectedStatute ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 sticky top-6">
              {/* Header & Controls */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-4 border-b border-slate-100 gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    {getCompendiumBadge(selectedStatute.compendiumType)}
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {selectedStatute.shortCode}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {selectedStatute.category}
                    </span>
                  </div>

                  <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-900 tracking-tight pt-1">
                    {selectedStatute.sectionOrArticle}: {selectedStatute.title}
                  </h2>

                  <div className="text-xs font-medium text-slate-500 font-serif">
                    {selectedStatute.actName}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                  <button
                    onClick={() =>
                      handleToggleBookmark(selectedStatute.id)
                    }
                    className={`p-2 rounded-lg border transition-colors ${
                      bookmarkedIds.includes(selectedStatute.id)
                        ? "bg-amber-50 text-amber-700 border-amber-300"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                    title={
                      bookmarkedIds.includes(selectedStatute.id)
                        ? "Bookmarked"
                        : "Save to Vault"
                    }
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        toggleSpeech(
                          `${selectedStatute.actName}, ${selectedStatute.sectionOrArticle}: ${selectedStatute.title}. Statutory wording: ${selectedStatute.content}. Core principle: ${selectedStatute.keyPrinciple}. Exam Guidance: ${selectedStatute.examTips}`
                        )
                      }
                      className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                        isSpeaking
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                      title={isSpeaking ? "Stop speech" : "Listen to provision with clear English female voice"}
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span className="text-xs font-semibold hidden sm:inline">
                        {isSpeaking ? "Stop" : "Listen"}
                      </span>
                    </button>

                    <button
                      onClick={() => setIsVoiceSettingsOpen(true)}
                      className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                      title="Calibrate Voice, Pitch & Reading Pace"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      handleCopy(
                        `${selectedStatute.actName} - ${selectedStatute.sectionOrArticle}: ${selectedStatute.title}\n\n"${selectedStatute.content}"\n\nCore Principle: ${selectedStatute.keyPrinciple}`
                      )
                    }
                    className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                    title="Copy Provision Text"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Arabic Calligraphy Display (for Sharia provisions) */}
              {selectedStatute.arabicText && (
                <div className="bg-emerald-950/5 border border-emerald-200/80 rounded-xl p-4 text-right">
                  <span className="block text-[10px] font-bold text-emerald-800 uppercase tracking-widest text-left mb-1">
                    النص الشرعي (Original Arabic Text)
                  </span>
                  <p className="font-serif text-base sm:text-lg text-emerald-950 leading-loose font-medium" dir="rtl">
                    {selectedStatute.arabicText}
                  </p>
                </div>
              )}

              {/* Verbatim Statutory Wording Box */}
              <div className="border-l-4 border-slate-400 pl-4 py-0.5">
                <h3 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  📜 Statutory Provision / Quranic Injunction Wording
                </h3>
                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-mono bg-slate-50 p-4 rounded-xl border border-slate-200 whitespace-pre-wrap">
                  "{selectedStatute.content}"
                </div>
              </div>

              {/* Core Legal Principle / Ratio Decidendi */}
              <div className="border-l-4 border-emerald-500 pl-4 py-0.5">
                <h3 className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-emerald-600" />
                  ⚖️ Core Legal Principle & Jurisprudential Ratio
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-emerald-50/40 p-3 rounded-lg border border-emerald-100">
                  {selectedStatute.keyPrinciple}
                </p>
              </div>

              {/* Landmark Decisions & Precedents */}
              {selectedStatute.landmarkCases && selectedStatute.landmarkCases.length > 0 && (
                <div className="border-l-4 border-indigo-500 pl-4 py-0.5">
                  <h3 className="text-xs font-extrabold text-indigo-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-indigo-600" />
                    🏛️ Landmark Interpreting Decisions & Precedents
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStatute.landmarkCases.map((c, i) => (
                      <span
                        key={i}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50/80 border border-indigo-200 text-indigo-900 shadow-2xs"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cross References */}
              {selectedStatute.crossReferences && selectedStatute.crossReferences.length > 0 && (
                <div className="border-l-4 border-blue-500 pl-4 py-0.5">
                  <h3 className="text-xs font-extrabold text-blue-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    🔗 Related Statutes & Cross-References
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedStatute.crossReferences.map((ref, i) => (
                      <button
                        key={i}
                        onClick={() => setSearchQuery(ref.split(" ")[0])}
                        className="text-xs font-medium px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 hover:bg-blue-100 transition-colors"
                      >
                        {ref}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Exam Pitfalls & CLE Guidance */}
              <div className="border-l-4 border-rose-500 pl-4 py-0.5">
                <h3 className="text-xs font-extrabold text-rose-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  🎯 LL.B & CLE Bar Exam Pitfalls:
                </h3>
                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-rose-50/50 p-3 rounded-lg border border-rose-100">
                  {selectedStatute.examTips}
                </div>
              </div>

              {/* Parliamentary Status Footer */}
              {selectedStatute.parliamentaryStatus && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>Status / Enactment:</span>
                  <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedStatute.parliamentaryStatus}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="font-serif font-bold text-base text-slate-800">
                Select a Legal Provision to View Details
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click any Article, Act of Parliament, Parliamentary Bill, or Sharia injunction from
                the directory or use the AI Deep Query to analyze any provision.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* Voice & Acoustic Calibration Modal */}
      <SpeechSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />
    </div>
  );
};
