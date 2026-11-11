import { apiFetch } from "../utils/api";
import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Sparkles,
  BookMarked,
  CheckCircle,
  XCircle,
  HelpCircle,
  Copy,
  CheckCircle2,
  Volume2,
  VolumeX,
  RotateCw,
  Award,
  Upload,
  Image as ImageIcon,
  FileUp,
  X,
  ArrowRight,
  Check,
  BrainCircuit,
  BookOpen,
  Scale,
  GraduationCap,
  Sliders,
  Flame,
  Bookmark,
  Share2,
  Download,
  Eye,
  RefreshCw,
  Camera,
  Mic,
  Smartphone,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { NoteSynthesis, LegalSubject, QuizQuestion, UploadedAttachment } from "../types";
import { getStoredSyntheses, saveNoteSynthesis } from "../utils/storage";
import { CameraCaptureModal } from "./CameraCaptureModal";
import { VoiceRecorderModal } from "./VoiceRecorderModal";
import { speakWithEnglishFemaleVoice, stopSpeech } from "../utils/speechSynthesis";

const TOPIC_PRESETS = [
  {
    title: "Doctrine of Frustration (Law of Contract Cap 23)",
    subject: "Law of Contract",
    wordCount: 300,
    notes: `Frustration occurs when an unforeseen event subsequent to contract formation renders performance legally impossible, physically impossible, or radically different from what was contemplated. 
Statutory Basis: Law of Contract Act Cap 23 and Law Reform (Frustrated Contracts) Act 1943.
Leading cases: Taylor v Caldwell (destruction of subject matter), Krell v Henry (cancellation of coronation procession), Davis Contractors v Fareham UDC (mere increase in expense or difficulty is NOT frustration).
Key elements: Event must be supervening (after formation), without default of either party (no self-induced frustration - Ocean Tramp Tankers v V/O Sovfracht), and completely outside reasonable contemplation.
Effects of frustration: Automatically discharges both parties from future obligations; advance deposits recoverable under Law Reform (Frustrated Contracts) Act.`,
  },
  {
    title: "Kadhis' Court Jurisdiction & Mirath (Islamic Succession)",
    subject: "Islamic Family Law & Succession (Mirath)",
    wordCount: 350,
    notes: `Article 170(5) of the Constitution of Kenya 2010 establishes the Kadhis' Court jurisdiction strictly over questions of Muslim law relating to personal status, marriage, divorce or inheritance/succession where all parties profess Islam and submit to jurisdiction.
Section 5 of Kadhis' Courts Act (Cap 11).
Law of Succession Act Cap 160 Section 2(3) & 2(4) expressly excludes deceased Muslims from the application of Cap 160.
Quranic Heir Categories (Ashab al-Faraid / Sharers): Fixed Quranic fractional shares (1/2, 1/4, 1/8, 2/3, 1/3, 1/6) allocated to spouse, parents, daughters, grandmothers.
Residuaries (Asabah): Male agnates who take whatever estate remains after Quranic sharers are satisfied (Sons, brothers, paternal uncles).
Disqualifications from Inheritance: Difference of religion (apostasy), unlawful killing of the propositus (Qatl).`,
  },
  {
    title: "Admissibility of Electronic Evidence (Evidence Act Cap 80)",
    subject: "Law of Evidence",
    wordCount: 300,
    notes: `Section 106B of the Evidence Act (Cap 80) governs admissibility of electronic records, CCTV, SMS, emails, and computer printouts in Kenya.
Mandatory Requirements under Sec 106B(4): An electronic record is NOT admissible unless accompanied by a certificate identifying the electronic record, describing the device used, stating that the computer was operating properly during the relevant period, and signed by a person occupying a responsible official position in relation to the device.
Leading Kenyan Precedents: Republic v Philip Kilonzo, County Government of Mombasa v KRA (electronic tax log certificates), Supreme Court Presidential Election Petition 2017 (IEBC server logs and certification).
Non-compliance with Section 106B renders the electronic evidence strictly inadmissible as held in Peter Waweru v Republic.`,
  },
  {
    title: "Fair Administrative Action Act 2015 & Judicial Review",
    subject: "Constitutional Law",
    wordCount: 350,
    notes: `Article 47 of the Constitution of Kenya 2010 codifies the right to fair administrative action: expeditious, efficient, lawful, reasonable and procedurally fair.
Codified by Fair Administrative Action Act No. 4 of 2015 (FAAA).
Grounds of Judicial Review under Sec 7 FAAA: Lack of jurisdiction, Ultra Vires, Procedural impropriety (violation of natural justice / audi alteram partem / rule against bias), Unreasonableness (Wednesbury unreasonableness), Legitimate expectation, abuse of power.
Remedies under Sec 11 FAAA & Order 53 Civil Procedure Rules: Certiorari (quashing), Prohibition (preventing future unlawful act), Mandamus (compelling public duty), Injunction, Declaratory orders, and Damages.`,
  },
];

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

