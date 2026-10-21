import { LawUnit } from "../types";

export const YEAR_1_LAW_UNITS: LawUnit[] = [
  // ================= YEAR 1 - SEMESTER 1 =================
  {
    id: "llb-111",
    courseCode: "LLB 111",
    courseTitle: "Constitutional Law I & Human Rights",
    year: 1,
    semesterNumber: 1,
    semesterLabel: "Year 1 - Semester 1",
    subject: "Constitutional Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Foundations of constitutionalism, supremacy of the Constitution (Article 2), sovereignty of the people (Article 1), Separation of Powers, and the comprehensive Bill of Rights (Chapter Four) with mechanisms for enforcement (Articles 22 & 23).",
    topics: [
      {
        id: "llb111-t1",
        title: "Constitutionalism & Supremacy of the Constitution (Art 2)",
        summary: "The Constitution as the supreme law binding all state organs and persons.",
        detailedNotes: `### Core Doctrines:
- **Article 2(1) & 2(4)**: Any law or customary practice inconsistent with the Constitution is void to the extent of the inconsistency.
- **Constitutionalism**: Governance limited by law, institutional checks and balances, and protection of minority and fundamental freedoms.
- **Rule of Law (Article 10)**: National values binding all public officers in executing decisions.`,
        keyStatutes: ["Constitution of Kenya 2010 (Art 1, 2, 10)"],
        landmarkCases: ["Trusted Society of Human Rights Alliance v Mumo Matemu [2013] eKLR", "Njoya & 6 Others v Attorney-General [2004]"],
        examTips: "Always cite Article 2(4) alongside Article 10(2) when challenging arbitrary executive decrees.",
      },
      {
        id: "llb111-t2",
        title: "The Bill of Rights & Limitation of Rights (Articles 19, 24)",
        summary: "Inherent human rights, non-derogable rights, and the strict two-pronged justification test under Article 24.",
        detailedNotes: `### Key Principles:
- **Non-Derogable Rights (Article 25)**: Freedom from torture, cruel or degrading treatment; freedom from slavery; right to fair trial; right to order of *habeas corpus*.
- **Article 24 Limitation Test**: A right may only be limited by law, to the extent reasonable and justifiable in an open and democratic society.`,
        keyStatutes: ["Constitution of Kenya 2010 (Articles 19, 24, 25, 28, 40, 43, 47)"],
        landmarkCases: ["Mitu-Bell Welfare Society v KAA [2021] KSC", "Coalition for Reform and Democracy (CORD) v Republic [2015]"],
        examTips: "In problem questions dealing with state bans or curfews, evaluate every Article 24 criteria explicitly.",
      },
      {
        id: "llb111-t3",
        title: "Fair Administrative Action & Remedies (Article 47 & FAAA 2015)",
        summary: "The right to lawful, reasonable, and procedurally fair administrative action.",
        detailedNotes: `### Statutory Rules:
- **Section 4 FAAA 2015**: Requires written notice, reasons for decisions, and opportunity to make representations (*audi alteram partem*).
- **Article 23(3)**: High Court remedies including declarations, injunctions, and constitutional damages.`,
        keyStatutes: ["Fair Administrative Action Act (No. 4 of 2015)", "Constitution of Kenya 2010 (Art 22, 23, 47)"],
        landmarkCases: ["Dry Associates Ltd v CMA [2012] eKLR", "Republic v Judicial Service Commission ex parte Pareno [2004]"],
        examTips: "Link Article 47 directly with natural justice and the statutory provisions of FAAA Section 4.",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Articles 1, 2, 10, 19-25, 47", summary: "Supremacy, Bill of Rights & Fair Administrative Action" },
      { act: "Fair Administrative Action Act 2015", section: "Section 4", summary: "Procedural fairness and administrative notice requirements" },
    ],
    landmarkPrecedents: [
      { citation: "IEBC v David Ndii & 79 Others [2022] KSC 1 (BBI Case)", principle: "Affirmed the Basic Structure Doctrine and limitations on constitutional amendments" },
      { citation: "Mitu-Bell Welfare Society v KAA [2021] KSC", principle: "Evictions without dignity and adequate notice violate Articles 28 and 43" },
    ],
    commonExamQuestions: [
      "Critically evaluate the constitutionality of midnight executive evictions under Articles 10, 47, and 40.",
      "Explain the application of the Basic Structure Doctrine in Kenyan constitutional jurisprudence.",
    ],
    tags: ["Constitutional Law", "Bill of Rights", "Article 47", "Basic Structure"],
  },

  {
    id: "llb-112",
    courseCode: "LLB 112",
    courseTitle: "Legal Research, Writing & Methods",
    year: 1,
    semesterNumber: 1,
    semesterLabel: "Year 1 - Semester 1",
    subject: "Constitutional Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Hierarchy of courts and sources of law in Kenya (Judicature Act Cap 8), doctrine of precedent (stare decisis), statutory interpretation canons, legal citation, and advocacy methods.",
    topics: [
      {
        id: "llb112-t1",
        title: "Sources of Kenyan Law & Judicature Act (Cap 8)",
        summary: "Order of legal authority: Constitution, Acts of Parliament, Common Law & Doctrines of Equity, Customary Law, Islamic Law.",
        detailedNotes: `### Statutory Hierarchy (Section 3 Judicature Act):
1. Constitution of Kenya (Supreme)
2. Written Laws (Acts of Parliament)
3. Statutes of General Application in force in England on 12th August 1897
4. Common Law and Doctrines of Equity (subject to Kenyan circumstances)
5. African Customary Law (subject to repugnancy test and consistency with Constitution)
6. Islamic Law (Kadhis' Courts under Article 170(5)).`,
        keyStatutes: ["Judicature Act (Cap 8, Sec 3)", "Interpretation and General Provisions Act (Cap 2)"],
        landmarkCases: ["Owners of Motor Vessel 'Lillian S' v Caltex Oil [1989] KLR 1", "SM Otieno Case: Virginia Wambui Otieno v Joash Ochieng Ougo [1987]"],
        examTips: "Always cite Section 3(1) of the Judicature Act when asked about the hierarchy and reception date of English law.",
      },
      {
        id: "llb112-t2",
        title: "Canons of Statutory Interpretation",
        summary: "Literal Rule, Golden Rule, Mischief Rule (*Heydon's Case*), and Purposive Approach.",
        detailedNotes: `### Core Canons:
- **Literal Rule**: Words are given their plain, ordinary grammatical meaning.
- **Golden Rule**: Modifies literal meaning to avoid absurdity or repugnance (*Grey v Pearson*).
- **Mischief Rule**: Examines the common law defect Parliament intended to remedy (*Heydon's Case*).
- **Purposive Approach**: Determines the broader legislative intent (*Pepper v Hart*).`,
        keyStatutes: ["Interpretation and General Provisions Act (Cap 2)"],
        landmarkCases: ["Heydon's Case [1584]", "Pepper v Hart [1993] AC 593", "Republic v El Mann [1969] EA 357"],
        examTips: "Kenyan courts favor the purposive approach anchored on Article 259 of the Constitution.",
      },
    ],
    statutoryFramework: [
      { act: "Judicature Act (Cap 8)", section: "Section 3", summary: "Sources and hierarchy of Kenyan law" },
      { act: "Constitution of Kenya", section: "Article 259", summary: "Purposive construing of the Constitution" },
    ],
    landmarkPrecedents: [
      { citation: "Owners of Motor Vessel 'Lillian S' v Caltex Oil [1989]", principle: "Jurisdiction is everything; without it a court must down its tools" },
    ],
    commonExamQuestions: [
      "Discuss the reception date of 12th August 1897 and its relevance in modern Kenyan courts.",
      "Distinguish between ratio decidendi and obiter dicta with landmark examples.",
    ],
    tags: ["Legal Methods", "Judicature Act", "Statutory Interpretation", "Precedent"],
  },

  {
    id: "llb-113",
    courseCode: "LLB 113",
    courseTitle: "Law of Torts I",
    year: 1,
    semesterNumber: 1,
    semesterLabel: "Year 1 - Semester 1",
    subject: "Law of Torts",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Foundations of civil wrongs and non-contractual liability: negligence, duty of care, standard of care, causation in fact/law, remoteness of damage, and general defenses.",
    topics: [
      {
        id: "llb113-t1",
        title: "Negligence & Duty of Care",
        summary: "The Neighbour Principle in *Donoghue v Stevenson* and the 3-stage *Caparo* test.",
        detailedNotes: `### Elements of Negligence:
1. **Duty of Care**: Foreseeability, proximity, and fairness (*Caparo Industries v Dickman*).
2. **Breach of Duty**: Standard of the reasonable person (*Blyth v Birmingham Waterworks*).
3. **Causation**: 'But for' test (*Barnett v Chelsea Hospital*).
4. **Remoteness**: Foreseeable type of harm (*The Wagon Mound No. 1*).`,
        keyStatutes: ["Law Reform Act (Cap 26)", "Civil Liability Act"],
        landmarkCases: ["Donoghue v Stevenson [1932] AC 562", "Caparo Industries v Dickman [1990] 2 AC 605", "Bolam v Friern Hospital [1957]"],
        examTips: "Structure negligence questions strictly: Duty -> Breach -> Causation -> Remoteness -> Defenses.",
      },
      {
        id: "llb113-t2",
        title: "Defenses in Tort",
        summary: "Volenti non fit injuria (consent), Contributory Negligence, and Ex turpi causa non oritur actio.",
        detailedNotes: `### Key Defenses:
- **Volenti Non Fit Injuria**: Complete defense; plaintiff must have full knowledge and voluntary assumption of risk (*Morris v Murray*).
- **Contributory Negligence (Law Reform Act Cap 26)**: Apportionment of damages based on plaintiff's fault.
- **Ex Turpi Causa**: Illegality barring civil recovery (*Pitts v Hunt*).`,
        keyStatutes: ["Law Reform Act (Cap 26, Section 4)"],
        landmarkCases: ["Morris v Murray [1991] 2 QB 6", "Pitts v Hunt [1991] 1 QB 24"],
        examTips: "Contributory negligence is only a partial defense reducing damages under Kenyan statute.",
      },
    ],
    statutoryFramework: [
      { act: "Law Reform Act (Cap 26)", section: "Section 4", summary: "Contributory negligence and apportionment of liability" },
    ],
    landmarkPrecedents: [
      { citation: "Donoghue v Stevenson [1932] AC 562", principle: "Established the universal Neighbour Principle for duty of care in negligence" },
      { citation: "The Wagon Mound (No. 1) [1961] AC 388", principle: "Defendant is only liable for consequences reasonably foreseeable at the time of breach" },
    ],
    commonExamQuestions: [
      "Analyze the development of the duty of care from Donoghue v Stevenson to Caparo Industries v Dickman.",
      "Advise an injured passenger in a drunk-driving accident on the defenses of Volenti and Contributory Negligence.",
    ],
    tags: ["Torts", "Negligence", "Duty of Care", "Defenses"],
  },

  {
    id: "shar-111",
    courseCode: "SHAR 111",
    courseTitle: "Introduction to Islamic Jurisprudence (Usul al-Fiqh I)",
    year: 1,
    semesterNumber: 1,
    semesterLabel: "Year 1 - Semester 1",
    subject: "Islamic Jurisprudence & Sharia",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Foundations of Usul al-Fiqh, primary sources (Quran & Sunnah), secondary sources (Ijma & Qiyas), categories of Hukm Shar'i (Taklifi & Wad'i), and Kadhis' Courts jurisdiction under Article 170(5).",
    topics: [
      {
        id: "shar111-t1",
        title: "Primary & Secondary Sources of Shariah",
        summary: "Hierarchical sources: Quran (Kalam Allah), Sunnah, Ijma (Consensus), and Qiyas (Analogical deduction).",
        detailedNotes: `### Core Sources:
1. **The Holy Quran**: Primary legislative texts (*Ayat al-Ahkam* - ~500 legal verses).
2. **The Sunnah**: Sayings (Qawl), Actions (Fi'l), and Tacit Approvals (Taqrir) of Prophet Muhammad (PBUH).
3. **Ijma**: Unanimous consensus of Mujtahid scholars in a specific era on a legal ruling.
4. **Qiyas**: Extension of a Shariah value from an original case (Asl) to a new case (Far') based on shared effective cause (Illah).`,
        keyStatutes: ["Constitution of Kenya 2010 (Art 170(5))", "Kadhis' Courts Act (Cap 11)"],
        landmarkCases: ["Al-Risalah by Imam al-Shafi'i", "Kadhi Court Succession Petitions (Nairobi & Mombasa)"],
        examTips: "Know the 4 pillars (Arkan) of Qiyas: Asl, Far', Hukm al-Asl, and Illah.",
      },
      {
        id: "shar111-t2",
        title: "Classification of Hukm Shar'i (Taklifi & Wad'i)",
        summary: "The five normative values (Al-Ahkam al-Khamsah) and declarative legal conditions.",
        detailedNotes: `### Al-Ahkam al-Khamsah:
1. **Wajib (Obligatory)**: Reward for compliance, punishment for omission.
2. **Mandub / Mustahabb (Recommended)**: Reward for performance, no punishment for omission.
3. **Mubah (Permissible)**: Neutral; no reward or punishment.
4. **Makruh (Abominable/Disapproved)**: Reward for omission, no punishment for commission.
5. **Haram (Prohibited)**: Punishment for commission, reward for avoidance.`,
        keyStatutes: ["Kadhis' Courts Act (Cap 11, Sec 5)"],
        landmarkCases: ["Classical Islamic Jurisprudential Treatises (Hanafi, Shafi'i, Maliki, Hanbali)"],
        examTips: "Distinguish clearly between Hukm Taklifi (human capacity) and Hukm Wad'i (legal causes, conditions, and impediments).",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Article 170(5)", summary: "Kadhis' Court jurisdiction on Muslim personal law, marriage, divorce and inheritance" },
      { act: "Kadhis' Courts Act (Cap 11)", section: "Section 5", summary: "Administration of Islamic law in Kenyan courts" },
    ],
    landmarkPrecedents: [
      { citation: "Re Estate of Late Sheikh Mohamed [eKLR]", principle: "Estates of deceased Muslims must be administered strictly in accordance with Islamic Shariah" },
    ],
    commonExamQuestions: [
      "Explain the four Arkan of Qiyas and illustrate how modern courts resolve contemporary disputes using analogical deduction.",
      "Distinguish between Hukm Taklifi and Hukm Wad'i with concrete examples.",
    ],
    tags: ["Usul al-Fiqh", "Quran", "Sunnah", "Qiyas", "Kadhis Courts"],
  },

  {
    id: "llb-114",
    courseCode: "LLB 114",
    courseTitle: "Law of Contract I",
    year: 1,
    semesterNumber: 1,
    semesterLabel: "Year 1 - Semester 1",
    subject: "Law of Contract",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Formation of contracts: offer and acceptance, intention to create legal relations, consideration and promissory estoppel, capacity to contract, and formalities under the Law of Contract Act (Cap 23).",
    topics: [
      {
        id: "llb114-t1",
        title: "Offer, Acceptance & The Postal Rule",
        summary: "Distinction between offer and invitation to treat; immediate formation upon posting.",
        detailedNotes: `### Core Rules:
- **Offer vs Invitation to Treat**: Display of goods in shop window or shelf is an invitation to treat (*Pharmaceutical Society v Boots*, *Fisher v Bell*). Unilateral offers to the world (*Carlill v Carbolic Smoke Ball*).
- **The Postal Rule**: Acceptance is complete the moment the letter is posted (*Adams v Lindsell*). Does NOT apply to revocation (*Byrne v Van Tienhoven*).`,
        keyStatutes: ["Law of Contract Act (Cap 23)", "Kenya Information & Communications Act (Cap 411A Sec 83B)"],
        landmarkCases: ["Carlill v Carbolic Smoke Ball Co [1893] 1 QB 256", "Adams v Lindsell [1818] 1 B & Ald 681", "Byrne v Van Tienhoven [1880] 5 CPD 344"],
        examTips: "Remember: Revocation of offer MUST be actually communicated before acceptance is dispatched.",
      },
      {
        id: "llb114-t2",
        title: "Consideration & Promissory Estoppel",
        summary: "Sufficiency vs adequacy of consideration; doctrine of promissory estoppel (*High Trees*).",
        detailedNotes: `### Rules on Consideration:
- Consideration must be sufficient, need not be adequate (*Thomas v Thomas*, *Chappell & Co v Nestle*).
- Past consideration is no consideration (*Roscorla v Thomas*), subject to *Pao On v Lau Yiu Long*.
- **Promissory Estoppel**: A party who makes a clear promise intending to alter legal relations is estopped from reneging (*Central London Property Trust v High Trees House*).`,
        keyStatutes: ["Law of Contract Act (Cap 23, Section 3)"],
        landmarkCases: ["Central London Property Trust v High Trees House [1947] KB 130", "Pao On v Lau Yiu Long [1980] AC 614"],
        examTips: "Promissory estoppel operates as a shield, not a sword (*Combe v Combe*).",
      },
    ],
    statutoryFramework: [
      { act: "Law of Contract Act (Cap 23)", section: "Section 3", summary: "Writing requirement for contracts in land and guarantees" },
    ],
    landmarkPrecedents: [
      { citation: "Carlill v Carbolic Smoke Ball Co [1893]", principle: "Unilateral offers made to the whole world can be accepted through performance" },
      { citation: "High Trees Case [1947] KB 130", principle: "Equity prevents a promisor from enforcing strict legal rights where a promise was relied upon" },
    ],
    commonExamQuestions: [
      "Critically analyze the operation of the Postal Rule in the era of electronic commerce under KICA Cap 411A.",
      "Explain the limits of the doctrine of Promissory Estoppel with reference to Combe v Combe.",
    ],
    tags: ["Contract", "Offer and Acceptance", "Consideration", "Promissory Estoppel"],
  },

  // ================= YEAR 1 - SEMESTER 2 =================
  {
    id: "llb-121",
    courseCode: "LLB 121",
    courseTitle: "Constitutional Law II & Devolution",
    year: 1,
    semesterNumber: 2,
    semesterLabel: "Year 1 - Semester 2",
    subject: "Constitutional Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Devolution framework under Chapter 11, county government structures, division of revenue, legislative process, presidential authority, independent commissions (Chapter 15), and intergovernmental disputes.",
    topics: [
      {
        id: "llb121-t1",
        title: "Devolved Government Architecture (Chapter 11 COK 2010)",
        summary: "Objects and principles of devolution: self-governance, equitable sharing of national revenue (Art 202-204).",
        detailedNotes: `### Core Framework:
- **Two Levels of Government**: National and County governments are distinct and interdependent (Article 6(2)), conducting relations on consultation and cooperation.
- **Fourth Schedule**: Functional allocation between national and county governments.`,
        keyStatutes: ["County Governments Act 2012", "Intergovernmental Relations Act 2012", "Public Finance Management Act 2012"],
        landmarkCases: ["Speaker of the Senate & Another v AG & Another [2013] eKLR", "Council of Governors v Attorney-General [2019]"],
        examTips: "Highlight Article 6(2) on distinct and interdependent governance in any devolution question.",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Chapter 11 & Fourth Schedule", summary: "Devolution architecture and revenue sharing" },
      { act: "County Governments Act 2012", section: "Sections 5-30", summary: "Powers and functions of county executive and assembly" },
    ],
    landmarkPrecedents: [
      { citation: "Speaker of the Senate v AG [2013] eKLR", principle: "Senate must participate in all bills concerning county governments under Article 110" },
    ],
    commonExamQuestions: [
      "Evaluate the constitutional role of the Senate in protecting devolved interests under Article 96.",
    ],
    tags: ["Devolution", "Counties", "Senate", "Intergovernmental Relations"],
  },

  {
    id: "llb-122",
    courseCode: "LLB 122",
    courseTitle: "Law of Contract II",
    year: 1,
    semesterNumber: 2,
    semesterLabel: "Year 1 - Semester 2",
    subject: "Law of Contract",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Contractual terms (conditions, warranties, innominate terms), vitiating factors (misrepresentation, mistake, duress, undue influence), discharge of contracts, and common law/equitable remedies.",
    topics: [
      {
        id: "llb122-t1",
        title: "Vitiating Factors: Misrepresentation & Undue Influence",
        summary: "Factors rendering contracts void or voidable: fraudulent/negligent misrepresentation, duress, and undue influence.",
        detailedNotes: `### Vitiating Elements:
- **Misrepresentation**: False statement of material fact inducing contract entry.
- **Undue Influence**: Abuse of relationship of trust (*Royal Bank of Scotland v Etridge*).
- **Economic Duress**: Illegitimate pressure leaving no practical choice (*Universe Tankships*).`,
        keyStatutes: ["Law of Contract Act (Cap 23)"],
        landmarkCases: ["Royal Bank of Scotland v Etridge (No. 2) [2002] 2 AC 773", "Bisset v Wilkinson [1927] AC 177"],
        examTips: "Distinguish between statements of opinion (*Bisset v Wilkinson*) and statements of fact.",
      },
      {
        id: "llb122-t2",
        title: "Remedies for Breach & Hadley v Baxendale",
        summary: "Damages for breach, the two limbs of remoteness, mitigation, and specific performance.",
        detailedNotes: `### Two Limbs of Damages (*Hadley v Baxendale*):
1. **Limb 1**: Losses arising naturally according to usual course of things.
2. **Limb 2**: Special losses within reasonable contemplation of both parties at time of contracting.`,
        keyStatutes: ["Law of Contract Act (Cap 23)"],
        landmarkCases: ["Hadley v Baxendale [1854] 9 Exch 341", "Victoria Laundry v Newman Industries [1949] 2 KB 528"],
        examTips: "Always analyze plaintiff's duty to mitigate losses before awarding full damages.",
      },
    ],
    statutoryFramework: [
      { act: "Law of Contract Act (Cap 23)", section: "Section 3", summary: "General contract enforceability and remedies" },
    ],
    landmarkPrecedents: [
      { citation: "Hadley v Baxendale [1854]", principle: "Established the two-limb test for remoteness of contractual damages" },
    ],
    commonExamQuestions: [
      "Critically examine the two-limb test of contractual damages under Hadley v Baxendale and Victoria Laundry.",
    ],
    tags: ["Contract", "Vitiating Factors", "Breach", "Hadley v Baxendale"],
  },

  {
    id: "llb-123",
    courseCode: "LLB 123",
    courseTitle: "Law of Torts II",
    year: 1,
    semesterNumber: 2,
    semesterLabel: "Year 1 - Semester 2",
    subject: "Law of Torts",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Strict liability (*Rylands v Fletcher*), vicarious liability in employment relationships, defamation (Cap 36), occupiers' liability (Cap 34), nuisance, and trespass to land and goods.",
    topics: [
      {
        id: "llb123-t1",
        title: "Strict Liability & The Rule in Rylands v Fletcher",
        summary: "Strict liability for escape of dangerous non-natural things brought onto land.",
        detailedNotes: `### 4 Elements of Rylands v Fletcher:
1. Bringing onto land something likely to do mischief if it escapes.
2. Non-natural user of land.
3. Escape from the defendant's property.
4. Foreseeable type of damage (*Cambridge Water*).
- **Defenses**: Act of God (*Vis Major*), Consent, Statutory authority, Act of a stranger.`,
        keyStatutes: ["Defamation Act (Cap 36)", "Occupiers' Liability Act (Cap 34)"],
        landmarkCases: ["Rylands v Fletcher [1868] LR 3 HL 330", "Cambridge Water Co v Eastern Counties Leather [1994]", "Greenock Corp v Caledonian Railway [1917]"],
        examTips: "Ordinary seasonal rainfall cannot be pleaded as an Act of God (*Greenock Corp*).",
      },
      {
        id: "llb123-t2",
        title: "Defamation (Cap 36) & Digital Libel",
        summary: "Libel vs slander, publication to third parties, defenses of justification and qualified privilege.",
        detailedNotes: `### Elements of Defamation:
- Words lower plaintiff in estimation of right-thinking members of society (*Sim v Stretch*).
- Words refer to the plaintiff (*Knupffer v London Express*).
- Published to at least one third party (*Pullman v Hill*).
- **Digital Libel (Section 16A Cap 36)**: WhatsApp/social media posts are actionable as Libel in permanent form.`,
        keyStatutes: ["Defamation Act (Cap 36, Sec 14, 16A)"],
        landmarkCases: ["Sim v Stretch [1936] 2 All ER 1237", "Adam v Ward [1917] AC 309"],
        examTips: "Malice destroys the defense of qualified privilege.",
      },
    ],
    statutoryFramework: [
      { act: "Defamation Act (Cap 36)", section: "Sections 14, 16A", summary: "Justification defense and digital libel rules" },
      { act: "Occupiers' Liability Act (Cap 34)", section: "Section 3", summary: "Common duty of care to lawful visitors" },
    ],
    landmarkPrecedents: [
      { citation: "Rylands v Fletcher [1868]", principle: "Strict liability applies to non-natural use of land causing escape of hazardous substances" },
      { citation: "Sim v Stretch [1936]", principle: "Test for defamatory words is whether they lower plaintiff's standing among right-thinking members" },
    ],
    commonExamQuestions: [
      "Advise a doctor libeled in a professional WhatsApp group on actionable remedies under Cap 36.",
      "Discuss the defenses available against strict liability under Rylands v Fletcher.",
    ],
    tags: ["Torts", "Rylands v Fletcher", "Defamation", "Vicarious Liability"],
  },

  {
    id: "shar-121",
    courseCode: "SHAR 121",
    courseTitle: "Islamic Law of Transactions (Fiqh al-Muamalat I)",
    year: 1,
    semesterNumber: 2,
    semesterLabel: "Year 1 - Semester 2",
    subject: "Islamic Jurisprudence & Sharia",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Concept of contract (Aqd) in Shariah, essential pillars (Arkan), prohibitions of Riba (Usury), Gharar (Uncertainty), and Maysir (Gambling), and classic nominate contracts (Murabahah, Ijarah, Mudarabah, Musharakah).",
    topics: [
      {
        id: "shar121-t1",
        title: "Prohibited Elements in Islamic Transactions: Riba & Gharar",
        summary: "Prohibition of interest (Riba al-Fadl & Riba al-Nasi'ah) and excessive contractual uncertainty.",
        detailedNotes: `### Core Prohibitions:
- **Riba (Surah Al-Baqarah 2:275)**: Unjustified increment in loans or exchange of ribawi commodities.
- **Gharar**: Contractual ambiguity where consequences are hidden (*Bay' al-Gharar*).
- **Maysir / Qimar**: Zero-sum games of chance.`,
        keyStatutes: ["AAOIFI Sharia Standards", "Majallah al-Ahkam al-Adliyyah"],
        landmarkCases: ["Classical Islamic Jurisprudence on Ribawi Goods (Gold, Silver, Dates, Wheat, Barley, Salt)"],
        examTips: "Distinguish between minor tolerable Gharar (Gharar Yasir) and major voiding Gharar (Gharar Fahish).",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Article 170(5)", summary: "Kadhis' Court jurisdiction on Islamic civil transactions" },
    ],
    landmarkPrecedents: [
      { citation: "Al-Majallah al-Ahkam al-Adliyyah (Codified Ottoman Fiqh)", principle: "Codified Islamic civil transactions and contractual pillars" },
    ],
    commonExamQuestions: [
      "Critically contrast the Islamic prohibition of Riba with modern conventional banking interest rates.",
    ],
    tags: ["Fiqh al-Muamalat", "Riba", "Gharar", "Murabahah", "Islamic Finance"],
  },

  {
    id: "llb-124",
    courseCode: "LLB 124",
    courseTitle: "Criminal Law I (General Principles & Defenses)",
    year: 1,
    semesterNumber: 2,
    semesterLabel: "Year 1 - Semester 2",
    subject: "Criminal Law & Procedure",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Actus Reus and Mens Rea, strict liability offenses, inchoate offenses (attempt, conspiracy, incitement), parties to crimes, and general defenses under the Penal Code (Cap 63).",
    topics: [
      {
        id: "llb124-t1",
        title: "Actus Reus, Mens Rea & Burden of Proof",
        summary: "Concurrence of physical act and guilty mind; golden thread of prosecution proof (*Woolmington*).",
        detailedNotes: `### Fundamental Rules:
- **Actus non facit reum nisi mens sit rea**: An act does not make one guilty without a guilty mind.
- **Golden Thread (*Woolmington v DPP*)**: Prosecution bears burden of proving guilt beyond reasonable doubt throughout the trial.`,
        keyStatutes: ["Penal Code (Cap 63, Sections 9, 10)", "Evidence Act (Cap 80, Sec 107-111)"],
        landmarkCases: ["Woolmington v DPP [1935] AC 462", "R v Dudley and Stephens [1884] 14 QBD 273"],
        examTips: "Always cite Woolmington v DPP when stating the prosecution's standard of proof.",
      },
      {
        id: "llb124-t2",
        title: "General Defenses: Insanity, Intoxication & Self-Defense",
        summary: "Penal Code defenses: M'Naghten rules (Sec 12), involuntary intoxication (Sec 13), and proportional self-defense (Sec 17).",
        detailedNotes: `### Penal Code Defenses:
- **Insanity (Sec 12)**: Defect of reason from disease of the mind preventing understanding of nature/wrongfulness of the act.
- **Self-Defense (Sec 17)**: Reasonable and proportional force in defense of person or property.`,
        keyStatutes: ["Penal Code (Cap 63, Sections 12, 13, 17)"],
        landmarkCases: ["M'Naghten's Case [1843]", "Palmer v R [1971] AC 814"],
        examTips: "Self-defense is judged on facts as defendant honestly believed them to be.",
      },
    ],
    statutoryFramework: [
      { act: "Penal Code (Cap 63)", section: "Sections 9-22", summary: "General rules of criminal responsibility and defenses" },
    ],
    landmarkPrecedents: [
      { citation: "Woolmington v DPP [1935] AC 462", principle: "Prosecution bears the burden of proving guilt beyond reasonable doubt" },
      { citation: "R v Dudley and Stephens [1884]", principle: "Necessity is not a defense to murder" },
    ],
    commonExamQuestions: [
      "Evaluate the limits of the defense of Necessity in light of R v Dudley and Stephens.",
    ],
    tags: ["Criminal Law", "Mens Rea", "Woolmington", "Penal Code"],
  },
];
