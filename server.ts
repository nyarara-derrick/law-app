import express, { type Request, type Response } from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "30mb" }));

// Server-side Gemini AI initialization``
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Candidate models for seamless fallback when demand spikes occur (503/UNAVAILABLE)
const FALLBACK_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.1-flash-lite",
  "gemini-flash-latest",
];

interface CallGeminiParams {
  contents: any;
  config?: any;
  preferredModel?: string;
}

/**
 * Resilient Gemini caller that implements:
 * 1. Automatic exponential backoff for 503 (High demand) & 429 (Rate limit)
 * 2. Model fallback chain (gemini-3.8-flash -> gemini-3.1-flash-lite -> gemini-flash-latest)
 */
async function callGeminiWithRetry(params: CallGeminiParams) {
  const models = params.preferredModel
    ? [params.preferredModel, ...FALLBACK_MODELS.filter((m) => m !== params.preferredModel)]
    : FALLBACK_MODELS;

  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        return response;
      } catch (err: any) {
        lastError = err;
        const status = err?.status || err?.code;
        const msg = (err?.message || "").toLowerCase();
        const isTransient =
          status === 503 ||
          status === "UNAVAILABLE" ||
          status === 429 ||
          status === "RESOURCE_EXHAUSTED" ||
          msg.includes("503") ||
          msg.includes("high demand") ||
          msg.includes("unavailable") ||
          msg.includes("resource_exhausted") ||
          msg.includes("overloaded") ||
          msg.includes("try again later");

        if (isTransient) {
          console.warn(`[Gemini Resiliency] Model '${model}' attempt ${attempt} encountered transient load: ${err.message}. Retrying with backoff...`);
          const delayMs = attempt * 1000 + Math.floor(Math.random() * 500);
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        } else {
          console.warn(`[Gemini Resiliency] Non-transient error on '${model}': ${err.message}. Trying next candidate model...`);
          break;
        }
      }
    }
  }

  // If all models and retries fail, format a clean descriptive error
  const finalMsg = lastError?.message || "AI model service is momentarily unavailable due to high demand. Please retry in a few seconds.";
  const errorObj = new Error(finalMsg);
  (errorObj as any).status = lastError?.status || 503;
  throw errorObj;
}

const LEXIMIND_SYSTEM_PROMPT = `You are "LexiMind Engine," the core AI intelligence for a mobile legal study application built for Law students (LL.B) at Umma University in Kenya.

ACADEMIC CONTEXT & JURISDICTION:
- Primary Jurisdiction: Kenyan Statutory Law, the Constitution of Kenya (2010), Civil Procedure Act (Cap 21), Criminal Procedure Code (Cap 75), Penal Code (Cap 63), Law of Contract Act (Cap 23), Law of Torts, Land Act (2012), Evidence Act (Cap 80), Law of Succession Act (Cap 160), and CLE (Council of Legal Education) bar exam standards.
- Integrated Curriculum: Islamic Jurisprudence (Sharia, Fiqh, Quranic and Sunnah legal sources, Kadhis' Courts under Article 170 of the 2010 Constitution, Kadhis' Courts Act Cap 11, Muslim Personal Law, Marriage & Divorce, Mirath / Islamic Succession) as taught in Umma University's Law & Sharia program.

TONE & STYLE:
- Academic, precise, authoritative, and direct.
- Omit conversational fluff, greetings, apologies, or conversational sign-offs.
- Use mobile-optimized formatting with high scannability: bold headings, short paragraphs (2-3 sentences max per block), and clear bullet points.
- Always accurately cite Kenyan statutes (with Act name and section number) and landmark case law citations with party names and year.`;

