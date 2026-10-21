import { LawUnit } from "../types";

export const YEAR_2_LAW_UNITS: LawUnit[] = [
  // ================= YEAR 2 - SEMESTER 1 =================
  {
    id: "llb-211",
    courseCode: "LLB 211",
    courseTitle: "Criminal Law II (Specific Offenses)",
    year: 2,
    semesterNumber: 1,
    semesterLabel: "Year 2 - Semester 1",
    subject: "Criminal Law & Procedure",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Specific offenses under the Penal Code: Murder (Sec 203), Manslaughter (Sec 202), Provocation (Sec 207-208), Sexual Offenses (SOA 2006), Theft (Sec 268), Robbery with Violence (Sec 296(2)), and the landmark Muruatetu sentencing principles.",
    topics: [
      {
        id: "llb211-t1",
        title: "Homicide: Murder, Manslaughter & Malice Aforethought",
        summary: "Elements of Murder (Sec 203), Malice Aforethought (Sec 206), Provocation defense (Sec 207-208).",
        detailedNotes: `### Elements of Murder:
1. Unlawful killing of a human being under Queen's/State's peace.
2. Malice Aforethought (Sec 206 Penal Code):
   - Intention to cause death.
   - Intention to cause grievous harm.
   - Knowledge that act will probably cause death.
- **Muruatetu Decision [2017]**: The mandatory death sentence under Sec 204 was declared unconstitutional; judges retain discretion to consider mitigating factors.`,
        keyStatutes: ["Penal Code (Cap 63, Sections 202, 203, 204, 206, 207)"],
        landmarkCases: ["Francis Karioko Muruatetu & Another v Republic [2017] KSC", "Republic v Mwangi [2014] eKLR"],
        examTips: "Always cite Muruatetu [2017] whenever discussing sentencing for capital offenses in Kenya.",
      },
      {
        id: "llb211-t2",
        title: "Offenses Against Property: Robbery with Violence (Sec 296(2))",
        summary: "Elements of aggravated robbery: weapons, numbers (2+), wounding/striking.",
        detailedNotes: `### 3 Disjunctive Elements of Sec 296(2):
The prosecution needs to prove ANY ONE of the following:
1. Offender is armed with any dangerous or offensive weapon.
2. Offender is in company with one or more persons.
3. Immediately before or immediately after, offender wounds, beats, strikes or uses any other personal violence.`,
        keyStatutes: ["Penal Code (Cap 63, Sections 268, 295, 296(2))"],
        landmarkCases: ["Johana Ndungu v Republic [1996] eKLR", "Oluoch v Republic [1985] KLR 549"],
        examTips: "Sec 296(2) elements are disjunctive, not conjunctive (*Johana Ndungu*).",
      },
    ],
    statutoryFramework: [
      { act: "Penal Code (Cap 63)", section: "Sections 203, 206, 296(2)", summary: "Murder, malice aforethought and robbery with violence" },
      { act: "Sexual Offences Act 2006", section: "Sections 3-8", summary: "Rape, defilement and sexual assault provisions" },
    ],
    landmarkPrecedents: [
      { citation: "Muruatetu & Another v Republic [2017] KSC", principle: "Mandatory death penalty violates Article 28 human dignity and fair trial discretion" },
      { citation: "Johana Ndungu v Republic [1996] eKLR", principle: "Proof of any one ingredient under Section 296(2) suffices for robbery with violence" },
    ],
    commonExamQuestions: [
      "Critically examine the impact of the Supreme Court decision in Muruatetu on judicial discretion in sentencing.",
      "Analyze the disjunctive ingredients of Section 296(2) of the Penal Code.",
    ],
    tags: ["Criminal Law", "Murder", "Muruatetu", "Robbery with Violence"],
  },

  {
    id: "llb-212",
    courseCode: "LLB 212",
    courseTitle: "Law of Evidence I",
    year: 2,
    semesterNumber: 1,
    semesterLabel: "Year 2 - Semester 1",
    subject: "Law of Evidence",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Foundations of the Evidence Act (Cap 80): relevancy and admissibility, burden and standard of proof in civil vs criminal matters, judicial notice, character evidence, witness competence, and legal professional privilege.",
    topics: [
      {
        id: "llb212-t1",
        title: "Burden & Standard of Proof (Sections 107-112)",
        summary: "Legal burden vs evidential burden; beyond reasonable doubt vs balance of probabilities.",
        detailedNotes: `### Key Distinctions:
- **Criminal Standard**: Beyond reasonable doubt (*Miller v Minister of Pensions*).
- **Civil Standard**: Preponderance of probabilities.
- **Section 107**: He who asserts must prove.
- **Section 111**: Burden of proving fact especially within the knowledge of any person.`,
        keyStatutes: ["Evidence Act (Cap 80, Sections 107-112)"],
        landmarkCases: ["Miller v Minister of Pensions [1947] 2 All ER 372", "Woolmington v DPP [1935]"],
        examTips: "Do not confuse the legal burden (which never shifts in criminal trials) with the evidential burden.",
      },
    ],
    statutoryFramework: [
      { act: "Evidence Act (Cap 80)", section: "Sections 107-112", summary: "Burden and standard of proof in trials" },
    ],
    landmarkPrecedents: [
      { citation: "Miller v Minister of Pensions [1947]", principle: "Defined standard of proof beyond reasonable doubt vs balance of probabilities" },
    ],
    commonExamQuestions: [
      "Distinguish between the legal burden of proof and the evidential burden under the Evidence Act.",
    ],
    tags: ["Evidence", "Burden of Proof", "Cap 80", "Admissibility"],
  },

  {
    id: "llb-213",
    courseCode: "LLB 213",
    courseTitle: "Land Law & Property Law I",
    year: 2,
    semesterNumber: 1,
    semesterLabel: "Year 2 - Semester 1",
    subject: "Land Law & Property",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Land tenure systems in Kenya, Articles 60-68 COK 2010, Land Act (No. 6 of 2012), Land Registration Act (No. 3 of 2012), and indefeasibility of title under Section 26 LRA (*Dina Management*).",
    topics: [
      {
        id: "llb213-t1",
        title: "Indefeasibility of Title & Section 26 Land Registration Act",
        summary: "Sanctity of title deeds and exceptions: fraud, misrepresentation, and illegal acquisition of public land.",
        detailedNotes: `### Section 26(1) Land Registration Act:
Certificate of title is conclusive evidence of ownership EXCEPT:
1. On ground of fraud or misrepresentation to which the person is proved to be a party.
2. Where the title was acquired illegally, unprocedurally or through a corrupt scheme (*Dina Management Ltd v County Government of Mombasa [2023]*).`,
        keyStatutes: ["Land Registration Act 2012 (Sec 26, 28)", "Constitution of Kenya 2010 (Art 60-68)"],
        landmarkCases: ["Dina Management Ltd v County Government of Mombasa [2023] KSC", "Munyu Maina v Hiram Gathiha Maina [2013] eKLR"],
        examTips: "A purchaser cannot claim bona fide purchaser status over public utility land (*Dina Management*).",
      },
    ],
    statutoryFramework: [
      { act: "Land Registration Act 2012", section: "Section 26, 28", summary: "Indefeasibility and overriding interests" },
      { act: "Land Act 2012", section: "Part I & II", summary: "Principles of land ownership and management" },
    ],
    landmarkPrecedents: [
      { citation: "Dina Management Ltd v County Government of Mombasa [2023] KSC", principle: "Titles to public beach access or public land obtained illegally confer no indefeasible rights" },
    ],
    commonExamQuestions: [
      "Critically evaluate the doctrine of indefeasibility of title in light of Dina Management Ltd v County Government of Mombasa.",
    ],
    tags: ["Land Law", "Section 26", "Dina Management", "Indefeasibility"],
  },

  {
    id: "shar-201",
    courseCode: "SHAR 201",
    courseTitle: "Islamic Criminal Law (Fiqh al-Uqubat & Jinayat)",
    year: 2,
    semesterNumber: 1,
    semesterLabel: "Year 2 - Semester 1",
    subject: "Islamic Jurisprudence & Sharia",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Three-tiered criminal classification in Shariah: Hudud (fixed Quranic penalties), Qisas & Diyah (retribution and blood money in homicide and bodily harm), and Ta'zir (discretionary state punishments) with evidentiary safeguards.",
    topics: [
      {
        id: "shar201-t1",
        title: "Classification of Crimes: Hudud, Qisas & Ta'zir",
        summary: "Distinctions between mandatory Quranic punishments, restorative retribution, and discretionary offenses.",
        detailedNotes: `### Three Tiers of Criminality:
1. **Hudud**: Fixed rights of Allah (Sariqah, Zina, Qadhf, Hirabah, Riddah, Shurb al-Khamr). Strict evidentiary threshold; averted by doubt (*Shubhah*).
2. **Qisas & Diyah**: Retaliation in kind or financial compensation (blood money) for homicide and bodily harm (Surah Al-Baqarah 2:178).
3. **Ta'zir**: Discretionary penalties imposed by the Qadi/Ruler for offenses not covered by Hudud or Qisas.`,
        keyStatutes: ["Surah Al-Ma'idah 5:38, 5:45", "Surah An-Nur 24:2-4"],
        landmarkCases: ["Treatise of Fiqh al-Jinayat", "Hadith on Averting Hudud through Doubt"],
        examTips: "Remember the maxim: 'Avert Hudud penalties by means of doubts (Idra'u al-hudud bi al-shubuhat)'.",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Article 170(5)", summary: "Scope of Kadhis' courts jurisdiction" },
    ],
    landmarkPrecedents: [
      { citation: "Classical Hanbali and Shafi'i Criminal Jurisprudence", principle: "High standard of four eyewitnesses or voluntary confession required for capital Hudud" },
    ],
    commonExamQuestions: [
      "Explain the restorative justice mechanisms of Qisas and Diyah in Islamic criminal law.",
    ],
    tags: ["Fiqh al-Uqubat", "Hudud", "Qisas", "Diyah", "Ta'zir"],
  },

  {
    id: "llb-214",
    courseCode: "LLB 214",
    courseTitle: "Administrative Law & Judicial Review",
    year: 2,
    semesterNumber: 1,
    semesterLabel: "Year 2 - Semester 1",
    subject: "Constitutional Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Ultra vires doctrine, principles of natural justice (*nemo judex in causa sua* and *audi alteram partem*), legitimate expectation, Wednesbury unreasonableness, and constitutional judicial review under Article 47.",
    topics: [
      {
        id: "llb214-t1",
        title: "Grounds for Judicial Review (GCHQ & FAAA 2015)",
        summary: "Illegality, Irrationality (Wednesbury Unreasonableness), and Procedural Impropriety.",
        detailedNotes: `### The 3 GCHQ Pillars:
1. **Illegality**: Acting outside statutory mandate or misdirecting oneself on the law.
2. **Irrationality**: Decision so outrageous in its defiance of logic that no sensible person could have arrived at it (*Wednesbury*).
3. **Procedural Impropriety**: Failure to observe natural justice rules or statutory procedures.`,
        keyStatutes: ["Fair Administrative Action Act (No. 4 of 2015, Sec 7)", "Constitution of Kenya (Art 47)"],
        landmarkCases: ["Council of Civil Service Unions v Minister for Civil Service (GCHQ) [1985] AC 374", "Associated Provincial Picture Houses v Wednesbury Corp [1948] 1 KB 223", "Ridge v Baldwin [1964] AC 40"],
        examTips: "Judicial review is concerned with the decision-making process, not the merits of the decision.",
      },
    ],
    statutoryFramework: [
      { act: "Fair Administrative Action Act 2015", section: "Section 7 & 11", summary: "Grounds for review and remedies of quashing order, prohibition, and injunction" },
    ],
    landmarkPrecedents: [
      { citation: "Wednesbury Corp [1948] 1 KB 223", principle: "Test for administrative irrationality / unreasonableness" },
      { citation: "Ridge v Baldwin [1964] AC 40", principle: "Natural justice applies to all administrative decisions affecting rights" },
    ],
    commonExamQuestions: [
      "Explain the distinction between merit review (appeals) and process review (judicial review) in administrative law.",
    ],
    tags: ["Administrative Law", "Judicial Review", "Natural Justice", "Wednesbury"],
  },

  // ================= YEAR 2 - SEMESTER 2 =================
  {
    id: "llb-221",
    courseCode: "LLB 221",
    courseTitle: "Law of Evidence II (Electronic & Special Evidence)",
    year: 2,
    semesterNumber: 2,
    semesterLabel: "Year 2 - Semester 2",
    subject: "Law of Evidence",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Admissibility of electronic records and digital messages under Section 106B Evidence Act (Cap 80), confessions and retracted statements (Sec 25A), dying declarations (Sec 33(a)), expert evidence, and hearsay exceptions.",
    topics: [
      {
        id: "llb221-t1",
        title: "Section 106B & Electronic Evidence Certification",
        summary: "Mandatory conditions for admitting electronic printouts, WhatsApp chats, CCTV footage, and call data records.",
        detailedNotes: `### Section 106B Requirements:
1. Device produced computer output during regular lawful use.
2. Information was fed into computer in ordinary course of activities.
3. Computer operated properly throughout the period.
4. **Mandatory Certificate (Sec 106B(4))**: Signed by person responsible for device management identifying record and describing manner of production.`,
        keyStatutes: ["Evidence Act (Cap 80, Sec 106B, 25A, 33(a))"],
        landmarkCases: ["Republic v Mark Lloyd Steveson [2016] eKLR", "Stephen Mungai Wachira v Republic [2018] eKLR"],
        examTips: "Electronic printouts without a Sec 106B certificate are inadmissible in Kenyan courts.",
      },
      {
        id: "llb221-t2",
        title: "Confessions & Section 25A Evidence Act",
        summary: "Voluntariness of confessions, recording before magistrate or senior police officer, and retracted confessions.",
        detailedNotes: `### Rules on Confessions:
- **Section 25A**: Confession is only admissible if made before a magistrate or police officer of or above rank of Inspector.
- Must be free and voluntary without torture, inducement or promise (*Article 50(2)(n)*).`,
        keyStatutes: ["Evidence Act (Cap 80, Sec 25A)", "Criminal Procedure Code (Cap 75)"],
        landmarkCases: ["Tuwamoi v Uganda [1967] EA 84", "Republic v Mwangi [2016]"],
        examTips: "A retracted confession requires independent corroboration before convicting.",
      },
    ],
    statutoryFramework: [
      { act: "Evidence Act (Cap 80)", section: "Section 106B & 25A", summary: "Electronic records certification and confession admissibility" },
    ],
    landmarkPrecedents: [
      { citation: "Republic v Mark Lloyd Steveson [2016] eKLR", principle: "Section 106B certificate is mandatory condition precedent for admitting digital evidence" },
      { citation: "Tuwamoi v Uganda [1967] EA 84", principle: "Retracted confessions must be evaluated with great caution and require corroboration" },
    ],
    commonExamQuestions: [
      "Critically discuss the procedural requirements for admitting electronic printouts under Section 106B of the Evidence Act.",
    ],
    tags: ["Evidence", "Section 106B", "Electronic Evidence", "Confessions"],
  },

  {
    id: "shar-202",
    courseCode: "SHAR 202",
    courseTitle: "Islamic Family Law & Succession (Mirath)",
    year: 2,
    semesterNumber: 2,
    semesterLabel: "Year 2 - Semester 2",
    subject: "Islamic Family Law & Succession (Mirath)",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Pillars of Nikah, dissolution of marriage (Talaq, Khul', Faskh), custody (Hadanah), and Islamic Law of Succession (Mirath): Quranic fractional heirs (Zawu al-Furud), residuaries (Asabah), exclusion rules (Hajib), and Kadhis' Courts jurisdiction.",
    topics: [
      {
        id: "shar202-t1",
        title: "Dissolution of Marriage: Talaq, Khul', Faskh & Iddah",
        summary: "Forms of marital dissolution in Shariah and post-divorce waiting period.",
        detailedNotes: `### Forms of Dissolution:
1. **Talaq**: Repudiation by husband (Talaq Raj'i vs Talaq Ba'in).
2. **Khul'**: Redemptive divorce initiated by wife by returning Mahr.
3. **Faskh**: Judicial dissolution by the Kadhi on grounds of cruelty, desertion, or non-maintenance.
- **Iddah**: Waiting period (3 menstrual cycles / 3 months or until childbirth).`,
        keyStatutes: ["Marriage Act (No. 4 of 2014, Part VIII)", "Kadhis' Courts Act (Cap 11)"],
        landmarkCases: ["Kadhis' Court Divorce Petitions (Mombasa & Garissa)"],
        examTips: "A wife seeking Khul' must return the dowry/Mahr unless excused by husband.",
      },
      {
        id: "shar202-t2",
        title: "Islamic Succession (Mirath) & Quranic Heirs",
        summary: "Calculation of estate shares under Surah An-Nisa 4:11-12; Zawu al-Furud and Asabah.",
        detailedNotes: `### Primary Fractional Shares:
- **Husband**: 1/2 (no children), 1/4 (with children).
- **Wife**: 1/4 (no children), 1/8 (with children).
- **Daughter**: 1/2 (single daughter, no son), 2/3 (two or more daughters, no son).
- **Son & Daughter**: Residuary (*Asabah bil-Ghayr*) at 2:1 ratio.
- **Mother**: 1/3 (no children/multiple siblings), 1/6 (with children/multiple siblings).
- **Father**: 1/6 (with male offspring), Residuary (no offspring).`,
        keyStatutes: ["Surah An-Nisa 4:11-12, 4:176", "Law of Succession Act (Cap 160, Sec 2(3)&(4))"],
        landmarkCases: ["In re Estate of Late Sheikh Mohamed [eKLR]"],
        examTips: "Section 2(3) of Cap 160 expressly exempts estates of deceased Muslims from general Kenyan succession rules.",
      },
    ],
    statutoryFramework: [
      { act: "Constitution of Kenya 2010", section: "Article 170(5)", summary: "Kadhis' Court jurisdiction on marriage, divorce and inheritance" },
      { act: "Law of Succession Act (Cap 160)", section: "Section 2(3) & 2(4)", summary: "Exemption of Muslims from Part V of Cap 160" },
    ],
    landmarkPrecedents: [
      { citation: "In re Estate of Sheikh Mohamed [eKLR]", principle: "Islamic estate distribution must follow Surah An-Nisa strictly without applying common law rules" },
    ],
    commonExamQuestions: [
      "Calculate the respective shares of a surviving husband, mother, and two daughters under Islamic inheritance law.",
      "Distinguish between Talaq, Khul', and Faskh under Kenyan Islamic family law.",
    ],
    tags: ["Mirath", "Islamic Family Law", "Succession", "Zawu al-Furud", "Kadhis Courts"],
  },

  {
    id: "llb-222",
    courseCode: "LLB 222",
    courseTitle: "Land Law & Property Law II",
    year: 2,
    semesterNumber: 2,
    semesterLabel: "Year 2 - Semester 2",
    subject: "Land Law & Property",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Leases, tenancies, mortgages and charges under the Land Act 2012, statutory power of sale, sectional properties (Sectional Properties Act 2020), easements, and restrictive covenants.",
    topics: [
      {
        id: "llb222-t1",
        title: "Charges & Realization of Securities under Land Act 2012",
        summary: "Remedies of a Chargee: statutory notice (Sec 90), appointment of receiver, and statutory power of sale (Sec 96-98).",
        detailedNotes: `### Statutory Process for Power of Sale:
1. **Notice of Default (Sec 90)**: 30 days notice to rectify default.
2. **Notice of Intention to Sell (Sec 96)**: 90 days statutory notice after default continues.
3. **Duty of Chargee (Sec 97)**: Obtain best price reasonably obtainable (forced sale valuation within 12 months, sale must not be below 75% of market value).`,
        keyStatutes: ["Land Act (No. 6 of 2012, Sections 80-106)"],
        landmarkCases: ["Nyagilo Ochieng v Barclays Bank of Kenya [1996] eKLR", "National Bank of Kenya v Ndungu Njau [1997]"],
        examTips: "Under Sec 97(2) Land Act 2012, sale below 75% of open market value is prohibited without court sanction.",
      },
    ],
    statutoryFramework: [
      { act: "Land Act 2012", section: "Sections 90-98", summary: "Statutory notice and sale of charged property" },
      { act: "Sectional Properties Act 2020", section: "Sections 4-15", summary: "Registration of individual units and common property" },
    ],
    landmarkPrecedents: [
      { citation: "Nyagilo Ochieng v Barclays Bank [1996]", principle: "Chargee must strictly serve statutory notice before exercising power of sale" },
    ],
    commonExamQuestions: [
      "Detail the mandatory procedural steps a bank must take before exercising its statutory power of sale under the Land Act 2012.",
    ],
    tags: ["Land Law", "Charges", "Power of Sale", "Sectional Properties"],
  },

  {
    id: "llb-223",
    courseCode: "LLB 223",
    courseTitle: "Commercial Law & Sale of Goods",
    year: 2,
    semesterNumber: 2,
    semesterLabel: "Year 2 - Semester 2",
    subject: "Commercial & Corporate Law",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Sale of Goods Act (Cap 31), implied conditions and warranties, transfer of property and risk, nemo dat quod non habet and exceptions, unpaid seller remedies, and agency law.",
    topics: [
      {
        id: "llb223-t1",
        title: "Nemo Dat Quod Non Habet & Statutory Exceptions",
        summary: "No one can give what they do not have; protecting bona fide commercial purchasers.",
        detailedNotes: `### Rule & Exceptions (Section 23-26 Cap 31):
- **General Rule**: Buyer acquires no better title than seller had (*Rowland v Divall*).
- **Exceptions**:
  1. Estoppel (owner precluded by conduct from denying seller's authority).
  2. Sale by Mercantile Agent (*Folkes v King*).
  3. Sale under Voidable Title before rescission (*Lewis v Averay*).
  4. Seller or Buyer in possession after sale.
  5. Sale in Market Overt.`,
        keyStatutes: ["Sale of Goods Act (Cap 31, Sections 14-26)", "Factors Act 1889"],
        landmarkCases: ["Rowland v Divall [1923] 2 KB 500", "Lewis v Averay [1972] 1 QB 198"],
        examTips: "Always identify whether the underlying transaction was void ab initio or merely voidable.",
      },
    ],
    statutoryFramework: [
      { act: "Sale of Goods Act (Cap 31)", section: "Sections 14-26, 39-48", summary: "Conditions, warranties, transfer of title, and unpaid seller remedies" },
    ],
    landmarkPrecedents: [
      { citation: "Rowland v Divall [1923]", principle: "Total failure of consideration where seller has no right to sell goods" },
    ],
    commonExamQuestions: [
      "Discuss the nemo dat quod non habet rule and its statutory exceptions under the Sale of Goods Act (Cap 31).",
    ],
    tags: ["Commercial Law", "Sale of Goods", "Nemo Dat", "Cap 31"],
  },

  {
    id: "llb-224",
    courseCode: "LLB 224",
    courseTitle: "Equity & Law of Trusts",
    year: 2,
    semesterNumber: 2,
    semesterLabel: "Year 2 - Semester 2",
    subject: "Civil Procedure",
    creditHours: 3,
    isCompulsory: true,
    unitOverview: "Maxims of equity, the Three Certainties of private trusts (*Knight v Knight*), constitution of trusts, resulting and constructive trusts, charitable trusts, and trustees' fiduciary duties.",
    topics: [
      {
        id: "llb224-t1",
        title: "The Three Certainties of an Express Trust",
        summary: "Certainty of Intention, Subject Matter, and Objects required for a valid trust.",
        detailedNotes: `### The Knight v Knight Triad:
1. **Certainty of Intention**: Clear imperative words showing intention to create binding trust obligation (*Re Adams and Kensington Vestry*).
2. **Certainty of Subject Matter**: Clear description of property and beneficial interests (*Palmer v Simmonds*).
3. **Certainty of Objects**: Beneficiaries must be identifiable (*Re Baden's Deed Trusts*).`,
        keyStatutes: ["Trustees Act (Cap 167)", "Perpetuities and Accumulations Act (Cap 161)"],
        landmarkCases: ["Knight v Knight [1840] 3 Beav 148", "Milroy v Lord [1862] 4 De GF & J 264"],
        examTips: "Precatory words (e.g., 'in full confidence that she will do what is right') do not create a valid trust.",
      },
    ],
    statutoryFramework: [
      { act: "Trustees Act (Cap 167)", section: "Sections 10-35", summary: "Powers, investments and duties of trustees" },
    ],
    landmarkPrecedents: [
      { citation: "Knight v Knight [1840]", principle: "Established the Three Certainties mandatory for creating an express trust" },
    ],
    commonExamQuestions: [
      "Critically evaluate the three certainties necessary for the creation of an express private trust.",
    ],
    tags: ["Equity", "Trusts", "Three Certainties", "Knight v Knight"],
  },
];