const WORD_COUNT_PRESETS = [
  { label: "150 words", value: 150, description: "Ultra-Brief Pocket Card" },
  { label: "300 words", value: 300, description: "Standard Exam Synthesis" },
  { label: "500 words", value: 500, description: "Detailed Study Digest" },
  { label: "800 words", value: 800, description: "Full Topic Mastery" },
];

export const NoteSynthesizerView = ({
  onSaveNotification,
}: {
  onSaveNotification: (msg: string) => void;
}) => {
  // Input Method: "topic" | "upload" | "paste"
  const [inputMode, setInputMode] = useState<"topic" | "upload" | "paste">("topic");

  // Form State
  const [selectedSubject, setSelectedSubject] = useState<LegalSubject>("Law of Contract");
  const [topicTitle, setTopicTitle] = useState("");
  const [rawLectureNotes, setRawLectureNotes] = useState("");

  // Specified Target Word Count State
  const [targetWordCount, setTargetWordCount] = useState<number>(300);
  const [isCustomWordCount, setIsCustomWordCount] = useState(false);
  const [customWordInput, setCustomWordInput] = useState("300");

  // Document Attachment (PDF or Screenshot / Photo)
  const [attachment, setAttachment] = useState<UploadedAttachment | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Synthesizer State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active Synthesis Result
  const [synthesis, setSynthesis] = useState<NoteSynthesis | null>(() => {
    const saved = getStoredSyntheses();
    return saved.length > 0 ? saved[0] : null;
  });

  // Post-Reading Workflow View State: "reading" | "quiz" | "completed"
  const [readingStage, setReadingStage] = useState<"reading" | "quiz" | "completed">("reading");

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qIndex: number]: number }>({});
  const [showExplanations, setShowExplanations] = useState<{ [qIndex: number]: boolean }>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [isRegeneratingQuiz, setIsRegeneratingQuiz] = useState(false);

  // Audio Speech & Copy
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Hardware Modals
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  // Handle Camera Capture
  const handleCameraCapture = (base64Image: string) => {
    const rawData = base64Image.split(",")[1] || base64Image;
    setAttachment({
      name: `Lecture_Snap_${new Date().toISOString().slice(11, 19).replace(/:/g, "-")}.jpg`,
      mimeType: "image/jpeg",
      data: rawData,
      previewUrl: base64Image,
      sizeBytes: Math.round((rawData.length * 3) / 4),
    });
    setInputMode("upload");
    onSaveNotification("Camera capture added! Ready to synthesize.");
  };

  // Handle Voice Transcript
  const handleVoiceTranscript = (transcript: string) => {
    if (inputMode === "topic") {
      setTopicTitle((prev) => (prev ? `${prev} ${transcript}` : transcript));
    } else {
      setRawLectureNotes((prev) => (prev ? `${prev}\n${transcript}` : transcript));
      setInputMode("paste");
    }
    onSaveNotification("Voice dictation transcribed!");
  };

  // Sync custom word input with targetWordCount
  const handleSelectWordCountPreset = (count: number) => {
    setTargetWordCount(count);
    setIsCustomWordCount(false);
    setCustomWordInput(count.toString());
  };

  const handleCustomWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomWordInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 20) {
      setTargetWordCount(num);
    }
  };

  // Process File Uploads (PDF or Images)
  const processUploadedFile = (file: File) => {
    if (!file) return;
    setErrorMessage(null);

    const isImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|heic)$/i.test(file.name);
    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isImage && !isPdf) {
      setErrorMessage("Please upload an image screenshot (PNG, JPG, WebP) or a PDF document.");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage("File size exceeds 25MB limit. Please upload a smaller file.");
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

      if (!topicTitle.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setTopicTitle(cleanName);
      }
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read the file. Please try again.");
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

  const handleSelectPreset = (preset: (typeof TOPIC_PRESETS)[0]) => {
    setTopicTitle(preset.title);
    setSelectedSubject(preset.subject as LegalSubject);
    setRawLectureNotes(preset.notes);
    setTargetWordCount(preset.wordCount || 300);
    setCustomWordInput((preset.wordCount || 300).toString());
    setIsCustomWordCount(false);
    setAttachment(null);
    setInputMode("paste");
    setReadingStage("reading");
    setSelectedAnswers({});
    setShowExplanations({});
    setQuizScore(null);
  };

  // Synthesizer Submission Handler
  const handleSynthesize = async () => {
    const hasTopic = topicTitle.trim().length > 0;
    const hasNotes = rawLectureNotes.trim().length > 0;
    const hasFile = Boolean(attachment && attachment.data);

    if (!hasTopic && !hasNotes && !hasFile) {
      setErrorMessage("Please enter a legal topic, paste lecture notes, or upload a PDF / screenshot document.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSelectedAnswers({});
    setShowExplanations({});
    setQuizScore(null);
    setReadingStage("reading");

    try {
      const response = await apiFetch("/api/synthesizer/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawNotes: rawLectureNotes,
          subject: selectedSubject,
          topic: topicTitle || (attachment ? attachment.name : "Legal Lecture Synthesis"),
          targetWordCount: targetWordCount || 300,
          attachment: attachment ? { name: attachment.name, mimeType: attachment.mimeType, data: attachment.data } : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned status ${response.status}`);
      }

      const data = await response.json();
      const newSynthesis: NoteSynthesis = {
        id: `synth-${Date.now()}`,
        title: data.title || topicTitle || "Legal Synthesis",
        subject: selectedSubject,
        topic: topicTitle || "Coursework Revision",
        summaryContent: data.summaryContent || "",
        targetWordCount: targetWordCount || 300,
        actualWordCount: data.actualWordCount || (data.summaryContent ? data.summaryContent.split(/\s+/).length : 0),
        sourceType: attachment ? (attachment.mimeType.includes("pdf") ? "pdf" : "screenshot") : hasNotes ? "pasted_text" : "topic",
        highYieldTakeaways: data.highYieldTakeaways || [],
        statutoryIndex: data.statutoryIndex || [],
        landmarkCases: data.landmarkCases || [],
        activeRecallQuiz: data.activeRecallQuiz || [],
        quickSummaryCard: data.quickSummaryCard || "",
        createdAt: Date.now(),
        savedOffline: true,
      };

      setSynthesis(newSynthesis);
      saveNoteSynthesis(newSynthesis);
      onSaveNotification(`Synthesized into ~${newSynthesis.actualWordCount || targetWordCount} words & saved to Vault!`);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Failed to synthesize legal material.");
    } finally {
      setIsLoading(false);
    }
  };

  // Speech Toggle
  const toggleSpeech = () => {
    if (!synthesis) return;

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${synthesis.title}. Subject: ${synthesis.subject}. Summary: ${synthesis.quickSummaryCard}. ${synthesis.summaryContent || synthesis.highYieldTakeaways.join(". ")}`;
    
    speakWithEnglishFemaleVoice(textToRead, {
      onEnd: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
    setIsSpeaking(true);
  };

  // Copy Summary & Notes
  const handleCopySummary = () => {
    if (!synthesis) return;
    const text = `# ${synthesis.title} (${synthesis.subject})\nTarget Length: ${synthesis.targetWordCount || targetWordCount} words\n\n${synthesis.summaryContent || synthesis.quickSummaryCard}\n\nHIGH-YIELD TAKEAWAYS:\n${synthesis.highYieldTakeaways.map((t) => `• ${t}`).join("\n")}\n\nSTATUTES:\n${synthesis.statutoryIndex.map((s) => `• ${s.act} (${s.section}): ${s.summary}`).join("\n")}\n\nLANDMARK PRECEDENTS:\n${synthesis.landmarkCases.map((c) => `• ${c.citation} — ${c.principle}`).join("\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Quiz Interaction Handlers
  const handleOptionSelect = (questionIndex: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [questionIndex]: true }));
  };

  const handleScoreQuiz = () => {
    if (!synthesis || !synthesis.activeRecallQuiz.length) return;
    let score = 0;
    synthesis.activeRecallQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        score += 1;
      }
    });
    setQuizScore(score);
  };

  const handleRegenerateQuiz = async () => {
    if (!synthesis) return;
    setIsRegeneratingQuiz(true);
    try {
      const res = await apiFetch("/api/synthesizer/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: synthesis.title,
          subject: synthesis.subject,
          notesContent: `${synthesis.quickSummaryCard}\n${synthesis.summaryContent || ""}\n${synthesis.highYieldTakeaways.join("\n")}`,
          numQuestions: 5,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          const updated: NoteSynthesis = {
            ...synthesis,
            activeRecallQuiz: data.questions,
          };
          setSynthesis(updated);
          saveNoteSynthesis(updated);
          setSelectedAnswers({});
          setShowExplanations({});
          setQuizScore(null);
          onSaveNotification("Generated a fresh active recall quiz set!");
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegeneratingQuiz(false);
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 sm:px-8 max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Smart Note Synthesizer & Quiz Engine
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
              Custom Word Budget Summarizer
            </span>
          </div>
          <h1 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
            Intelligent Legal Note Summarizer & Active Recall
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Type any topic, upload a PDF/screenshot, or paste lecture notes. Synthesize into your exact target word count, then test yourself with an active recall quiz!
          </p>
        </div>

        {/* View Toggle Tabs if synthesis exists */}
        {synthesis && (
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => setReadingStage("reading")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                readingStage === "reading"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Read Notes ({synthesis.actualWordCount || synthesis.targetWordCount || 300}w)</span>
            </button>
            <button
              onClick={() => setReadingStage("quiz")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                readingStage === "quiz"
                  ? "bg-white text-emerald-700 shadow-xs border border-slate-200/80"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Interactive Quiz ({synthesis.activeRecallQuiz.length} Qs)</span>
            </button>
          </div>
        )}
      </div>

      {/* Preset Topics Bar */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <BookMarked className="w-3.5 h-3.5 text-indigo-600" />
            Quick-Load High-Yield Law Topics:
          </span>
          <span className="text-[11px] font-normal text-slate-400">Click to preload</span>
        </div>
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
          {TOPIC_PRESETS.map((preset, i) => (
            <button
              key={i}
              onClick={() => handleSelectPreset(preset)}
              className="flex-shrink-0 text-left bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl p-3 w-64 transition-all shadow-2xs group"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 truncate">
                {preset.title}
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                <span className="truncate">{preset.subject}</span>
                <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-indigo-700 font-semibold">
                  {preset.wordCount}w
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Configuration Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
        {/* Subject & Input Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          {/* Subject Dropdown */}
          <div className="sm:w-72">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Subject Area / Law Module:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value as LegalSubject)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Input Method Selector Tabs: Topic vs Upload vs Paste */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Input Method:
              </label>

              {/* Hardware Quick Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition-colors shadow-2xs"
                  title="Snap photo of textbook, lecture handout, or notes"
                >
                  <Camera className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Scan Notes</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVoiceModalOpen(true)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors shadow-2xs"
                  title="Dictate lecture or topic via microphone"
                >
                  <Mic className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Voice Dictate</span>
                </button>
              </div>
            </div>

            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setInputMode("topic")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  inputMode === "topic"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Type Topic</span>
              </button>

              <button
                onClick={() => setInputMode("upload")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  inputMode === "upload"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF / Screenshot</span>
              </button>

              <button
                onClick={() => setInputMode("paste")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  inputMode === "paste"
                    ? "bg-white text-indigo-700 shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Paste Document</span>
              </button>
            </div>
          </div>
        </div>

        {/* MODE 1: TYPE TOPIC */}
        {inputMode === "topic" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Topic Title or Specific Legal Question:
              </label>
              <input
                type="text"
                placeholder="e.g. Consideration and Promissory Estoppel in Kenyan Contract Law Cap 23..."
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Optional Sub-Areas or Specific Focus:
              </label>
              <input
                type="text"
                placeholder="e.g. Include exceptions under High Trees case and Central London Property Trust..."
                value={rawLectureNotes}
                onChange={(e) => setRawLectureNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* MODE 2: UPLOAD PDF OR SCREENSHOT */}
        {inputMode === "upload" && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,application/pdf"
              className="hidden"
            />

            {!attachment ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? "border-indigo-500 bg-indigo-50/50 scale-[0.99]"
                    : "border-slate-300 hover:border-indigo-400 hover:bg-slate-50/70"
                }`}
              >
                <div className="flex justify-center gap-2 mb-2 text-indigo-600">
                  <FileUp className="w-8 h-8" />
                  <ImageIcon className="w-8 h-8" />
                </div>
                <div className="font-bold text-xs sm:text-sm text-slate-800">
                  Click to upload or drag & drop lecture document
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Supports <strong>PDF lecture slides, textbook pages, case transcripts</strong> or <strong>photo screenshots</strong> (PNG, JPG up to 25MB)
                </p>
              </div>
            ) : (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {attachment.previewUrl ? (
                    <img
                      src={attachment.previewUrl}
                      alt="Preview"
                      className="w-12 h-12 object-cover rounded-lg border border-indigo-200"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      PDF
                    </div>
                  )}
                  <div>
                    <div className="text-xs font-bold text-slate-900 truncate max-w-xs sm:max-w-md">
                      {attachment.name}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{attachment.mimeType}</span>
                      <span>•</span>
                      <span>{attachment.sizeBytes ? `${Math.round(attachment.sizeBytes / 1024)} KB` : "Attached"}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAttachment(null)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                  title="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Topic Title / Context (Optional):
              </label>
              <input
                type="text"
                placeholder="e.g. Unit 3 Lecture Slides - Vicarious Liability & Salmond Test"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
          </div>
        )}

        {/* MODE 3: PASTE DOCUMENT / LECTURE NOTES */}
        {inputMode === "paste" && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Topic Title:
              </label>
              <input
                type="text"
                placeholder="e.g. Defamation Law: Libel vs Slander & Defenses"
                value={topicTitle}
                onChange={(e) => setTopicTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Paste Document / Lecture Notes / Chapter Content:
              </label>
              <textarea
                rows={5}
                placeholder="Paste the full text of your lecture slides, notes, case judgment, or textbook chapter here..."
                value={rawLectureNotes}
                onChange={(e) => setRawLectureNotes(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white font-sans leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* SPECIFIED WORD COUNT CONTROLS (CRITICAL LEARNER REQUIREMENT) */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Target Summary Length (Learner Specified Words):
              </span>
            </div>
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 border border-indigo-200">
              Target: ~{targetWordCount} words
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {WORD_COUNT_PRESETS.map((preset) => {
              const isSelected = !isCustomWordCount && targetWordCount === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleSelectWordCountPreset(preset.value)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs font-semibold"
                      : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  <div className="text-xs font-bold">{preset.label}</div>
                  <div className={`text-[10px] mt-0.5 ${isSelected ? "text-indigo-100" : "text-slate-500"}`}>
                    {preset.description}
                  </div>
                </button>
              );
            })}

            {/* Custom Word Input */}
            <div
              className={`p-2 rounded-lg border transition-all ${
                isCustomWordCount
                  ? "bg-indigo-50 border-indigo-500 text-indigo-950"
                  : "bg-slate-50 border-slate-200 text-slate-700"
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Custom Words:
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min="50"
                  max="3000"
                  step="50"
                  value={customWordInput}
                  onFocus={() => setIsCustomWordCount(true)}
                  onChange={handleCustomWordChange}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g. 450"
                />
                <span className="text-[10px] text-slate-500 font-bold">w</span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
            {errorMessage}
          </div>
        )}

        {/* Submit Action Button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={handleSynthesize}
            disabled={isLoading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing into ~{targetWordCount} words...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Synthesize into {targetWordCount} Words & Generate Revision Set</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SYNTHESIZED RESULTS & WORKFLOW */}
      {synthesis && (
        <div className="space-y-6">
          {/* ================= STAGE 1: READING SYNTHESIZED NOTES ================= */}
          {readingStage === "reading" && (
            <div className="space-y-6">
              {/* Header Meta Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {synthesis.subject}
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Word Count: {synthesis.actualWordCount || synthesis.targetWordCount} words (Target: {synthesis.targetWordCount || 300}w)
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Source: {synthesis.sourceType || "Topic"}
                      </span>
                    </div>
                    <h2 className="font-serif font-bold text-lg sm:text-2xl text-slate-900 mt-2">
                      {synthesis.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={toggleSpeech}
                      className={`p-2 rounded-lg border text-xs transition-colors ${
                        isSpeaking
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                      title="Read summary out loud"
                    >
                      {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={handleCopySummary}
                      className="px-3 py-2 rounded-lg bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? "Copied" : "Copy Notes"}</span>
                    </button>
                  </div>
                </div>

                {/* 2-Sentence Quick Executive Recall */}
                <div className="mt-4 bg-indigo-50/60 border border-indigo-200 rounded-lg p-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 mb-1 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-indigo-600" />
                    Rapid Exam Memory Hook:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                    {synthesis.quickSummaryCard}
                  </p>
                </div>
              </div>

              {/* Comprehensive Synthesized Notes (Tailored to Specified Word Count) */}
              {synthesis.summaryContent && (
                <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      Synthesized Study Guide ({synthesis.actualWordCount || 300} words)
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      Learner Target: ~{synthesis.targetWordCount || 300} words
                    </span>
                  </div>

                  <div className="prose prose-sm max-w-none text-slate-800 leading-relaxed text-xs sm:text-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {synthesis.summaryContent}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              {/* High-Yield Takeaways & Core Elements */}
              <div className="bg-white border-l-4 border-emerald-500 border border-slate-200 rounded-xl p-5 shadow-xs">
                <h3 className="font-serif font-bold text-xs sm:text-sm text-emerald-800 mb-3 flex items-center uppercase tracking-wider gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  High-Yield Takeaways & Core Elements
                </h3>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {synthesis.highYieldTakeaways.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="text-emerald-600 font-bold mt-0.5">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Statutory Memorization Index & Landmark Cases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Statutes */}
                <div className="bg-white border-l-4 border-slate-400 border border-slate-200 rounded-xl p-5 shadow-xs">
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-slate-800 mb-3 flex items-center uppercase tracking-wider gap-1.5">
                    <Scale className="w-4 h-4 text-slate-600" />
                    Statutory Memorization Index
                  </h3>
                  <div className="space-y-2.5">
                    {synthesis.statutoryIndex.map((stat, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-indigo-700 font-mono">
                            {stat.section}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold px-2 py-0.5 rounded bg-white border border-slate-200 truncate max-w-[150px]">
                            {stat.act}
                          </span>
                        </div>
                        <p className="text-slate-700 mt-1">{stat.summary}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Landmark Precedents */}
                <div className="bg-white border-l-4 border-indigo-400 border border-slate-200 rounded-xl p-5 shadow-xs">
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-indigo-800 mb-3 flex items-center uppercase tracking-wider gap-1.5">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    Landmark Precedents to Cite
                  </h3>
                  <div className="space-y-2.5">
                    {synthesis.landmarkCases.map((c, idx) => (
                      <div key={idx} className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-xs">
                        <span className="font-serif font-bold text-slate-900 block">
                          {c.citation}
                        </span>
                        <p className="text-slate-600 mt-1 leading-relaxed">
                          <strong>Ratio:</strong> {c.principle}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* POST-READING DECISION PROMPT CARD (CORE USER REQUIREMENT) */}
              <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-5 border border-indigo-950">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-white">
                      Finished Reading & Reviewing?
                    </h3>
                    <p className="text-xs text-slate-300">
                      Solidify your legal memory. Choose your next step:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Option 1: Try an Interactive Quiz */}
                  <button
                    onClick={() => {
                      setReadingStage("quiz");
                      setSelectedAnswers({});
                      setShowExplanations({});
                      setQuizScore(null);
                    }}
                    className="flex flex-col text-left p-5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white transition-all shadow-lg hover:shadow-indigo-500/25 border border-indigo-400/30 group"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="flex items-center gap-2 font-bold text-xs sm:text-sm">
                        <BrainCircuit className="w-4 h-4 text-amber-300" />
                        Option 1: Try an Interactive Quiz
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                      Test your understanding with <strong>{synthesis.activeRecallQuiz.length} active recall questions</strong> tailored specifically to these notes.
                    </p>
                  </button>

                  {/* Option 2: Just Move On */}
                  <button
                    onClick={() => {
                      setReadingStage("completed");
                      onSaveNotification("Topic marked as completed! Ready for next unit.");
                    }}
                    className="flex flex-col text-left p-5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-white transition-all border border-slate-700 group"
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <span className="flex items-center gap-2 font-bold text-xs sm:text-sm text-slate-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        Option 2: Just Move On
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Mark as read, store in your revision history, and synthesize another topic or document.
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 2: INTERACTIVE QUIZ STUDIO ================= */}
          {readingStage === "quiz" && (
            <div className="space-y-6">
              {/* Quiz Header */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-xl p-5 sm:p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Active Recall Mode
                    </span>
                    <span className="text-slate-400 text-xs font-mono">
                      {synthesis.activeRecallQuiz.length} Question Mastery Set
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-lg sm:text-xl text-slate-100">
                    Quiz: {synthesis.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select an answer to see instant statutory justification and ratio decidendi.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setReadingStage("reading")}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Back to Notes</span>
                  </button>

                  <button
                    onClick={handleRegenerateQuiz}
                    disabled={isRegeneratingQuiz}
                    className="px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isRegeneratingQuiz ? "animate-spin" : ""}`} />
                    <span>New Questions</span>
                  </button>
                </div>
              </div>

              {/* Score Indicator Banner if submitted */}
              {quizScore !== null && (
                <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 border border-emerald-600/40 rounded-xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 font-bold text-lg">
                      {Math.round((quizScore / synthesis.activeRecallQuiz.length) * 100)}%
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-emerald-200">
                        Quiz Completed! Score: {quizScore} / {synthesis.activeRecallQuiz.length}
                      </h4>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {quizScore === synthesis.activeRecallQuiz.length
                          ? "Flawless score! You have mastered the statutory provisions and case holdings on this topic."
                          : "Great effort! Review the detailed explanations below to cement your recall."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedAnswers({});
                        setShowExplanations({});
                        setQuizScore(null);
                      }}
                      className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>Retake Quiz</span>
                    </button>
                    <button
                      onClick={() => setReadingStage("completed")}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <span>Finish & Move On</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-4">
                {synthesis.activeRecallQuiz.map((quiz, qIdx) => {
                  const selected = selectedAnswers[qIdx];
                  const isAnswered = selected !== undefined;
                  const isCorrect = isAnswered && selected === quiz.correctAnswerIndex;

                  return (
                    <div
                      key={qIdx}
                      className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {qIdx + 1}
                          </span>
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                            {quiz.question}
                          </h4>
                        </div>

                        {isAnswered && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                              isCorrect
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-red-100 text-red-800 border border-red-300"
                            }`}
                          >
                            {isCorrect ? "Correct" : "Incorrect"}
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 gap-2">
                        {quiz.options.map((opt, oIdx) => {
                          let btnStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300";

                          if (isAnswered) {
                            if (oIdx === quiz.correctAnswerIndex) {
                              btnStyle = "bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs";
                            } else if (selected === oIdx) {
                              btnStyle = "bg-red-50 border-red-400 text-red-950 font-medium";
                            } else {
                              btnStyle = "bg-slate-50 border-slate-200 text-slate-400 opacity-60";
                            }
                          }

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleOptionSelect(qIdx, oIdx)}
                              className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-xs font-bold text-slate-400 uppercase">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <span>{opt}</span>
                              </div>

                              {isAnswered && oIdx === quiz.correctAnswerIndex && (
                                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                              )}
                              {isAnswered && selected === oIdx && oIdx !== quiz.correctAnswerIndex && (
                                <XCircle className="w-4 h-4 text-red-500 shrink-0 ml-2" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation Box */}
                      {showExplanations[qIdx] && (
                        <div className="mt-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                          <div className="font-bold text-indigo-700 flex items-center gap-1.5">
                            <HelpCircle className="w-3.5 h-3.5" />
                            <span>Statutory Authority & Precedent Explanation:</span>
                          </div>
                          <p className="leading-relaxed text-slate-800">{quiz.detailedExplanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Bottom Quiz Action Bar */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="text-xs text-slate-600 font-medium">
                  Answered: <strong>{Object.keys(selectedAnswers).length}</strong> of {synthesis.activeRecallQuiz.length} questions
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleScoreQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs disabled:opacity-50"
                  >
                    Calculate Final Score
                  </button>

                  <button
                    onClick={() => setReadingStage("completed")}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                  >
                    Done (Move On)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STAGE 3: COMPLETED & MOVE ON ================= */}
          {readingStage === "completed" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs text-center max-w-2xl mx-auto space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center mx-auto">
                <Award className="w-8 h-8" />
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                  Topic Mastered & Saved!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  &quot;<strong>{synthesis.title}</strong>&quot; has been synthesized ({synthesis.actualWordCount || 300} words) and stored in your offline revision vault.
                </p>
              </div>

              {quizScore !== null && (
                <div className="inline-block bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-700">
                  Quiz Mastery Score: <span className="text-emerald-700">{quizScore}/{synthesis.activeRecallQuiz.length}</span> ({Math.round((quizScore / synthesis.activeRecallQuiz.length) * 100)}%)
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <button
                  onClick={() => {
                    setTopicTitle("");
                    setRawLectureNotes("");
                    setAttachment(null);
                    setReadingStage("reading");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="p-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Synthesize Next Topic</span>
                </button>

                <button
                  onClick={() => setReadingStage("reading")}
                  className="p-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Review Notes Again</span>
                </button>

                <button
                  onClick={() => {
                    setReadingStage("quiz");
                    setSelectedAnswers({});
                    setShowExplanations({});
                    setQuizScore(null);
                  }}
                  className="p-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <BrainCircuit className="w-4 h-4" />
                  <span>Take Quiz Again</span>
                </button>
              </div>
            </div>
          )}
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
    </div>
  );
};