// Endpoint 0: OCR and Multimodal Extraction from Photo or PDF
app.post("/api/irac/extract-text", async (req: Request, res: Response) => {
  try {
    const { attachment } = req.body;
    if (!attachment || !attachment.data) {
      return res.status(400).json({ error: "Attachment photo or PDF is required for analysis." });
    }

    const mimeType = attachment.mimeType || (attachment.name?.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
    const prompt = `You are an expert legal document OCR and question parser for Kenyan Law examinations.
Carefully examine the attached image or PDF document. Extract all problem scenarios, legal questions, essay prompts, or hypothetical factual disputes verbatim.
Format your output cleanly as readable legal text with all sub-questions preserved. Do NOT generate conversational commentary, introductions, or apologies.`;

    const response = await callGeminiWithRetry({
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: attachment.data,
            },
          },
          { text: prompt },
        ],
      },
    });

    const extracted = response.text || "";
    return res.json({ extractedText: extracted.trim() });
  } catch (error: any) {
    console.error("Text Extraction Error:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Failed to extract legal question from document" });
  }
});

// Endpoint 1: IRAC Problem Question Solver (Supports Text, Photo & PDF)
app.post("/api/irac/solve", async (req: Request, res: Response) => {
  try {
    const { scenario, subject, customInstructions, attachment } = req.body;
    if (!scenario && (!attachment || !attachment.data)) {
      return res.status(400).json({ error: "A legal scenario, photo question, or PDF document is required." });
    }

    const hasAttachment = Boolean(attachment && attachment.data);
    const promptText = `Solve this legal problem question strictly following the 4-part IRAC exam breakdown format for Kenyan LL.B / Umma University Law students.

SUBJECT / MODULE: ${subject || "Kenyan Law & Jurisprudence"}
ADDITIONAL DIRECTIVES: ${customInstructions || "Apply standard Kenyan law and Umma University syllabus doctrines"}

${scenario ? `EXAM SCENARIO / CONTEXT:\n"""\n${scenario}\n"""` : "Please analyze the problem question in the attached photo/PDF document directly."}

Format your response strictly using this mobile-optimized IRAC structure:

# 📌 ISSUE
- State the core legal question(s) and specific disputes with absolute clarity.

# 📜 RULE
- Cite the applicable Kenyan Statutes (with specific Sections, e.g., Law of Contract Act Cap 23, Penal Code Cap 63, Evidence Act Cap 80, Constitution of Kenya 2010 Articles) or Islamic Jurisprudence rules (Quran, Sunnah, Ijma, Qiyas, Fiqh doctrines, Kadhis' Courts jurisdiction).
- Explain the key legal elements required to establish the claim or defense.

# ⚖️ APPLICATION
- Apply the statutory rules and legal doctrines step-by-step to the specific material facts of the scenario or document.
- Cite landmark Kenyan or Common Law / Islamic precedents (**Case Name v Party [Year]** or traditional juristic rulings) to support each argument.
- Address counter-arguments or potential defenses.

# 🏁 CONCLUSION
- Provide a definitive, actionable legal outcome, remedies available (e.g., damages, injunction, specific performance, acquittal, conviction), or advice to the client.`;

    let response;
    if (hasAttachment) {
      const mimeType = attachment.mimeType || (attachment.name?.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
      response = await callGeminiWithRetry({
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: attachment.data,
              },
            },
            { text: promptText },
          ],
        },
        config: {
          systemInstruction: LEXIMIND_SYSTEM_PROMPT,
          temperature: 0.2,
        },
      });
    } else {
      response = await callGeminiWithRetry({
        contents: promptText,
        config: {
          systemInstruction: LEXIMIND_SYSTEM_PROMPT,
          temperature: 0.2,
        },
      });
    }

    return res.json({ result: response.text });
  } catch (error: any) {
    console.error("IRAC Error:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Failed to generate IRAC solution" });
  }
});

