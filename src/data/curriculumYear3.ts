import { LawUnit } from "../types";

export const YEAR_3_LAW_UNITS: LawUnit[] = [
  // ================= YEAR 3 - SEMESTER 1 =================
  {
    id: "llb-311",
    courseCode: "LLB 311",
    courseTitle: "Civil Procedure I",
    year: 3,
    semesterNumber: 1,
    semesterLabel: "Year 3 - Semester 1",
    subject: "Civil Procedure",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Civil Procedure Act (Cap 21) & Civil Procedure Rules 2010, overriding objective (Oxygen principle Article 159), pecuniary and territorial jurisdiction, pleadings (Plaint, Defense, Counterclaim), interlocutory applications, and temporary injunctions under the Giella v Cassman Brown test.",
    topics: [
      {
        id: "llb311-t1",
        title: "Temporary Injunctions: The Giella v Cassman Brown Test",
        summary: "The 3 sequential conditions for interlocutory injunctive relief in Kenyan civil courts.",
        detailedNotes: `### The Giella Triad (Giella v Cassman Brown & Co Ltd [1973]):
1. **Prima Facie Case with Probability of Success**: Applicant must show an arguable right infringed.
2. **Irreparable Injury**: Harm that cannot be adequately compensated by damages.
3. **Balance of Convenience**: If court is in doubt, it weighs balance of convenience between parties.`,
        keyStatutes: ["Civil Procedure Act (Cap 21, Sec 63)", "Civil Procedure Rules 2010 (Order 40)"],
        landmarkCases: ["Giella v Cassman Brown & Co Ltd [1973] EA 358", "American Cyanamid v Ethicon [1975] AC 396", "Mrao Ltd v First American Bank [2003] KLR 125"],
        examTips: "The three limbs are sequential and cumulative; failure to prove irreparable injury means damages suffice.",
      },
      {
        id: "llb311-t2",
        title: "Jurisdiction & The Rule in Owners of Motor Vessel Lillian S",
        summary: "Pecuniary and territorial jurisdiction; court must down its tools without jurisdiction.",
        detailedNotes: `### Core Jurisdictional Rules:
- **Jurisdiction is Everything**: A court cannot confer jurisdiction upon itself where none exists by statute (*Lillian S*).
- **Section 11-18 CPA**: Territorial jurisdiction follows where cause of action arose or defendant resides.`,
        keyStatutes: ["Civil Procedure Act (Cap 21, Sections 11-18)", "Magistrates' Courts Act 2015"],
        landmarkCases: ["Owners of Motor Vessel 'Lillian S' v Caltex Oil Kenya Ltd [1989] KLR 1", "Samuel Kamau Macharia v KCB [2012] KSC"],
        examTips: "Always raise a preliminary objection on jurisdiction at the earliest opportunity.",
      },
    ],
    statutoryFramework: [
      { act: "Civil Procedure Act (Cap 21)", section: "Sections 1A, 1B, 11-18, 63", summary: "Overriding objective, jurisdiction, and interlocutory orders" },
      { act: "Civil Procedure Rules 2010", section: "Orders 1, 2, 4, 7, 40", summary: "Pleadings, summons, defenses, and injunctions" },
    ],
    landmarkPrecedents: [
      { citation: "Giella v Cassman Brown & Co Ltd [1973] EA 358", principle: "Established the three mandatory sequential conditions for granting interlocutory injunctions" },
      { citation: "Owners of Motor Vessel 'Lillian S' v Caltex Oil [1989]", principle: "Jurisdiction is threshold; court must down tools if it lacks statutory jurisdiction" },
    ],
    commonExamQuestions: [
      "Draft an application for temporary injunction and outline the legal submissions under Giella v Cassman Brown.",
      "Analyze the concept of jurisdiction in light of Owners of Motor Vessel Lillian S.",
    ],
    tags: ["Civil Procedure", "Giella", "Injunctions", "Lillian S", "Pleadings"],
  },

  {
    id: "llb-312",
    courseCode: "LLB 312",
    courseTitle: "Criminal Procedure & Practice",
    year: 3,
    semesterNumber: 1,
    semesterLabel: "Year 3 - Semester 1",
    subject: "Criminal Law & Procedure",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Criminal Procedure Code (Cap 75), arrest and constitutional rights of accused (Art 49), bail and bond principles, charge drafting, plea taking, trial procedure, case to answer (Sec 211), and sentencing.",
    topics: [
      {
        id: "llb312-t1",
        title: "Bail & Bond Rights under Article 49(1)(h)",
        summary: "Constitutional right to bail on reasonable conditions unless compelling reasons exist.",
        detailedNotes: `### Core Rules:
- **Article 49(1)(h) COK 2010**: An arrested person has right to be released on bond or bail, on reasonable conditions, pending charge or trial, unless there are compelling reasons.
- **Compelling Reasons**: Flight risk, interference with witnesses, threat to public safety.`,
        keyStatutes: ["Constitution of Kenya (Art 49(1)(h))", "Criminal Procedure Code (Cap 75, Sec 123)", "National Bail and Bond Policy Guidelines 2015"],
        landmarkCases: ["Republic v Mwangi [2016]", "Kahindi & 2 Others v Republic [2012] eKLR"],
        examTips: "The burden of proving 'compelling reasons' rests entirely on the prosecution.",
      },
    ],
    statutoryFramework: [
      { act: "Criminal Procedure Code (Cap 75)", section: "Sections 123-133, 211", summary: "Bail provisions and prima facie case determination" },
    ],
    landmarkPrecedents: [
      { citation: "Murungaru v Republic [2006]", principle: "Right to bail is a fundamental constitutional guarantee that cannot be arbitrarily denied" },
    ],
    commonExamQuestions: [
      "Critically discuss the constitutional standards for denying bail under Article 49(1)(h) and the 2015 Bail Guidelines.",
    ],
    tags: ["Criminal Procedure", "Bail and Bond", "Article 49", "Cap 75"],
  },

  {
    id: "llb-313",
    courseCode: "LLB 313",
    courseTitle: "Company Law & Corporate Governance",
    year: 3,
    semesterNumber: 1,
    semesterLabel: "Year 3 - Semester 1",
    subject: "Commercial & Corporate Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Separate legal personality (*Salomon v Salomon*), lifting the corporate veil, Companies Act (No. 17 of 2015), pre-incorporation contracts (Sec 43), directors' codified duties (Sec 140-150), and minority protection (*Foss v Harbottle*).",
    topics: [
      {
        id: "llb313-t1",
        title: "Separate Legal Personality & Piercing the Veil",
        summary: "The veil of incorporation in *Salomon* and judicial/statutory grounds for lifting it.",
        detailedNotes: `### Core Doctrines:
- **Salomon v Salomon & Co Ltd [1897]**: A registered company is an independent legal person distinct from its subscribers.
- **Lifting the Veil**:
  1. Fraud / Sham / Facade (*Gilford Motor Co v Horne*, *Jones v Lipman*).
  2. Evasion of legal obligations (*Prest v Petrodel Resources*).
  3. Statutory grounds (Insolvency Act trading under fraudulent circumstances).`,
        keyStatutes: ["Companies Act (No. 17 of 2015, Sections 15, 43, 140-150)", "Insolvency Act 2015"],
        landmarkCases: ["Salomon v A. Salomon & Co Ltd [1897] AC 22", "Prest v Petrodel Resources Ltd [2013] UKSC 34", "Lee v Lee's Air Farming [1961]"],
        examTips: "Cite Prest v Petrodel [2013] for the modern distinction between evasion principle and concealment principle.",
      },
      {
        id: "llb313-t2",
        title: "Directors' Codified Duties (Sections 140-150 Companies Act 2015)",
        summary: "Duties to act within powers, promote success of company, exercise independent judgment, and avoid conflicts of interest.",
        detailedNotes: `### Key Codified Duties:
- **Sec 143**: Duty to promote the success of the company.
- **Sec 144**: Duty to exercise independent judgment.
- **Sec 145**: Duty to exercise reasonable care, skill and diligence.
- **Sec 146**: Duty to avoid conflicts of interest.`,
        keyStatutes: ["Companies Act 2015 (Sections 140-150)"],
        landmarkCases: ["Howard Smith Ltd v Ampol Petroleum [1974] AC 821", "Regal (Hastings) Ltd v Gulliver [1942] 1 All ER 378"],
        examTips: "Directors' duties are owed strictly to the company as a whole, not to individual shareholders.",
      },
    ],
    statutoryFramework: [
      { act: "Companies Act (No. 17 of 2015)", section: "Sections 15, 43, 140-150", summary: "Corporate personality, pre-incorporation contracts and directors' duties" },
    ],
    landmarkPrecedents: [
      { citation: "Salomon v A. Salomon & Co Ltd [1897] AC 22", principle: "A company is at law a different person altogether from the subscribers to the memorandum" },
      { citation: "Prest v Petrodel Resources Ltd [2013] UKSC 34", principle: "Corporate veil can only be pierced under the evasion principle where a legal obligation is deliberately thwarted" },
    ],
    commonExamQuestions: [
      "Critically evaluate the doctrine of separate legal personality and the circumstances under which Kenyan courts will pierce the corporate veil.",
      "Discuss the codified directors' duties under Part IX of the Companies Act 2015.",
    ],
    tags: ["Company Law", "Salomon", "Corporate Veil", "Directors Duties"],
  },

  {
    id: "shar-301",
    courseCode: "SHAR 301",
    courseTitle: "Islamic Banking, Finance & Takaful",
    year: 3,
    semesterNumber: 1,
    semesterLabel: "Year 3 - Semester 1",
    subject: "Commercial & Corporate Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Shariah governance frameworks, deposit and financing modes (Murabahah, Ijarah Muntahiyah Bittamleek, Istisna'a, Salam, Mudarabah, Musharakah), Sukuk securitization, Takaful mutual insurance, and Central Bank of Kenya regulatory windows.",
    topics: [
      {
        id: "shar301-t1",
        title: "Islamic Financing Structures & Shariah Governance",
        summary: "Asset-backed financing models and Shariah Supervisory Board compliance.",
        detailedNotes: `### Core Financing Modes:
- **Murabahah**: Cost-plus-profit sale where bank buys asset and resells to customer with agreed markup.
- **Ijarah**: Lease contract ending with transfer of asset ownership (*Ijarah Muntahiyah Bittamleek*).
- **Mudarabah & Musharakah**: Profit-sharing and joint equity partnership.
- **Takaful (Islamic Insurance)**: Based on mutual assistance (*Ta'awun*) and voluntary donation (*Tabarru*), free from Riba and Gharar.`,
        keyStatutes: ["Central Bank of Kenya Prudential Guidelines", "Insurance Act (Cap 487 Sharia Window Provisions)"],
        landmarkCases: ["AAOIFI Standards on Islamic Financial Contracts"],
        examTips: "In Murabahah, the bank must acquire constructive or physical ownership of goods before resale.",
      },
    ],
    statutoryFramework: [
      { act: "Central Bank of Kenya Act (Cap 491)", section: "Section 33", summary: "Regulatory approvals for Islamic banking products" },
    ],
    landmarkPrecedents: [
      { citation: "AAOIFI Shariah Standard No. 8 (Murabahah)", principle: "Bank must bear ownership risk prior to concluding the sale to the client" },
    ],
    commonExamQuestions: [
      "Compare and contrast the Takaful mutual donation model with conventional commercial insurance.",
    ],
    tags: ["Islamic Banking", "Finance", "Takaful", "Sukuk", "Murabahah"],
  },

  {
    id: "llb-314",
    courseCode: "LLB 314",
    courseTitle: "Environmental Law & Natural Resources",
    year: 3,
    semesterNumber: 1,
    semesterLabel: "Year 3 - Semester 1",
    subject: "Land Law & Property",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Principles of environmental management (sustainable development, precautionary principle, polluter pays, intergenerational equity), Articles 42, 69-72 COK 2010, EMCA (Cap 387), Environment and Land Court, and Environmental Impact Assessments (EIA).",
    topics: [
      {
        id: "llb314-t1",
        title: "Environmental Principles & Article 42 COK 2010",
        summary: "Right to a clean and healthy environment, locus standi (Art 70), and EMCA compliance.",
        detailedNotes: `### Key Principles under EMCA Cap 387:
- **Precautionary Principle**: Lack of full scientific certainty shall not be used as reason for postponing cost-effective measures.
- **Polluter-Pays Principle**: Cost of pollution prevention/remediation borne by polluter.
- **Article 70 Locus Standi**: Any person may apply to court to enforce environmental rights without proving personal loss.`,
        keyStatutes: ["Constitution of Kenya 2010 (Art 42, 69, 70)", "EMCA (Cap 387)", "Environment and Land Court Act 2011"],
        landmarkCases: ["Peter K. Waweru v Republic [2006] eKLR", "Friends of Lake Turkana v Attorney General [2014]"],
        examTips: "Highlight that Article 70 eliminated traditional locus standi hurdles in environmental litigation.",
      },
    ],
    statutoryFramework: [
      { act: "EMCA (Cap 387)", section: "Sections 3, 58", summary: "Environmental principles and mandatory Environmental Impact Assessments" },
    ],
    landmarkPrecedents: [
      { citation: "Peter K. Waweru v Republic [2006] eKLR", principle: "Right to life under the Constitution encompasses the right to a clean and healthy environment" },
    ],
    commonExamQuestions: [
      "Discuss the legal application of the Polluter-Pays and Precautionary principles in Kenyan courts.",
    ],
    tags: ["Environmental Law", "EMCA", "Article 42", "Precautionary Principle"],
  },

  // ================= YEAR 3 - SEMESTER 2 =================
  {
    id: "llb-321",
    courseCode: "LLB 321",
    courseTitle: "Civil Procedure II (Execution & Appeals)",
    year: 3,
    semesterNumber: 2,
    semesterLabel: "Year 3 - Semester 2",
    subject: "Civil Procedure",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Pre-trial conferences (Order 11 CPR), trial process, judgment and decree drafting, execution mechanisms (attachment, garnishee proceedings, arrest/committal), review, revision, and appellate jurisdiction to the Court of Appeal and Supreme Court.",
    topics: [
      {
        id: "llb321-t1",
        title: "Execution of Decrees & Garnishee Proceedings",
        summary: "Modes of executing money decrees; attaching debts owed to judgment debtor by third parties.",
        detailedNotes: `### Execution Modes (Section 38 CPA):
1. Delivery of specific property.
2. Attachment and sale of property.
3. Arrest and detention in civil jail.
4. Appointment of a receiver.
5. **Garnishee Order (Order 23 CPR)**: Order Nisi attaching bank balance -> Order Absolute ordering bank to pay judgment creditor directly.`,
        keyStatutes: ["Civil Procedure Act (Cap 21, Sec 38)", "Civil Procedure Rules 2010 (Orders 22, 23)"],
        landmarkCases: ["Shah v Patel [1961] EA 397", "National Bank of Kenya v Wilson Ndolo Ayah [2009]"],
        examTips: "A garnishee order cannot attach funds held by a bank on trust for third parties.",
      },
    ],
    statutoryFramework: [
      { act: "Civil Procedure Act (Cap 21)", section: "Sections 38, 79G, 80", summary: "Execution of decrees, appeals, and review" },
    ],
    landmarkPrecedents: [
      { citation: "Nicholas Kiptoo Arap Salat v IEBC [2014] KSC", principle: "Principles governing extension of time to file appeals in the Supreme Court" },
    ],
    commonExamQuestions: [
      "Explain the step-by-step procedure for obtaining a Garnishee Order Absolute under Order 23 CPR.",
    ],
    tags: ["Civil Procedure", "Execution", "Garnishee", "Appeals"],
  },

  {
    id: "llb-322",
    courseCode: "LLB 322",
    courseTitle: "Law of Succession & Probate Administration",
    year: 3,
    semesterNumber: 2,
    semesterLabel: "Year 3 - Semester 2",
    subject: "Islamic Family Law & Succession (Mirath)",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Law of Succession Act (Cap 160), testamentary capacity and formal execution of wills (Sec 11), revocation of wills, intestate succession (Part V), dependants' provision (Sec 26-28), probate and administration, and Sharia exemptions (Sec 2(3)&(4)).",
    topics: [
      {
        id: "llb322-t1",
        title: "Formalities of a Valid Will (Section 11 Cap 160)",
        summary: "Writing, signature by testator, and attestation by two competent witnesses present at the same time.",
        detailedNotes: `### Section 11 Requirements:
1. Written document.
2. Signed by testator (or signed by another in testator's presence and direction).
3. Testator's signature made or acknowledged in presence of two or more competent witnesses.
4. Each witness must sign in the presence of the testator.`,
        keyStatutes: ["Law of Succession Act (Cap 160, Sections 11, 26, 76)"],
        landmarkCases: ["In re Estate of Lerionka Ole Ntutu [2008] eKLR", "Banks v Goodfellow [1870] LR 5 QB 549"],
        examTips: "A beneficiary who witnesses a will forfeits their gift under Section 13(2) Cap 160.",
      },
      {
        id: "llb322-t2",
        title: "Dependants' Relief (Sections 26-28 Cap 160)",
        summary: "Discretion of High Court to order reasonable provision for disinherited dependants.",
        detailedNotes: `### Section 26 Court Powers:
Where a testator has not made reasonable provision for dependants (spouse, children, parents), the court may order periodic or lump sum provision out of the net estate.`,
        keyStatutes: ["Law of Succession Act (Cap 160, Sec 26-29)"],
        landmarkCases: ["In re Estate of Stone Kathuli Muinde [1984]", "Re Estate of Lerionka Ole Ntutu [2008]"],
        examTips: "A married daughter is still a dependant if she was being maintained by the deceased prior to death.",
      },
    ],
    statutoryFramework: [
      { act: "Law of Succession Act (Cap 160)", section: "Sections 11, 26, 29, 76", summary: "Execution of wills, dependants, and revocation of grants" },
    ],
    landmarkPrecedents: [
      { citation: "In re Estate of Lerionka Ole Ntutu [2008] eKLR", principle: "Equal right of daughters to inherit ancestral land regardless of customary bias" },
    ],
    commonExamQuestions: [
      "Critically evaluate the statutory requirements for executing a valid written will under Section 11 of Cap 160.",
    ],
    tags: ["Succession", "Wills", "Section 11", "Cap 160", "Probate"],
  },

  {
    id: "llb-323",
    courseCode: "LLB 323",
    courseTitle: "Family Law & Domestic Relations",
    year: 3,
    semesterNumber: 2,
    semesterLabel: "Year 3 - Semester 2",
    subject: "Islamic Family Law & Succession (Mirath)",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Systems of marriage under Marriage Act (No. 4 of 2014), Matrimonial Property Act (No. 49 of 2013) and landmark Supreme Court 50/50 division rulings, custody, maintenance, and the Children Act 2022.",
    topics: [
      {
        id: "llb323-t1",
        title: "Matrimonial Property Division & Proven Contribution",
        summary: "Rejection of automatic 50/50 split; division based on direct and non-monetary proven contribution.",
        detailedNotes: `### Supreme Court Decision in Joseph Ombogi Oigo v Mary Chemweno [2023]:
- Article 45(3) guarantees equality during marriage and at dissolution, but does NOT mean automatic mathematical 50/50 division.
- Section 7 Matrimonial Property Act 2013: Matrimonial property vests in spouses according to contribution made by each.
- Contribution includes domestic work, childcare, companionship, and farm work (non-monetary).`,
        keyStatutes: ["Matrimonial Property Act (No. 49 of 2013, Sec 7)", "Marriage Act 2014", "Children Act 2022"],
        landmarkCases: ["Joseph Ombogi Oigo v Mary Chemweno [2023] KSC", "PVA v EB [2015] eKLR", "Echaria v Echaria [2007] eKLR"],
        examTips: "Always cite Joseph Ombogi Oigo [2023] KSC when discussing matrimonial property division in Kenya.",
      },
    ],
    statutoryFramework: [
      { act: "Matrimonial Property Act 2013", section: "Sections 7, 9", summary: "Division of matrimonial property and non-monetary contribution" },
      { act: "Children Act 2022", section: "Section 8", summary: "Best interests of the child as primary consideration" },
    ],
    landmarkPrecedents: [
      { citation: "Joseph Ombogi Oigo v Mary Chemweno [2023] KSC", principle: "Article 45(3) does not mandate automatic 50/50 split; division is strictly based on proven direct/indirect contribution" },
    ],
    commonExamQuestions: [
      "Critically analyze the Supreme Court judgment in Joseph Ombogi Oigo v Mary Chemweno regarding matrimonial property division.",
    ],
    tags: ["Family Law", "Matrimonial Property", "Marriage Act", "Ombogi Oigo"],
  },

  {
    id: "shar-302",
    courseCode: "SHAR 302",
    courseTitle: "Islamic Dispute Resolution (Tahkim & Sulh)",
    year: 3,
    semesterNumber: 2,
    semesterLabel: "Year 3 - Semester 2",
    subject: "Islamic Jurisprudence & Sharia",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Foundations of Sulh (amicable settlement) and Tahkim (arbitration) in Islamic jurisprudence, qualifications of a Muhakkam (arbitrator), Kadhis' Courts civil procedure under Article 170(5), and alignment with Kenyan Arbitration Act 1995.",
    topics: [
      {
        id: "shar302-t1",
        title: "Sulh & Tahkim in Islamic Law",
        summary: "Quranic foundations of arbitration (Surah An-Nisa 4:35) and enforceability of arbitral awards.",
        detailedNotes: `### Core Framework:
- **Sulh (Surah An-Nisa 4:128)**: Settlement is best (*Al-Sulh Khayr*).
- **Tahkim**: Appointment of an impartial arbitrator by mutual consent to resolve commercial or marital disputes.
- **Kadhis' Court Jurisdiction**: Exercise of civil authority over personal status disputes with recourse to traditional mediation.`,
        keyStatutes: ["Constitution of Kenya 2010 (Art 159(2)(c), 170)", "Arbitration Act 1995", "Kadhis' Courts Act (Cap 11)"],
        landmarkCases: ["Classical Fiqh on Tahkim in Commercial Disputes"],
        examTips: "Tahkim is binding upon the parties once the award is rendered in accordance with Shariah rules.",
      },
    ],
    statutoryFramework: [
      { act: "Arbitration Act (No. 4 of 1995)", section: "Section 35", summary: "Setting aside and enforcement of arbitral awards" },
    ],
    landmarkPrecedents: [
      { citation: "Surah An-Nisa 4:35", principle: "Appointment of arbitrators from husband's and wife's families to achieve reconciliation" },
    ],
    commonExamQuestions: [
      "Examine the integration of Islamic Tahkim into the Kenyan Alternative Dispute Resolution framework under Article 159(2)(c).",
    ],
    tags: ["Tahkim", "Sulh", "Islamic ADR", "Kadhis Courts"],
  },

  {
    id: "llb-324",
    courseCode: "LLB 324",
    courseTitle: "Jurisprudence & Legal Theory",
    year: 3,
    semesterNumber: 2,
    semesterLabel: "Year 3 - Semester 2",
    subject: "Constitutional Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Natural Law theory (Aquinas, Fuller), Legal Positivism (Austin, Hart, Kelsen), Historical school (Savigny's Volksgeist), Sociological school (Roscoe Pound), Legal Realism, and Post-Colonial African jurisprudence.",
    topics: [
      {
        id: "llb324-t1",
        title: "Legal Positivism vs Natural Law Theory",
        summary: "Command theory of Austin and Hart's Rule of Recognition vs Fuller's Inner Morality of Law.",
        detailedNotes: `### Core Theoretical Paradigms:
- **Austin**: Law is the command of the uncommanded sovereign backed by threats of sanctions.
- **H.L.A. Hart**: Union of Primary Rules (obligations) and Secondary Rules (recognition, change, adjudication).
- **Lon Fuller**: 8 internal moralities of law (generality, promulgation, non-retroactivity, clarity, consistency, possibility of compliance, constancy, congruence).`,
        keyStatutes: ["Constitution of Kenya 2010 (Articles 10, 259)"],
        landmarkCases: ["Madzimbamuto v Lardner-Burke [1968] 3 All ER 561", "State v Dosso [1958] Pak SC"],
        examTips: "Contrast Kelsen's Grundnorm with Hart's Rule of Recognition when analyzing revolutionary coups.",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Article 259", summary: "Values-based constitutional interpretation" },
    ],
    landmarkPrecedents: [
      { citation: "Madzimbamuto v Lardner-Burke [1968]", principle: "Judicial recognition of legality during revolutionary changes of regime" },
    ],
    commonExamQuestions: [
      "Critique Austin's Command Theory of Law in the context of modern constitutional democracies like Kenya.",
    ],
    tags: ["Jurisprudence", "Legal Theory", "Hart", "Austin", "Natural Law"],
  },
];
