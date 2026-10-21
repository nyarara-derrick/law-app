import { LawUnit } from "../types";

export const YEAR_4_LAW_UNITS: LawUnit[] = [
  // ================= YEAR 4 - SEMESTER 1 =================
  {
    id: "llb-411",
    courseCode: "LLB 411",
    courseTitle: "Alternative Dispute Resolution (ADR)",
    year: 4,
    semesterNumber: 1,
    semesterLabel: "Year 4 - Semester 1",
    subject: "Civil Procedure",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "ADR spectrum (negotiation, mediation, conciliation, arbitration), Court-Annexed Mediation (CAM), Arbitration Act (No. 4 of 1995), Kompetenz-Kompetenz doctrine, setting aside awards (Sec 35), and New York Convention enforcement (*Nyutu Agrovet*).",
    topics: [
      {
        id: "llb411-t1",
        title: "Arbitration Act 1995 & Setting Aside Awards (Section 35)",
        summary: "Finality of arbitral awards and strict statutory grounds for judicial intervention.",
        detailedNotes: `### Grounds under Section 35:
1. Party under incapacity or arbitration agreement invalid.
2. Party not given proper notice of arbitrator appointment or arbitral proceedings.
3. Award deals with dispute not contemplated by or falling within submission to arbitration.
4. Composition of tribunal or procedure was not in accordance with agreement.
5. Award is in conflict with public policy of Kenya.
- **Nyutu Agrovet [2019] KSC**: Limited right of appeal from High Court Sec 35 decisions to Court of Appeal only on exceptional circumstances.`,
        keyStatutes: ["Arbitration Act (No. 4 of 1995, Sec 10, 35, 36)", "Constitution of Kenya (Art 159(2)(c))"],
        landmarkCases: ["Nyutu Agrovet Ltd v Airtel Networks Kenya Ltd [2019] KSC", "Synergy Industrial Credit v Cape Holdings [2019]"],
        examTips: "Section 10 Arbitration Act prohibits court intervention except where specifically provided by statute.",
      },
    ],
    statutoryFramework: [
      { act: "Arbitration Act (No. 4 of 1995)", section: "Sections 10, 35, 36", summary: "Court non-intervention and setting aside of arbitral awards" },
    ],
    landmarkPrecedents: [
      { citation: "Nyutu Agrovet Ltd v Airtel Networks [2019] KSC", principle: "Court of Appeal has limited jurisdiction to hear appeals from Section 35 decisions to prevent grave injustice" },
    ],
    commonExamQuestions: [
      "Critically evaluate the principle of minimal judicial interference in arbitration under Section 10 and 35 of the Arbitration Act.",
    ],
    tags: ["ADR", "Arbitration", "Nyutu Agrovet", "Section 35", "Mediation"],
  },

  {
    id: "llb-412",
    courseCode: "LLB 412",
    courseTitle: "Intellectual Property Law",
    year: 4,
    semesterNumber: 1,
    semesterLabel: "Year 4 - Semester 1",
    subject: "Commercial & Corporate Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Copyright Act (Cap 130), Trade Marks Act (Cap 506), Industrial Property Act 2001 (patents, industrial designs, utility models), passing off, and traditional knowledge protection.",
    topics: [
      {
        id: "llb412-t1",
        title: "Copyright Law & Infringement (Cap 130)",
        summary: "Originality requirement, economic and moral rights, fair dealing exceptions, and enforcement.",
        detailedNotes: `### Core Copyright Rules:
- **Eligibility**: Original work reduced to material form (*Section 22 Cap 130*).
- **Rights Granted**: Reproduction, distribution, public performance, translation, and adaptation.
- **Moral Rights**: Right of paternity (attribution) and integrity (against distortion).
- **Fair Dealing Exceptions**: Research, private study, criticism, review, reporting current events.`,
        keyStatutes: ["Copyright Act (Cap 130)", "Trade Marks Act (Cap 506)", "Industrial Property Act 2001"],
        landmarkCases: ["Alternative Approach Ltd v Safaricom [2014] eKLR", "Reckitt & Colman v Borden (Jif Lemon Case) [1990]"],
        examTips: "Copyright protects expression of ideas, not ideas themselves.",
      },
    ],
    statutoryFramework: [
      { act: "Copyright Act (Cap 130)", section: "Sections 22, 26, 35", summary: "Protected works, rights of authors, and civil remedies for infringement" },
    ],
    landmarkPrecedents: [
      { citation: "Alternative Approach Ltd v Safaricom [2014]", principle: "Clear threshold for proving ownership of original copyright expression in commercial promotions" },
    ],
    commonExamQuestions: [
      "Distinguish between trademark infringement under Cap 506 and the common law tort of passing off.",
    ],
    tags: ["Intellectual Property", "Copyright", "Trademarks", "Patents"],
  },

  {
    id: "llb-413",
    courseCode: "LLB 413",
    courseTitle: "Banking & Negotiable Instruments Law",
    year: 4,
    semesterNumber: 1,
    semesterLabel: "Year 4 - Semester 1",
    subject: "Commercial & Corporate Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Banker-customer contractual relationship, duty of confidentiality (*Tournier*), Bills of Exchange Act (Cap 27: cheques, promissory notes, holder in due course), and mobile banking under the National Payment System Act 2011.",
    topics: [
      {
        id: "llb413-t1",
        title: "Banker's Duty of Confidentiality & The Tournier Exceptions",
        summary: "Fiduciary duty of secrecy owed by banks to customers and four lawful exceptions.",
        detailedNotes: `### 4 Tournier Exceptions (Tournier v National Provincial Bank [1924]):
1. Where disclosure is under compulsion of law (e.g., court order under Evidence Act Banker's Books).
2. Where there is a public duty to disclose (e.g., anti-money laundering / POCAMLA).
3. Where the interests of the bank require disclosure (e.g., suing on an overdraft).
4. Where disclosure is made by the express or implied consent of the customer.`,
        keyStatutes: ["Bills of Exchange Act (Cap 27)", "Banking Act (Cap 488)", "POCAMLA 2009", "Data Protection Act 2019"],
        landmarkCases: ["Tournier v National Provincial and Union Bank of England [1924] 1 KB 461", "Foley v Hill [1848]"],
        examTips: "The banker-customer relationship is debtor-creditor, not trustee-beneficiary (*Foley v Hill*).",
      },
    ],
    statutoryFramework: [
      { act: "Bills of Exchange Act (Cap 27)", section: "Sections 3-29, 73-82", summary: "Form, negotiation, and crossing of cheques" },
    ],
    landmarkPrecedents: [
      { citation: "Tournier v National Provincial Bank [1924] 1 KB 461", principle: "Established the banker's duty of confidentiality and four permissible exceptions" },
    ],
    commonExamQuestions: [
      "Critically examine the scope of the banker's duty of confidentiality and evaluate its modern exceptions under Kenyan law.",
    ],
    tags: ["Banking Law", "Tournier", "Confidentiality", "Bills of Exchange"],
  },

  {
    id: "shar-401",
    courseCode: "SHAR 401",
    courseTitle: "Islamic Law of Treaties & International Relations (Siyar)",
    year: 4,
    semesterNumber: 1,
    semesterLabel: "Year 4 - Semester 1",
    subject: "Islamic Jurisprudence & Sharia",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Concept of Siyar (Islamic international law), classical territorial divisions (Dar al-Islam, Dar al-Harb, Dar al-Ahd), law of treaties (Mu'ahadat), diplomatic immunity (Aman), and rules of warfare.",
    topics: [
      {
        id: "shar401-t1",
        title: "Sanctity of Treaties (Mu'ahadat) in Shariah",
        summary: "Binding force of agreements under Quranic commands (Surah Al-Ma'idah 5:1) and the model of Sulh al-Hudaybiyyah.",
        detailedNotes: `### Core Principles of Siyar:
- **Pacta Sunt Servanda**: Treaties must be fulfilled strictly (*Awfu bil-Uqud*).
- **Protection of Envoys**: Diplomatic immunity is guaranteed under the institution of *Aman*.
- **Rules of Conduct in Hostilities**: Prohibition of killing non-combatants (women, children, monks), destruction of fruit-bearing trees, and poisoning wells.`,
        keyStatutes: ["Kitab al-Siyar al-Kabir (Imam al-Shaybani)", "Vienna Convention on Law of Treaties 1969"],
        landmarkCases: ["Treaty of Hudaybiyyah (Model Islamic Treaty Practice)"],
        examTips: "Highlight that Islamic international law recognized principles of treaty sanctity centuries before the Vienna Convention.",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Article 2(5) & 2(6)", summary: "Treaties ratified by Kenya form part of Kenyan law" },
    ],
    landmarkPrecedents: [
      { citation: "Kitab al-Siyar al-Kabir by Imam Muhammad al-Shaybani", principle: "First comprehensive treatise on international law and rights of ambassadors" },
    ],
    commonExamQuestions: [
      "Examine the doctrine of sanctity of treaties in Islamic jurisprudence and compare it with the international law principle of pacta sunt servanda.",
    ],
    tags: ["Siyar", "Islamic International Law", "Treaties", "Aman"],
  },

  // ================= YEAR 4 - SEMESTER 2 =================
  {
    id: "llb-421",
    courseCode: "LLB 421",
    courseTitle: "Legal Ethics, Professional Conduct & CLE Prep",
    year: 4,
    semesterNumber: 2,
    semesterLabel: "Year 4 - Semester 2",
    subject: "Civil Procedure",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Advocates Act (Cap 16), Law Society of Kenya (LSK Act 2014), Advocates (Remuneration) Order, duties to court, client, and colleagues, conflict of interest, disciplinary proceedings, and preparation for Kenya School of Law (KSL) bar exams.",
    topics: [
      {
        id: "llb421-t1",
        title: "Advocate's Duties: Duty to Court vs Duty to Client",
        summary: "Paramountcy of duty to the court as a minister of justice; conflict of interest and professional misconduct.",
        detailedNotes: `### Core Ethical Tenets:
- **Paramount Duty to Court (*Rondel v Worsley*)**: An advocate's duty to the court overrides duty to the client; cannot mislead the court or suppress binding adverse precedents.
- **Advocate-Client Privilege**: Absolute confidentiality under Evidence Act Section 134.
- **Professional Misconduct**: Commingling client funds with office accounts; disciplinary committee sanctions under Section 60 Advocates Act.`,
        keyStatutes: ["Advocates Act (Cap 16, Sections 55-60)", "Law Society of Kenya Act 2014", "Evidence Act (Cap 80, Sec 134)"],
        landmarkCases: ["Rondel v Worsley [1969] 1 AC 191", "Kingwool Mills Ltd v Kapila & Co Advocates [2004] eKLR"],
        examTips: "Remember: Client money MUST be held in a separate designated Client Bank Account at all times.",
      },
    ],
    statutoryFramework: [
      { act: "Advocates Act (Cap 16)", section: "Sections 55-60", summary: "Disciplinary proceedings and professional conduct rules" },
      { act: "Law Society of Kenya Act 2014", section: "Sections 4-6", summary: "Objects and disciplinary mandate of LSK" },
    ],
    landmarkPrecedents: [
      { citation: "Rondel v Worsley [1969] 1 AC 191", principle: "An advocate's overriding duty is to the court and administration of justice" },
    ],
    commonExamQuestions: [
      "Critically discuss an advocate's overriding duty to the court and how to resolve ethical tensions when a client confesses guilt in private.",
    ],
    tags: ["Legal Ethics", "Advocates Act", "Professional Conduct", "Rondel v Worsley", "CLE"],
  },

  {
    id: "llb-422",
    courseCode: "LLB 422",
    courseTitle: "Insurance Law & Consumer Protection",
    year: 4,
    semesterNumber: 2,
    semesterLabel: "Year 4 - Semester 2",
    subject: "Commercial & Corporate Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Fundamental principles: Utmost Good Faith (*Uberrimae Fidei* & duty of disclosure in *Carter v Boehm*), Insurable Interest, Indemnity, Subrogation, Contribution, Insurance Act (Cap 487), and Consumer Protection Act 2012.",
    topics: [
      {
        id: "llb422-t1",
        title: "Utmost Good Faith (Uberrimae Fidei) & Non-Disclosure",
        summary: "Duty to disclose all material facts known to insured before policy conclusion (*Carter v Boehm*).",
        detailedNotes: `### Core Insurance Principles:
- **Uberrimae Fidei (*Carter v Boehm*)**: Insured must disclose every circumstance which would influence judgment of a prudent underwriter.
- **Doctrine of Subrogation (*Castellain v Preston*)**: Insurer steps into shoes of insured against third party wrongdoer after paying indemnity.
- **Insurable Interest**: Insured must stand to suffer financial loss upon damage to insured subject matter.`,
        keyStatutes: ["Insurance Act (Cap 487)", "Consumer Protection Act 2012", "Insurance (Motor Vehicles Third Party Risks) Act (Cap 405)"],
        landmarkCases: ["Carter v Boehm [1766] 3 Burr 1905", "Castellain v Preston [1883] 11 QBD 380"],
        examTips: "Indemnity insurance does not allow the insured to recover more than the actual loss suffered.",
      },
    ],
    statutoryFramework: [
      { act: "Insurance Act (Cap 487)", section: "Part VII", summary: "Regulation of insurance policies and settlement of claims" },
    ],
    landmarkPrecedents: [
      { citation: "Carter v Boehm [1766]", principle: "Insurance is a contract of utmost good faith requiring disclosure of all material facts" },
    ],
    commonExamQuestions: [
      "Explain the doctrine of Subrogation and illustrate how it prevents the insured from making a double recovery.",
    ],
    tags: ["Insurance Law", "Uberrimae Fidei", "Subrogation", "Carter v Boehm"],
  },

  {
    id: "shar-402",
    courseCode: "SHAR 402",
    courseTitle: "Contemporary Legal Issues & Maqasid al-Shariah",
    year: 4,
    semesterNumber: 2,
    semesterLabel: "Year 4 - Semester 2",
    subject: "Islamic Jurisprudence & Sharia",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "The Five Essential Objectives of Shariah (Maqasid: Din, Nafs, Aql, Nasl, Mal), contemporary bioethics (organ donation, IVF), Islamic FinTech and cryptocurrency, environmental stewardship (Khilafah), and Islamic legal maxims (*Al-Qawa'id al-Fiqhiyyah*).",
    topics: [
      {
        id: "shar402-t1",
        title: "The Five Essentials of Maqasid al-Shariah & Modern Ijtihad",
        summary: "Preservation of Faith, Life, Intellect, Lineage, and Wealth as the normative basis for resolving modern legal dilemmas.",
        detailedNotes: `### Al-Daruriyyat al-Khamsah (Five Essentials):
1. **Hifdh al-Din**: Protection of Religion/Faith.
2. **Hifdh al-Nafs**: Protection of Human Life.
3. **Hifdh al-Aql**: Protection of Intellect/Mind.
4. **Hifdh al-Nasl**: Protection of Lineage/Family.
5. **Hifdh al-Mal**: Protection of Property/Wealth.
- **Major Legal Maxims**:
  - *Al-Umuru bi-Maqasidiha* (Matters are judged by intentions).
  - *Al-Dararu Yuzal* (Harm must be eliminated).
  - *Al-Yaqinu la Yazulu bish-Shakk* (Certainty is not overruled by doubt).`,
        keyStatutes: ["Al-Muwafaqat by Imam Al-Shatibi", "Al-Mustasfa by Imam Al-Ghazali"],
        landmarkCases: ["Resolutions of the International Islamic Fiqh Academy (OIC/IIFA)"],
        examTips: "Use Maqasid al-Shariah framework when analyzing novel legal scenarios (e.g. AI ethics, surrogacy, digital currencies).",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Articles 10, 170", summary: "National values and recognition of Shariah jurisdiction" },
    ],
    landmarkPrecedents: [
      { citation: "Al-Muwafaqat fi Usul al-Shari'ah by Imam Abu Ishaq al-Shatibi", principle: "All Shariah rulings exist to serve human welfare (Maslahah) and prevent harm (Mafsadah)" },
    ],
    commonExamQuestions: [
      "Critically analyze how the Five Objectives of Maqasid al-Shariah guide contemporary legal rulings on bioethics and digital assets.",
    ],
    tags: ["Maqasid al-Shariah", "Bioethics", "Fiqh Maxims", "Modern Ijtihad"],
  },

  {
    id: "llb-425",
    courseCode: "LLB 425",
    courseTitle: "Conveyancing Law & Practice",
    year: 4,
    semesterNumber: 2,
    semesterLabel: "Year 4 - Semester 2",
    subject: "Land Law & Property",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Stages of land conveyance in Kenya, investigation of title, drafting contract of sale, Law Society of Kenya Conditions of Sale (2015), professional undertakings, digital land transactions (ArdhiSasa), and registration at the Land Registry.",
    topics: [
      {
        id: "llb425-t1",
        title: "Conveyancing Stages & Professional Undertakings",
        summary: "Pre-contract investigation, contract execution, completion, registration, and strict enforceability of advocate undertakings.",
        detailedNotes: `### Stages of Conveyancing:
1. **Pre-Contract Stage**: Official search at Land Registry, requisition on title, site inspection.
2. **Contract Stage**: Drafting agreement for sale conforming with Section 3(3) Law of Contract Act (in writing, signed, witnessed).
3. **Post-Contract / Completion Stage**: Obtaining rates clearance, land rent clearance, consent to transfer, execution of transfer instrument, payment of Stamp Duty.
4. **Registration Stage**: Presentation of documents for registration at Land Registry.
- **Professional Undertakings**: Unconditional promise by an advocate to do or refrain from doing an act; enforceable summarily by court under Section 56 Advocates Act.`,
        keyStatutes: ["Land Registration Act 2012", "Stamp Duty Act (Cap 480)", "LSK Conditions of Sale 2015", "Advocates Act (Cap 16, Sec 56)"],
        landmarkCases: ["Kuldip Singh v Kuldip Kaur [1997] eKLR", "Kenya Commercial Bank v Specialty Organics Ltd [2002]"],
        examTips: "Breach of a professional undertaking is serious professional misconduct subjecting an advocate to summary disciplinary committal.",
      },
    ],
    statutoryFramework: [
      { act: "Land Registration Act 2012", section: "Sections 36-54", summary: "Instruments of transfer, searches, and registration of land dispositions" },
      { act: "Stamp Duty Act (Cap 480)", section: "Section 5", summary: "Assessment and payment of stamp duty on transfers" },
    ],
    landmarkPrecedents: [
      { citation: "Kuldip Singh v Kuldip Kaur [1997] eKLR", principle: "Professional undertakings given by advocates are sacrosanct and strictly enforceable" },
    ],
    commonExamQuestions: [
      "Outline the four distinct stages of land conveyancing in Kenya and discuss the legal effect of an advocate's professional undertaking.",
    ],
    tags: ["Conveyancing", "ArdhiSasa", "Professional Undertakings", "Land Registration", "LSK Conditions"],
  },
];