// Endpoint 2: IRAC Student Answer Grader / Assessor
app.post("/api/irac/grade", async (req: Request, res: Response) => {
  try {
    const { scenario, studentAnswer, subject } = req.body;
    if (!scenario || !studentAnswer) {
      return res.status(400).json({ error: "Scenario and student answer are required." });
    }

    const prompt = `You are the examiner evaluating a Law student's LL.B exam response at Umma University in Kenya.
Subject: ${subject || "Kenyan Law"}

PROBLEM QUESTION:
"""
${scenario}
"""

STUDENT'S SUBMITTED IRAC ANSWER:
"""
${studentAnswer}
"""

Evaluate the student's submission rigorously according to Kenyan LL.B and CLE grading standards.

Return a JSON object matching this schema:
{
  "overallScore": number (out of 100),
  "letterGrade": "A" | "B+" | "B" | "C" | "D" | "F",
  "summaryCritique": "2-3 sentence executive assessment",
  "rubric": {
    "issueScore": number (out of 20),
    "issueFeedback": "string",
    "ruleScore": number (out of 25),
    "ruleFeedback": "string",
    "applicationScore": number (out of 35),
    "applicationFeedback": "string",
    "conclusionScore": number (out of 20),
    "conclusionFeedback": "string"
  },
  "missingStatutesOrCases": ["list of key Kenyan statutes or cases the student missed"],
  "modelAnswerHighlights": "Concise key points that should have been in the model answer"
}`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction: LEXIMIND_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            letterGrade: { type: Type.STRING },
            summaryCritique: { type: Type.STRING },
            rubric: {
              type: Type.OBJECT,
              properties: {
                issueScore: { type: Type.NUMBER },
                issueFeedback: { type: Type.STRING },
                ruleScore: { type: Type.NUMBER },
                ruleFeedback: { type: Type.STRING },
                applicationScore: { type: Type.NUMBER },
                applicationFeedback: { type: Type.STRING },
                conclusionScore: { type: Type.NUMBER },
                conclusionFeedback: { type: Type.STRING },
              },
              required: ["issueScore", "issueFeedback", "ruleScore", "ruleFeedback", "applicationScore", "applicationFeedback", "conclusionScore", "conclusionFeedback"],
            },
            missingStatutesOrCases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            modelAnswerHighlights: { type: Type.STRING },
          },
          required: ["overallScore", "letterGrade", "summaryCritique", "rubric", "missingStatutesOrCases", "modelAnswerHighlights"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Grading Error:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Failed to grade IRAC submission" });
  }
});

// Endpoint 3: Case Law Vault Breakdown
app.post("/api/case/brief", async (req: Request, res: Response) => {
  try {
    const { caseName, subject, jurisdictionFocus, query } = req.body;
    if (!caseName && !query) {
      return res.status(400).json({ error: "Case name or query is required." });
    }

    const prompt = `Provide a high-yield Case Law Vault breakdown for Law students (LL.B Umma University).

CASE / TOPIC TO ANALYZE: ${caseName || query}
SUBJECT: ${subject || "Constitutional Law"}
JURISDICTION FOCUS: ${jurisdictionFocus || "Kenyan Courts & Common Law Precedents / Sharia Principles"}

Provide accurate case facts, court & year, citation, central issue, ratio decidendi, obiter dicta, and Kenyan judicial application.`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction: LEXIMIND_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caseName: { type: Type.STRING },
            citation: { type: Type.STRING },
            courtAndYear: { type: Type.STRING },
            materialFacts: { type: Type.STRING },
            centralIssue: { type: Type.STRING },
            ratioDecidendi: { type: Type.STRING },
            obiterDicta: { type: Type.STRING },
            kenyanApplication: { type: Type.STRING },
          },
          required: [
            "caseName",
            "citation",
            "courtAndYear",
            "materialFacts",
            "centralIssue",
            "ratioDecidendi",
            "obiterDicta",
            "kenyanApplication",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Case Brief Error:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Failed to generate case brief" });
  }
});

