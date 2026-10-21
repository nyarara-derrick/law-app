export type LegalSubject =
  | "Constitutional Law"
  | "Law of Contract"
  | "Law of Torts"
  | "Criminal Law & Procedure"
  | "Law of Evidence"
  | "Islamic Jurisprudence & Sharia"
  | "Islamic Family Law & Succession (Mirath)"
  | "Civil Procedure"
  | "Land Law & Property"
  | "Commercial & Corporate Law";

export interface IRACSolution {
  id: string;
  title: string;
  subject: LegalSubject;
  scenario: string;
  rawMarkdown: string;
  issue: string;
  rule: string;
  application: string;
  conclusion: string;
  createdAt: number;
  savedOffline: boolean;
  tags: string[];
}

export interface IRACGradeResult {
  overallScore: number;
  letterGrade: "A" | "B+" | "B" | "C" | "D" | "F";
  summaryCritique: string;
  rubric: {
    issueScore: number;
    issueFeedback: string;
    ruleScore: number;
    ruleFeedback: string;
    applicationScore: number;
    applicationFeedback: string;
    conclusionScore: number;
    conclusionFeedback: string;
  };
  missingStatutesOrCases: string[];
  modelAnswerHighlights: string;
}

export interface CaseBrief {
  id: string;
  caseName: string;
  citation: string;
  courtAndYear: string;
  subject: LegalSubject;
  materialFacts: string;
  centralIssue: string;
  ratioDecidendi: string;
  obiterDicta?: string;
  kenyanApplication: string;
  rawMarkdown?: string;
  createdAt: number;
  isFavorite?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  detailedExplanation: string;
}

export interface StatutoryItem {
  act: string;
  section: string;
  summary: string;
}

export interface LandmarkCaseReference {
  citation: string;
  principle: string;
}

export interface NoteSynthesis {
  id: string;
  title: string;
  subject: LegalSubject;
  topic: string;
  summaryContent?: string;
  targetWordCount?: number;
  actualWordCount?: number;
  sourceType?: "topic" | "pasted_text" | "pdf" | "screenshot";
  highYieldTakeaways: string[];
  statutoryIndex: StatutoryItem[];
  landmarkCases: LandmarkCaseReference[];
  activeRecallQuiz: QuizQuestion[];
  quickSummaryCard: string;
  createdAt: number;
  savedOffline: boolean;
}

export interface StatuteReference {
  id: string;
  actName: string;
  shortCode: string;
  sectionOrArticle: string;
  title: string;
  content: string;
  keyPrinciple: string;
  landmarkCases: string[];
  examTips: string;
  category: LegalSubject | string;
  compendiumType: "constitution" | "act" | "bill" | "sharia";
  chapterOrPart?: string;
  crossReferences?: string[];
  parliamentaryStatus?: string;
  arabicText?: string;
  isBookmarked?: boolean;
}

export interface UploadedAttachment {
  name: string;
  mimeType: string;
  data: string; // base64 string without data URL prefix
  previewUrl?: string; // for thumbnail rendering
  sizeBytes?: number;
}

export interface PastPaperQuestion {
  id: string;
  questionNumber: string;
  marks: number;
  scenario: string;
  modelIRACAnswer: {
    issue: string;
    rule: string;
    application: string;
    conclusion: string;
    rawMarkdown: string;
  };
  examinerRubric?: string[];
}

export interface PastPaper {
  id: string;
  university: string;
  faculty: string;
  courseCode: string;
  courseTitle: string;
  academicYear: string;
  semester: string;
  subject: LegalSubject;
  examDuration: string;
  instructions: string;
  questions: PastPaperQuestion[];
}

export interface UnitTopicNote {
  id: string;
  title: string;
  summary: string;
  detailedNotes: string;
  keyStatutes: string[];
  landmarkCases: string[];
  examTips?: string;
}

export interface LawUnit {
  id: string;
  courseCode: string;
  courseTitle: string;
  year: number; // 1, 2, 3, 4
  semesterNumber: number; // 1, 2
  semesterLabel: string; // e.g. "Year 1 - Semester 1"
  subject: LegalSubject;
  creditHours: number;
  isCompulsory: boolean;
  unitOverview: string;
  topics: UnitTopicNote[];
  statutoryFramework: StatutoryItem[];
  landmarkPrecedents: LandmarkCaseReference[];
  commonExamQuestions: string[];
  tags: string[];
}

