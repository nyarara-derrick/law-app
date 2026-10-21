import React, { useState, useEffect, useRef } from "react";
import {
  Scale,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Copy,
  Volume2,
  VolumeX,
  PenTool,
  Award,
  AlertTriangle,
  BookMarked,
  FileCheck,
  RotateCcw,
  ArrowRight,
  BookOpen,
  Camera,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  Eye,
  FileUp,
  GraduationCap,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  Mic,
  Smartphone,
  Sliders,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LegalSubject, IRACSolution, IRACGradeResult, UploadedAttachment, PastPaper } from "../types";
import { SAMPLE_PROBLEM_SCENARIOS } from "../data/defaultVault";
import { UMMA_UNIVERSITY_PAST_PAPERS } from "../data/pastPapers";
import { saveIRACSolution } from "../utils/storage";
import { CameraCaptureModal } from "./CameraCaptureModal";
import { VoiceRecorderModal } from "./VoiceRecorderModal";
import { speakWithEnglishFemaleVoice, stopSpeech } from "../utils/speechSynthesis";
import { SpeechSettingsModal } from "./SpeechSettingsModal";

const SUBJECTS: LegalSubject[] = [
  "Law of Contract",
  "Law of Torts",
  "Constitutional Law",
  "Criminal Law & Procedure",
  "Law of Evidence",
  "Islamic Jurisprudence & Sharia",
  "Islamic Family Law & Succession (Mirath)",
  "Civil Procedure",
  "Land Law & Property",
  "Commercial & Corporate Law",
];