// Endpoint 4: Note Synthesizer & Active Recall Revision Generator
app.post("/api/synthesizer/generate", async (req: Request, res: Response) => {
  try {
    const { rawNotes, subject, topic, targetWordCount, attachment } = req.body;
    if (!rawNotes && !topic && (!attachment || !attachment.data)) {
      return res.status(400).json({ error: "Raw notes, slides text, topic, or document attachment is required." });
    }

    const wordBudget = Number(targetWordCount) || 350;
    const hasAttachment = Boolean(attachment && attachment.data);

    const promptText = `You are the chief legal academic tutor for Law students (Umma University LL.B in Kenya).
Synthesize the provided legal study material into an authoritative, structured, high-yield summary tailored strictly to the learner's specified target word length, followed by an active recall quiz.

MODULE / SUBJECT: ${subject || "Kenyan Law & Shariah Jurisprudence"}
TOPIC / SPECIFIC AREA: ${topic || "Comprehensive Legal Lecture Synthesis"}
TARGET WORD COUNT FOR SUMMARY: Exactly around ${wordBudget} words (Stay within ±15% of this word budget).

${rawNotes ? `RAW LECTURE / READING / PASTED TEXT:\n"""\n${rawNotes}\n"""` : hasAttachment ? "Analyze the uploaded document / screenshot / PDF lecture notes directly." : `Synthesize all key legal principles, statutory provisions, and landmark precedents on the topic: "${topic}".`}

INSTRUCTIONS FOR SYNTHESIS:
1. "summaryContent": Write a coherent, well-structured, mobile-scannable synthesis of the topic formatted with markdown subheadings (e.g. ## Core Concept & Elements, ## Statutory Foundation, ## Judicial Application & Exceptions, ## Exam Application). The text MUST be approximately ${wordBudget} words in length.
2. "actualWordCount": Count and state the approximate number of words in "summaryContent".
3. "quickSummaryCard": A 2-sentence crisp executive memory hook for rapid last-minute recall.
4. "highYieldTakeaways": 4 to 6 concise bullet points highlighting key definitions, elements of liability, or defenses.
5. "statutoryIndex": Accurate Kenyan statutes (with specific Acts and Sections, e.g. Cap 23, Cap 63, Cap 80, 2010 Constitution Articles) or Islamic jurisprudence sources (Quran, Sunnah, Kadhis' Courts Act Cap 11).
6. "landmarkCases": 3 to 5 key binding precedents with authoritative case citation and one-line ratio decidendi.
7. "activeRecallQuiz": 4 to 6 challenging multiple-choice revision questions derived strictly from the notes, testing specific statutory sections, case holdings, and problem applications. Each question must have 4 plausible options, a 0-indexed correct answer, and a comprehensive legal explanation.`;

    let response;
    if (hasAttachment) {
      const mimeType = attachment.mimeType || (attachment.name?.endsWith(".pdf") ? "application/pdf" : "image/jpeg");
      response = await callGeminiWithRetry({
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: attachment.data,
              },
            },
            { text: promptText },
          ],
        },
        config: {
          systemInstruction: LEXIMIND_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summaryContent: { type: Type.STRING },
              actualWordCount: { type: Type.NUMBER },
              quickSummaryCard: { type: Type.STRING },
              highYieldTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              statutoryIndex: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    act: { type: Type.STRING },
                    section: { type: Type.STRING },
                    summary: { type: Type.STRING },
                  },
                  required: ["act", "section", "summary"],
                },
              },
              landmarkCases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    citation: { type: Type.STRING },
                    principle: { type: Type.STRING },
                  },
                  required: ["citation", "principle"],
                },
              },
              activeRecallQuiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    detailedExplanation: { type: Type.STRING },
                  },
                  required: ["question", "options", "correctAnswerIndex", "detailedExplanation"],
                },
              },
            },
            required: [
              "title",
              "summaryContent",
              "actualWordCount",
              "quickSummaryCard",
              "highYieldTakeaways",
              "statutoryIndex",
              "landmarkCases",
              "activeRecallQuiz",
            ],
          },
        },
      });
    } else {
      response = await callGeminiWithRetry({
        contents: promptText,
        config: {
          systemInstruction: LEXIMIND_SYSTEM_PROMPT,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              summaryContent: { type: Type.STRING },
              actualWordCount: { type: Type.NUMBER },
              quickSummaryCard: { type: Type.STRING },
              highYieldTakeaways: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              statutoryIndex: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    act: { type: Type.STRING },
                    section: { type: Type.STRING },
                    summary: { type: Type.STRING },
                  },
                  required: ["act", "section", "summary"],
                },
              },
              landmarkCases: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    citation: { type: Type.STRING },
                    principle: { type: Type.STRING },
                  },
                  required: ["citation", "principle"],
                },
              },
              activeRecallQuiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    detailedExplanation: { type: Type.STRING },
                  },
                  required: ["question", "options", "correctAnswerIndex", "detailedExplanation"],
                },
              },
            },
            required: [
              "title",
              "summaryContent",
              "actualWordCount",
              "quickSummaryCard",
              "highYieldTakeaways",
              "statutoryIndex",
              "landmarkCases",
              "activeRecallQuiz",
            ],
          },
        },
      });
    }

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Synthesizer Error:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Failed to synthesize notes" });
  }
});