export const IRACSolverView = ({
  onSaveNotification,
  initialPreset,
}: {
  onSaveNotification: (msg: string) => void;
  initialPreset?: { scenario: string; subject: LegalSubject } | null;
}) => {
  const [activeMode, setActiveMode] = useState<"solve" | "grade" | "pastpapers">("solve");
  const [inputMethod, setInputMethod] = useState<"text" | "photo" | "pdf">("text");

  const [selectedSubject, setSelectedSubject] = useState<LegalSubject>(() => initialPreset?.subject || "Law of Contract");
  const [scenario, setScenario] = useState(() => initialPreset?.scenario || "");
  const [customInstructions, setCustomInstructions] = useState("");
  const [studentDraft, setStudentDraft] = useState("");

  useEffect(() => {
    if (initialPreset) {
      setScenario(initialPreset.scenario);
      setSelectedSubject(initialPreset.subject);
      setActiveMode("solve");
    }
  }, [initialPreset]);


  // Multimodal Attachment State (Photo / PDF)
  const [attachment, setAttachment] = useState<UploadedAttachment | null>(null);
  const [isExtractingText, setIsExtractingText] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [currentSolution, setCurrentSolution] = useState<IRACSolution | null>(null);
  const [gradeResult, setGradeResult] = useState<IRACGradeResult | null>(null);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isVoiceSettingsOpen, setIsVoiceSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Hardware Sensor Modals
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Past Papers Filter & Expand State
  const [pastPaperSearch, setPastPaperSearch] = useState("");
  const [pastPaperSubjectFilter, setPastPaperSubjectFilter] = useState<string>("All");
  const [expandedAnswers, setExpandedAnswers] = useState<{ [qId: string]: boolean }>({});

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Handle Camera Capture
  const handleCameraCapture = (base64Image: string) => {
    const rawData = base64Image.split(",")[1] || base64Image;
    setAttachment({
      name: `Camera_Scan_${new Date().toISOString().slice(11, 19).replace(/:/g, "-")}.jpg`,
      mimeType: "image/jpeg",
      data: rawData,
      previewUrl: base64Image,
      sizeBytes: Math.round((rawData.length * 3) / 4),
    });
    setInputMethod("photo");
    onSaveNotification("Camera capture added! Ready to solve or extract text.");
  };

  // Handle Voice Dictation Transcript
  const handleVoiceTranscript = (transcript: string) => {
    if (activeMode === "grade") {
      setStudentDraft((prev) => (prev ? `${prev}\n${transcript}` : transcript));
    } else {
      setScenario((prev) => (prev ? `${prev}\n${transcript}` : transcript));
    }
    onSaveNotification("Voice dictation transcribed!");
  };

  // Handle File Upload (Image or PDF)
  const processUploadedFile = (file: File) => {
    if (!file) return;
    setErrorMessage(null);

    const isImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|heic)$/i.test(file.name);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isImage && !isPdf) {
      setErrorMessage("Please upload an image file (PNG, JPG, WebP) or a PDF document.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage("File size exceeds 20MB limit. Please upload a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(",")[1];
      const mimeType = file.type || (isPdf ? "application/pdf" : "image/jpeg");

      setAttachment({
        name: file.name,
        mimeType,
        data: base64Data,
        previewUrl: isImage ? result : undefined,
        sizeBytes: file.size,
      });

      if (isPdf) {
        setInputMethod("pdf");
      } else {
        setInputMethod("photo");
      }
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processUploadedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processUploadedFile(e.dataTransfer.files[0]);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // OCR / Extract text from attached photo or PDF
  const handleExtractText = async () => {
    if (!attachment || !attachment.data) return;

    setIsExtractingText(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/irac/extract-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attachment }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Extraction failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data.extractedText) {
        setScenario(data.extractedText);
        setInputMethod("text");
        onSaveNotification("Extracted question text into editor!");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to extract text from document.");
    } finally {
      setIsExtractingText(false);
    }
  };

  // Load a preset scenario
  const handleLoadPreset = (preset: (typeof SAMPLE_PROBLEM_SCENARIOS)[0]) => {
    setScenario(preset.scenario);
    setSelectedSubject(preset.subject as LegalSubject);
    setAttachment(null);
    setInputMethod("text");
    setCurrentSolution(null);
    setGradeResult(null);
    setSavedSuccess(false);
  };

  // Load question from Umma Past Papers
  const handleLoadPastPaperQuestion = (
    paper: PastPaper,
    question: PastPaper["questions"][0],
    targetMode: "solve" | "grade"
  ) => {
    setScenario(`[${paper.courseCode} - ${paper.courseTitle} | ${paper.academicYear} | ${question.questionNumber}]\n\n${question.scenario}`);
    setSelectedSubject(paper.subject);
    setActiveMode(targetMode);
    setInputMethod("text");
    setAttachment(null);
    setCurrentSolution(null);
    setGradeResult(null);

    if (targetMode === "grade") {
      setStudentDraft("");
    }

    onSaveNotification(`Loaded ${paper.courseCode} ${question.questionNumber} into ${targetMode === "solve" ? "Solver" : "Grader"}!`);
  };

  // Save official model answer from past paper directly to vault
  const handleSavePastPaperModelAnswer = (
    paper: PastPaper,
    question: PastPaper["questions"][0]
  ) => {
    const newSolution: IRACSolution = {
      id: `irac-past-${paper.courseCode}-${question.id}`,
      title: `${paper.courseCode}: ${question.questionNumber} (${paper.academicYear})`,
      subject: paper.subject,
      scenario: question.scenario,
      rawMarkdown: question.modelIRACAnswer.rawMarkdown,
      issue: question.modelIRACAnswer.issue,
      rule: question.modelIRACAnswer.rule,
      application: question.modelIRACAnswer.application,
      conclusion: question.modelIRACAnswer.conclusion,
      createdAt: Date.now(),
      savedOffline: true,
      tags: [paper.courseCode, paper.subject, "Umma Past Paper", "Model Answer"],
    };

    saveIRACSolution(newSolution);
    onSaveNotification("Official Model Answer saved to Offline Vault!");
  };

  const toggleExpandAnswer = (qId: string) => {
    setExpandedAnswers((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Solve Scenario (Generate Model IRAC) - Supports Text, Photo & PDF
  const handleSolve = async () => {
    if (!scenario.trim() && (!attachment || !attachment.data)) {
      setErrorMessage("Please enter a legal problem scenario or upload a photo / PDF question.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSavedSuccess(false);

    try {
      const response = await fetch("/api/irac/solve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenario.trim(),
          subject: selectedSubject,
          customInstructions,
          attachment: attachment ? { mimeType: attachment.mimeType, data: attachment.data, name: attachment.name } : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      const rawText: string = data.result || "";

      const titleText = scenario.trim()
        ? scenario.slice(0, 50) + (scenario.length > 50 ? "..." : "")
        : attachment?.name
        ? `Analysis of ${attachment.name}`
        : "Exam Question Solution";

      const parsedSolution: IRACSolution = {
        id: `irac-${Date.now()}`,
        title: titleText,
        subject: selectedSubject,
        scenario: scenario.trim() || (attachment ? `[Attached Document: ${attachment.name}]` : "Exam Problem Question"),
        rawMarkdown: rawText,
        issue: extractSection(rawText, "ISSUE"),
        rule: extractSection(rawText, "RULE"),
        application: extractSection(rawText, "APPLICATION"),
        conclusion: extractSection(rawText, "CONCLUSION"),
        createdAt: Date.now(),
        savedOffline: true,
        tags: [selectedSubject, attachment ? "Multimodal IRAC" : "IRAC Model"],
      };

      setCurrentSolution(parsedSolution);
      saveIRACSolution(parsedSolution);
      setSavedSuccess(true);
      onSaveNotification("IRAC Solution saved to offline vault!");
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to solve problem scenario.");
    } finally {
      setIsLoading(false);
    }
  };

  // Grade Student's Draft
  const handleGrade = async () => {
    if (!scenario.trim()) {
      setErrorMessage("Please provide the problem scenario.");
      return;
    }
    if (!studentDraft.trim()) {
      setErrorMessage("Please draft your IRAC answer before submitting for grading.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/irac/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario,
          studentAnswer: studentDraft,
          subject: selectedSubject,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }

      const data: IRACGradeResult = await response.json();
      setGradeResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to grade IRAC submission.");
    } finally {
      setIsLoading(false);
    }
  };

  const extractSection = (text: string, sectionName: string): string => {
    const regex = new RegExp(
      `(?:#+|\\*\\*|__)?\\s*[📌📜⚖️🏁]*\\s*${sectionName}[\\s\\S]*?(?=(?:#+|\\*\\*|__)?\\s*[📌📜⚖️🏁]*\\s*(?:ISSUE|RULE|APPLICATION|CONCLUSION)|$)`,
      "i"
    );
    const match = text.match(regex);
    if (match && match[0]) {
      return match[0]
        .replace(
          new RegExp(`^(?:#+|\\*\\*|__)?\\s*[📌📜⚖️🏁]*\\s*${sectionName}[:\\s*#_]*`, "i"),
          ""
        )
        .trim();
    }
    return "";
  };

  const toggleSpeech = (textToSpeak?: string) => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const content = textToSpeak || currentSolution?.rawMarkdown || gradeResult?.summaryCritique || "";
    if (!content) return;

    speakWithEnglishFemaleVoice(content, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
    setIsSpeaking(true);
  };

  const handleCopy = (text?: string) => {
    const content = text || currentSolution?.rawMarkdown || "";
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered Umma Past Papers
  const filteredPastPapers = UMMA_UNIVERSITY_PAST_PAPERS.filter((paper) => {
    const matchesSubject = pastPaperSubjectFilter === "All" || paper.subject === pastPaperSubjectFilter;
    const matchesSearch =
      paper.courseCode.toLowerCase().includes(pastPaperSearch.toLowerCase()) ||
      paper.courseTitle.toLowerCase().includes(pastPaperSearch.toLowerCase()) ||
      paper.questions.some((q) => q.scenario.toLowerCase().includes(pastPaperSearch.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="pb-24 pt-6 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
      {/* Top Banner & Main Mode Toggle */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Academic Engine
            </span>
            <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
              Umma LL.B & CLE
            </span>
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
            IRAC Exam Solver & Past Papers Repository
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Type questions, upload exam photos, insert PDF papers, or explore official Umma University past exam papers with model answers
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveMode("solve")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
              activeMode === "solve"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Model IRAC Solver
          </button>
          <button
            onClick={() => setActiveMode("grade")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap ${
              activeMode === "grade"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Grade Student Draft
          </button>
          <button
            onClick={() => setActiveMode("pastpapers")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeMode === "pastpapers"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200/80"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Umma Past Papers</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input for Image/PDF Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,application/pdf"
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* MODE 1 & 2: SOLVER & GRADER                                              */}
      {/* ========================================================================= */}
      {activeMode !== "pastpapers" && (
        <>
          {/* Quick Preset Problem Scenarios Picker */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
                Umma University Quick Problem Scenarios:
              </span>
              <button
                onClick={() => setActiveMode("pastpapers")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>View Full Past Exam Papers</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
              {SAMPLE_PROBLEM_SCENARIOS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleLoadPreset(preset)}
                  className="flex-shrink-0 text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl p-3.5 w-72 transition-all shadow-2xs group"
                >
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                    {preset.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 truncate">
                    {preset.subject}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Input Form, Multimodal Upload & Result Output */}
            <div className="lg:col-span-2 space-y-6">
              {/* Question Input Panel */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
                {/* Module Selector & Directives */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Law Subject / Module
                    </label>
                    <select
                      value={selectedSubject}
                      onChange={(e) => setSelectedSubject(e.target.value as LegalSubject)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    >
                      {SUBJECTS.map((sub) => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Directives / Syllabus Focus (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Focus on Kadhis' Courts / Sec 106B Evidence Act / Cap 23"
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Input Method Selector Tabs (Type, Photo, PDF) */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <PenTool className="w-3.5 h-3.5 text-indigo-600" />
                      Exam Question Input Method:
                    </label>

                    {/* Native Hardware Quick Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCameraModalOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors shadow-2xs"
                        title="Open device camera to snap exam paper"
                      >
                        <Camera className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Live Camera Scan</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsVoiceModalOpen(true)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors shadow-2xs"
                        title="Dictate problem question using phone microphone"
                      >
                        <Mic className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Voice Dictate</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium mb-3">
                    <button
                      type="button"
                      onClick={() => setInputMethod("text")}
                      className={`py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                        inputMethod === "text"
                          ? "bg-white text-indigo-600 font-bold shadow-xs border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      <span>Type Question</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInputMethod("photo");
                        if (!attachment) fileInputRef.current?.click();
                      }}
                      className={`py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                        inputMethod === "photo"
                          ? "bg-white text-indigo-600 font-bold shadow-xs border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Photo Upload</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setInputMethod("pdf");
                        if (!attachment) fileInputRef.current?.click();
                      }}
                      className={`py-2 px-3 rounded-md flex items-center justify-center gap-1.5 transition-all ${
                        inputMethod === "pdf"
                          ? "bg-white text-indigo-600 font-bold shadow-xs border border-slate-200/80"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Insert PDF</span>
                    </button>
                  </div>
                </div>

                {/* Multimodal Upload Dropzone / Preview when photo or pdf is chosen */}
                {(inputMethod === "photo" || inputMethod === "pdf" || attachment) && (
                  <div className="space-y-3">
                    {!attachment ? (
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragOver(true);
                        }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          isDragOver
                            ? "border-indigo-500 bg-indigo-50/50"
                            : "border-slate-300 hover:border-indigo-400 bg-slate-50 hover:bg-slate-50/80"
                        }`}
                      >
                        <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                          {inputMethod === "pdf" ? (
                            <FileUp className="w-6 h-6" />
                          ) : (
                            <Camera className="w-6 h-6" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm font-bold text-slate-800">
                          {inputMethod === "pdf"
                            ? "Click or Drag & Drop PDF Question Paper"
                            : "Click to Snap / Upload Photo of Exam Question"}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Supports high-res camera photos (JPEG, PNG, WebP) and PDF documents up to 20MB
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {attachment.previewUrl ? (
                              <img
                                src={attachment.previewUrl}
                                alt="Exam Question"
                                className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg bg-red-50 border border-red-200 flex flex-col items-center justify-center text-red-600">
                                <FileText className="w-6 h-6" />
                                <span className="text-[9px] font-bold mt-0.5">PDF</span>
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded border border-indigo-200 uppercase">
                                  {attachment.mimeType.includes("pdf") ? "PDF Document" : "Exam Photo"}
                                </span>
                                {attachment.sizeBytes && (
                                  <span className="text-[10px] text-slate-400">
                                    {(attachment.sizeBytes / (1024 * 1024)).toFixed(2)} MB
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate max-w-xs sm:max-w-md">
                                {attachment.name}
                              </h4>
                              <p className="text-[11px] text-emerald-600 font-semibold mt-0.5 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Ready for AI vision & IRAC analysis
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-xs px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-medium"
                            >
                              Replace
                            </button>
                            <button
                              type="button"
                              onClick={removeAttachment}
                              className="text-xs p-1 rounded bg-white border border-slate-200 text-red-600 hover:bg-red-50"
                              title="Remove attachment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Action buttons for attached photo/pdf */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                          <button
                            type="button"
                            onClick={handleExtractText}
                            disabled={isExtractingText}
                            className="flex items-center gap-1.5 bg-white border border-indigo-300 hover:bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-lg text-xs transition-all shadow-2xs disabled:opacity-50"
                          >
                            {isExtractingText ? (
                              <>
                                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                <span>Extracting text with OCR...</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Extract Question Text to Editor</span>
                              </>
                            )}
                          </button>

                          <span className="text-[11px] text-slate-400">
                            or click <strong className="text-indigo-600">Solve with LexiMind IRAC</strong> below to analyze directly.
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Question Scenario Text Area */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Problem Scenario / Exam Hypothetical Text
                    </label>
                    {scenario && (
                      <button
                        type="button"
                        onClick={() => setScenario("")}
                        className="text-[11px] text-slate-400 hover:text-red-600"
                      >
                        Clear Text
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Type or paste the hypothetical exam question here, or upload a photo/PDF above to automatically extract it..."
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-sans leading-relaxed"
                  />
                </div>

                {/* Student Draft Area for Grade Mode */}
                {activeMode === "grade" && (
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                        <PenTool className="w-3.5 h-3.5" />
                        Your Drafted IRAC Answer
                      </label>
                      <span className="text-[11px] text-slate-400">
                        Draft Issue, Rule, Application & Conclusion
                      </span>
                    </div>
                    <textarea
                      rows={5}
                      placeholder="ISSUE: The legal issue is...&#10;RULE: Under Section 3(1) of the Law of Contract Act...&#10;APPLICATION: In Donoghue v Stevenson, the court held...&#10;CONCLUSION: Therefore, the claim will succeed..."
                      value={studentDraft}
                      onChange={(e) => setStudentDraft(e.target.value)}
                      className="w-full bg-slate-50 border border-indigo-200 rounded-lg p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-sans leading-relaxed"
                    />
                  </div>
                )}

                {errorMessage && (
                  <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-500" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-slate-400">
                    {attachment && <span className="text-indigo-600 font-semibold">📎 Document attached: {attachment.name}</span>}
                  </div>

                  {activeMode === "solve" ? (
                    <button
                      onClick={handleSolve}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Synthesizing Legal Rules...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{attachment ? "Solve IRAC from Document" : "Solve with LexiMind IRAC"}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleGrade}
                      disabled={isLoading}
                      className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Evaluating Exam Rubric...</span>
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4" />
                          <span>Grade My IRAC Submission</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Model Answer Breakdown Card */}
              {currentSolution && activeMode === "solve" && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        Hypothetical Analysis
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">
                        {currentSolution.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => toggleSpeech()}
                        className={`p-2 rounded-lg border transition-colors flex items-center gap-1.5 ${
                          isSpeaking
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                        }`}
                        title={isSpeaking ? "Stop Audio" : "Listen to IRAC with clear English female voice"}
                      >
                        {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span className="text-xs font-semibold hidden sm:inline">
                          {isSpeaking ? "Stop" : "Listen"}
                        </span>
                      </button>

                      <button
                        onClick={() => setIsVoiceSettingsOpen(true)}
                        className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:text-indigo-600 border border-slate-200 hover:bg-slate-100 transition-colors"
                        title="Calibrate Voice Pitch & Pace"
                      >
                        <Sliders className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleCopy()}
                        className="p-2 rounded-lg bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-semibold"
                        title="Copy IRAC"
                      >
                        {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 IRAC Blocks */}
                  <div className="space-y-6">
                    {/* 📌 ISSUE */}
                    <div className="border-l-4 border-indigo-500 pl-4 py-0.5">
                      <h4 className="text-xs font-extrabold text-indigo-600 uppercase tracking-tighter mb-1.5 flex items-center gap-1">
                        📌 ISSUE
                      </h4>
                      <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-sans">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentSolution.issue || extractSection(currentSolution.rawMarkdown, "ISSUE")}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* 📜 RULE */}
                    <div className="border-l-4 border-slate-400 pl-4 py-0.5">
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-tighter mb-1.5 flex items-center gap-1">
                        📜 RULE
                      </h4>
                      <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-sans">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentSolution.rule || extractSection(currentSolution.rawMarkdown, "RULE")}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* ⚖️ APPLICATION */}
                    <div className="border-l-4 border-slate-400 pl-4 py-0.5">
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-tighter mb-1.5 flex items-center gap-1">
                        ⚖️ APPLICATION
                      </h4>
                      <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed font-sans">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentSolution.application || extractSection(currentSolution.rawMarkdown, "APPLICATION")}
                        </ReactMarkdown>
                      </div>
                    </div>

                    {/* 🏁 CONCLUSION */}
                    <div className="border-l-4 border-emerald-500 pl-4 py-0.5">
                      <h4 className="text-xs font-extrabold text-emerald-600 uppercase tracking-tighter mb-1.5 flex items-center gap-1">
                        🏁 CONCLUSION
                      </h4>
                      <div className="prose prose-sm max-w-none text-slate-800 font-medium leading-relaxed font-sans">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {currentSolution.conclusion || extractSection(currentSolution.rawMarkdown, "CONCLUSION")}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grader Assessment Card */}
              {gradeResult && activeMode === "grade" && (
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        LL.B Exam Rubric
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mt-1">
                        CLE Examiner Grading Assessment
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600">
                        {gradeResult.overallScore}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Grade {gradeResult.letterGrade}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {gradeResult.summaryCritique}
                  </div>

                  {/* Rubric Breakdown Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-800">📌 Issue Formulation</span>
                        <span className="text-xs font-bold text-indigo-600">{gradeResult.rubric.issueScore}/20</span>
                      </div>
                      <p className="text-xs text-slate-600">{gradeResult.rubric.issueFeedback}</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-800">📜 Statutory Rules</span>
                        <span className="text-xs font-bold text-indigo-600">{gradeResult.rubric.ruleScore}/25</span>
                      </div>
                      <p className="text-xs text-slate-600">{gradeResult.rubric.ruleFeedback}</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-800">⚖️ Factual Application</span>
                        <span className="text-xs font-bold text-indigo-600">{gradeResult.rubric.applicationScore}/35</span>
                      </div>
                      <p className="text-xs text-slate-600">{gradeResult.rubric.applicationFeedback}</p>
                    </div>

                    <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-slate-800">🏁 Conclusion Clarity</span>
                        <span className="text-xs font-bold text-indigo-600">{gradeResult.rubric.conclusionScore}/20</span>
                      </div>
                      <p className="text-xs text-slate-600">{gradeResult.rubric.conclusionFeedback}</p>
                    </div>
                  </div>

                  {gradeResult.missingStatutesOrCases?.length > 0 && (
                    <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                      <h4 className="font-bold text-xs text-amber-800 mb-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Missing Statutory Sections & Precedents to Cite:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-700">
                        {gradeResult.missingStatutesOrCases.map((item, idx) => (
                          <li key={idx} className="font-medium">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Statutory Index & Past Papers Shortcut */}
            <div className="space-y-6">
              {/* Umma Past Papers Card Shortcut */}
              <div className="bg-indigo-900 text-white rounded-xl p-5 shadow-sm border border-indigo-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-800 text-indigo-200">
                    Official Repository
                  </span>
                  <GraduationCap className="w-5 h-5 text-indigo-300" />
                </div>
                <h3 className="font-serif font-bold text-base text-white">
                  Umma University Past Papers & Model Solutions
                </h3>
                <p className="text-xs text-indigo-200 leading-relaxed">
                  Access official LLB 111, SHAR 202, LLB 122, and LLB 211 examination papers with complete IRAC answers and marking rubrics.
                </p>
                <button
                  onClick={() => setActiveMode("pastpapers")}
                  className="w-full bg-white text-indigo-900 hover:bg-indigo-50 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Umma Past Papers</span>
                </button>
              </div>

              {/* Statutory Quick Index */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Statutory Quick Index
                </h4>
                <ul className="space-y-2.5">
                  <li className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                      S.3
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">Law of Contract Act (Cap 23)</div>
                      <div className="text-slate-500">Formalities of contracts & electronic writing</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0">
                      A.170
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">Constitution of Kenya (2010)</div>
                      <div className="text-slate-500">Kadhis' Courts jurisdiction in Muslim law</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0">
                      S.203
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">Penal Code (Cap 63)</div>
                      <div className="text-slate-500">Murder & Malice Aforethought</div>
                    </div>
                  </li>

                  <li className="flex items-start gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-700 flex-shrink-0">
                      S.106B
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-slate-800">Evidence Act (Cap 80)</div>
                      <div className="text-slate-500">Admissibility of electronic records</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: UMMA UNIVERSITY PAST PAPERS REPOSITORY & MODEL ANSWERS           */}
      {/* ========================================================================= */}
      {activeMode === "pastpapers" && (
        <div className="space-y-6">
          {/* Past Papers Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  Umma University School of Law & Shariah
                </span>
                <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-900 mt-1">
                  Examination Papers & Official Model IRAC Solutions
                </h2>
              </div>

              <button
                onClick={() => setActiveMode("solve")}
                className="self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 flex items-center gap-1"
              >
                <span>← Back to Custom Solver</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Search past papers by course code (e.g. LLB 111, SHAR 202) or keywords..."
                  value={pastPaperSearch}
                  onChange={(e) => setPastPaperSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <select
                  value={pastPaperSubjectFilter}
                  onChange={(e) => setPastPaperSubjectFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                >
                  <option value="All">All Law Subjects ({UMMA_UNIVERSITY_PAST_PAPERS.length} Papers)</option>
                  {SUBJECTS.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* List of Past Papers */}
          <div className="space-y-6">
            {filteredPastPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs space-y-4"
              >
                {/* Paper Header */}
                <div className="bg-slate-900 text-white p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-3">
                    <div>
                      <div className="text-[11px] font-mono text-indigo-400 uppercase font-semibold">
                        {paper.university} • {paper.faculty}
                      </div>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-white mt-0.5">
                        {paper.courseCode}: {paper.courseTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {paper.academicYear}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {paper.examDuration}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 italic">
                    <strong>Instructions:</strong> {paper.instructions}
                  </div>
                </div>

                {/* Paper Questions List */}
                <div className="p-5 sm:p-6 space-y-6 pt-0">
                  {paper.questions.map((question) => {
                    const isExpanded = Boolean(expandedAnswers[question.id]);

                    return (
                      <div
                        key={question.id}
                        className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4"
                      >
                        {/* Question Header & Action Toolbar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                          <div className="flex items-center gap-2">
                            <span className="bg-indigo-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-md font-mono">
                              {question.questionNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-600">
                              [{question.marks} Marks]
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              onClick={() => handleLoadPastPaperQuestion(paper, question, "solve")}
                              className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 flex items-center gap-1"
                              title="Load into solver to generate custom variation"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Load into Solver</span>
                            </button>

                            <button
                              onClick={() => handleLoadPastPaperQuestion(paper, question, "grade")}
                              className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1"
                              title="Practice drafting your answer and get graded"
                            >
                              <PenTool className="w-3.5 h-3.5" />
                              <span>Practice & Grade</span>
                            </button>

                            <button
                              onClick={() => handleSavePastPaperModelAnswer(paper, question)}
                              className="text-xs font-semibold px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1"
                              title="Save official solution to offline vault"
                            >
                              <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Save to Vault</span>
                            </button>
                          </div>
                        </div>

                        {/* Question Scenario Text */}
                        <div className="text-xs sm:text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line bg-white p-4 rounded-lg border border-slate-200">
                          {question.scenario}
                        </div>

                        {/* Model Answer Expand/Collapse Button */}
                        <div>
                          <button
                            onClick={() => toggleExpandAnswer(question.id)}
                            className="w-full flex items-center justify-between p-3 rounded-lg bg-indigo-50/80 border border-indigo-200 hover:bg-indigo-100 transition-colors text-xs font-bold text-indigo-900"
                          >
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                              <span>{isExpanded ? "Hide Official Model IRAC Solution & Marking Rubric" : "View Official Model IRAC Solution & Marking Rubric"}</span>
                            </span>
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>

                          {/* Expanded Official Model Answer */}
                          {isExpanded && (
                            <div className="mt-3 bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5">
                              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                                  <FileCheck className="w-4 h-4 text-emerald-600" />
                                  Examiner Model IRAC Breakdown
                                </span>

                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleSpeech(question.modelIRACAnswer.rawMarkdown)}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs"
                                    title="Listen to Model Answer"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleCopy(question.modelIRACAnswer.rawMarkdown)}
                                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs flex items-center gap-1 font-semibold"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copy</span>
                                  </button>
                                </div>
                              </div>

                              {/* 4 IRAC Sections */}
                              <div className="space-y-4">
                                <div className="border-l-4 border-indigo-500 pl-3.5 py-0.5">
                                  <h5 className="text-[11px] font-extrabold text-indigo-600 uppercase tracking-wider mb-1">
                                    📌 ISSUE
                                  </h5>
                                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                    {question.modelIRACAnswer.issue}
                                  </p>
                                </div>

                                <div className="border-l-4 border-slate-400 pl-3.5 py-0.5">
                                  <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                    📜 RULE
                                  </h5>
                                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {question.modelIRACAnswer.rule}
                                    </ReactMarkdown>
                                  </div>
                                </div>

                                <div className="border-l-4 border-slate-400 pl-3.5 py-0.5">
                                  <h5 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider mb-1">
                                    ⚖️ APPLICATION
                                  </h5>
                                  <div className="text-xs sm:text-sm text-slate-700 leading-relaxed prose prose-sm max-w-none">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                      {question.modelIRACAnswer.application}
                                    </ReactMarkdown>
                                  </div>
                                </div>

                                <div className="border-l-4 border-emerald-500 pl-3.5 py-0.5">
                                  <h5 className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider mb-1">
                                    🏁 CONCLUSION
                                  </h5>
                                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                                    {question.modelIRACAnswer.conclusion}
                                  </p>
                                </div>
                              </div>

                              {/* Examiner Marking Rubric */}
                              {question.examinerRubric && question.examinerRubric.length > 0 && (
                                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
                                  <h5 className="text-xs font-bold text-emerald-800 mb-1.5 flex items-center gap-1.5">
                                    <Award className="w-3.5 h-3.5 text-emerald-700" />
                                    Official Marking Rubric & Mark Distribution:
                                  </h5>
                                  <ul className="space-y-1 text-xs text-slate-700">
                                    {question.examinerRubric.map((item, rIdx) => (
                                      <li key={rIdx} className="flex items-start gap-1.5">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hardware Modals: Camera Scanner & Voice Dictator */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCameraCapture}
      />

      <VoiceRecorderModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onTranscriptReady={handleVoiceTranscript}
      />

      <SpeechSettingsModal
        isOpen={isVoiceSettingsOpen}
        onClose={() => setIsVoiceSettingsOpen(false)}
      />
    </div>
  );
};