// Endpoint 4B: Regenerate / Fresh Quiz from Synthesized Notes
app.post("/api/synthesizer/generate-quiz", async (req: Request, res: Response) => {
  try {
    const { title, subject, notesContent, numQuestions = 5 } = req.body;
    if (!notesContent && !title) {
      return res.status(400).json({ error: "Notes content or title is required." });
    }

    const prompt = `Generate an interactive active recall quiz of ${numQuestions} multiple-choice questions for Law students (Umma University LL.B) based strictly on these notes:
TOPIC: ${title || "Legal Revision"}
SUBJECT: ${subject || "Kenyan Law"}

NOTES CONTENT:
"""
${notesContent || title}
"""

Ensure questions test statutory provisions, landmark ratio decidendi, and hypothetical problem applications from these notes.
Return JSON with this schema:
{
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswerIndex": 0,
      "detailedExplanation": "Statutory / Case precedent explanation"
    }
  ]
}`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction: LEXIMIND_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctAnswerIndex: { type: Type.INTEGER },
                  detailedExplanation: { type: Type.STRING },
                },
                required: ["question", "options", "correctAnswerIndex", "detailedExplanation"],
              },
            },
          },
          required: ["questions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);
  } catch (error: any) {
    console.error("Quiz Gen Error:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Failed to generate quiz" });
  }
});

// Endpoint 5: Deep Legal Statutory & Sharia Compendium AI Lookup
app.post("/api/statute/lookup", async (req: Request, res: Response) => {
  try {
    const { query, statute, compendiumType } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Query or statutory provision is required." });
    }

    const prompt = `You are LexiMind's Kenyan Statutory & Sharia Compendium Engine for Umma University LL.B Law Students.
Analyze and provide a comprehensive statutory & jurisprudential breakdown for:
QUERY / PROVISION: "${query}"
FOCUSED DOMAIN: ${statute || "Kenyan Legal Framework & Islamic Jurisprudence"}
CATEGORY TYPE: ${compendiumType || "Statutory / Constitutional / Sharia Library"}

Provide:
1. Exact Title, Section/Article Number, and Act / Surah / Bill Name.
2. Full verbatim statutory wording or authentic Quranic/Hadith Arabic & English translation.
3. Core Legal Principle / Ratio Decidendi.
4. Leading Landmark Precedents (Supreme Court of Kenya, Court of Appeal, High Court, Kadhis' Courts).
5. CLE & University Exam Pitfalls / Application Guidance.
6. Cross-References and Related Provisions.
7. Parliamentary Status / Legislative History.`;

    const response = await callGeminiWithRetry({
      contents: prompt,
      config: {
        systemInstruction: LEXIMIND_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            actName: { type: Type.STRING },
            shortCode: { type: Type.STRING },
            sectionOrArticle: { type: Type.STRING },
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            keyPrinciple: { type: Type.STRING },
            landmarkCases: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            examTips: { type: Type.STRING },
            category: { type: Type.STRING },
            compendiumType: {
              type: Type.STRING,
              enum: ["constitution", "act", "bill", "sharia"],
            },
            chapterOrPart: { type: Type.STRING },
            crossReferences: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            parliamentaryStatus: { type: Type.STRING },
            arabicText: { type: Type.STRING },
          },
          required: [
            "actName",
            "shortCode",
            "sectionOrArticle",
            "title",
            "content",
            "keyPrinciple",
            "landmarkCases",
            "examTips",
            "category",
            "compendiumType",
          ],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json({
      statute: {
        id: `ai-lookup-${Date.now()}`,
        ...parsed,
      },
    });
  } catch (error: any) {
    console.error("Lookup Error:", error);
    const status = error.status || 500;
    return res.status(status).json({ error: error.message || "Statutory lookup failed" });
  }
});

// Vite Middleware / Static serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`LexiMind Engine server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
