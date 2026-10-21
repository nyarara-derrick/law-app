import { PastPaper } from "../types";

export const UMMA_UNIVERSITY_PAST_PAPERS: PastPaper[] = [
  {
    id: "umma-llb111-2024",
    university: "Umma University",
    faculty: "School of Law and Shariah",
    courseCode: "LLB 111",
    courseTitle: "Constitutional Law I & Human Rights",
    academicYear: "2023/2024 Academic Year",
    semester: "Semester I Final Examinations",
    subject: "Constitutional Law",
    examDuration: "3 Hours",
    instructions: "Answer Question ONE (Compulsory - 30 Marks) and any other TWO questions (20 Marks each). All references must cite the Constitution of Kenya (2010) and relevant case law.",
    questions: [
      {
        id: "umma-llb111-q1",
        questionNumber: "Question 1 (Compulsory)",
        marks: 30,
        scenario: `The County Executive Committee Member (CECM) for Trade and Land in Kajiado County issued Executive Directive No. 04/2023 ordering the immediate eviction and bulldozing of 150 mobile stalls operated by the Kitengela Small Scale Traders Association along Namanga Road at 2:00 AM on a Sunday morning. The directive cited 'urban decongestion and traffic sanitation.' No prior written notice was served on the traders, no public participation was conducted under Article 10 & 118 of the Constitution, and no alternative resettlement site was designated. The traders' goods worth KES 14.5 million were destroyed in the eviction.

The traders wish to institute a Constitutional Petition before the High Court of Kenya.
Advise the traders on:
(a) The constitutional validity of the Executive Directive under Article 47 (Fair Administrative Action) and the Fair Administrative Action Act (2015). (12 Marks)
(b) The violation of their rights under Article 40 (Right to Property), Article 28 (Human Dignity), and Article 43 (Economic & Social Rights). (10 Marks)
(c) The appropriate constitutional reliefs and declarations the High Court can grant under Article 23(3). (8 Marks)`,
        modelIRACAnswer: {
          issue: `1. Whether Executive Directive No. 04/2023 violates Article 47 of the Constitution of Kenya 2010 and Section 4 of the Fair Administrative Action Act (No. 4 of 2015) for lack of prior written notice, failure to give reasons, and absence of public participation under Article 10(2)(a).
2. Whether the midnight demolition and destruction of the traders' inventory violates Article 40 (Protection of Right to Property), Article 28 (Human Dignity), and Article 43 (Socio-Economic Rights).
3. What constitutional remedies and damages are obtainable under Article 23(3) of the Constitution of Kenya 2010.`,
          rule: `1. **Article 47(1) & (2) COK 2010 & Fair Administrative Action Act (FAAA 2015, Sec 4)**: Every person has the right to administrative action that is expeditious, efficient, lawful, reasonable, and procedurally fair. Section 4(3) FAAA mandates adequate notice, reasonable opportunity to make representations, and clear notice of the right of review/appeal.
2. **Article 10(2)(a) COK 2010**: National values and principles of governance including the rule of law, democracy, and public participation bind all State organs and public officers.
3. **Article 40(1) & (3) COK 2010**: Right to acquire and own property; arbitrary deprivation is strictly forbidden without prompt and just compensation.
4. **Article 23(3) COK 2010**: High Court powers to grant injunctions, declarations of invalidity, conservatory orders, and constitutional compensation.
5. **Landmark Precedents**:
   - *Mitu-Bell Welfare Society v Kenya Airports Authority & 2 Others [2021] KSC*: Supreme Court held that evictions conducted without human dignity, adequate notice, and alternative accommodation violate Articles 28 and 43.
   - *Dry Associates Limited v Capital Markets Authority & Another [2012] eKLR*: Pleading and substantive thresholds for procedural fairness under Article 47.
   - *Mumo Matemu v Trusted Society of Human Rights Alliance [2013] eKLR*: Mandatory adherence to Article 10 constitutional values by public officers.`,
          application: `1. **Procedural Unfairness under Article 47 & FAAA**: The CECM's execution of Directive No. 04/2023 at 2:00 AM on Sunday without issuing a 30-day written notice or providing an opportunity for the traders to be heard is a textbook breach of Section 4(3) of the Fair Administrative Action Act. Under *Dry Associates*, administrative decisions affecting economic livelihood require prior notice and adherence to the rules of natural justice (*audi alteram partem*).
2. **Violation of Article 10 Public Participation**: In *Mumo Matemu*, the Court of Appeal affirmed that public participation under Article 10 is a justiciable constitutional condition precedent for any major administrative decree. The County failed to engage the registered association.
3. **Arbitrary Deprivation of Property & Dignity (Articles 40, 28, 43)**: Bulldozing stock worth KES 14.5 million in the dead of night violates Article 40. Under *Mitu-Bell*, evictions must adhere to UN Basic Principles and Guidelines on Development-Based Evictions, ensuring human dignity is safeguarded.
4. **Remedies under Article 23(3)**: The High Court has jurisdiction to declare Directive No. 04/2023 unconstitutional, issue an order of prohibition restraining future interference, and award general, special, and exemplary damages for the destroyed inventory.`,
          conclusion: `The traders have an unassailable constitutional petition. They should file under Article 22 before the High Court of Kenya at Kajiado seeking:
(a) A declaration that Directive No. 04/2023 is null and void *ab initio* for violating Articles 10, 47, 40, 28, and 43;
(b) Special damages of KES 14.5 million for lost inventory;
(c) General and constitutional damages for violation of fundamental rights;
(d) A permanent injunction against future arbitrary evictions without court sanction.`,
          rawMarkdown: `# 📌 ISSUE
- Whether Executive Directive No. 04/2023 violates Article 47 COK 2010 and the Fair Administrative Action Act (2015) for lack of notice and procedural fairness.
- Whether the midnight demolition constitutes arbitrary deprivation of property (Article 40) and human dignity (Article 28).
- What constitutional remedies are available under Article 23(3).

# 📜 RULE
- **Constitution of Kenya 2010**: Articles 10 (National Values), 23 (Authority of Courts), 28 (Dignity), 40 (Property), 43 (Socio-Economic), 47 (Fair Administrative Action).
- **Fair Administrative Action Act (No. 4 of 2015)**: Section 4.
- **Landmark Case Precedents**:
  - *Mitu-Bell Welfare Society v KAA [2021] KSC*
  - *Dry Associates Ltd v CMA [2012] eKLR*
  - *Mumo Matemu v Trusted Society [2013] eKLR*

# ⚖️ APPLICATION
- The midnight demolition without 30-day notice or an administrative hearing violates the fundamental principles of natural justice (*audi alteram partem*) codified in Section 4(3) FAAA 2015.
- Evicting traders at 2:00 AM while destroying KES 14.5M of inventory violates the Supreme Court holding in *Mitu-Bell*, which forbids degrading and inhuman evictions.
- Public participation is an indispensable constitutional mandate under Article 10(2)(a).

# 🏁 CONCLUSION
- The High Court will declare Executive Directive No. 04/2023 unconstitutional and void under Article 2(4).
- The traders will be awarded special damages for destroyed stock (KES 14.5M) and constitutional damages for violation of fundamental rights under Article 23(3).`,
        },
        examinerRubric: [
          "Identification of Art 47 & Fair Administrative Action Act 2015 (8 Marks)",
          "Application of Supreme Court decision in Mitu-Bell Welfare Society (8 Marks)",
          "Analysis of Art 10 Public Participation and Art 40 Property Rights (8 Marks)",
          "Specification of Art 23(3) Judicial Remedies and conclusion (6 Marks)",
        ],
      },
      {
        id: "umma-llb111-q2",
        questionNumber: "Question 2",
        marks: 20,
        scenario: `Critically examine the 'Basic Structure Doctrine' in Kenyan constitutional jurisprudence with specific reference to the Supreme Court judgment in *Building Bridges Initiative (BBI) - Independent Electoral and Boundaries Commission & Others v Ndii & Others [2022] KSC*. Explain the distinction between the primary constituent power, secondary constituent power, and constituted power under Articles 255, 256, and 257 of the Constitution of Kenya 2010.`,
        modelIRACAnswer: {
          issue: `Whether the Basic Structure Doctrine applies in Kenya to limit the power of constitutional amendment under Articles 255, 256, and 257 of the Constitution of Kenya 2010, and how the Supreme Court in the BBI Judgment resolved the hierarchical distribution of constituent power.`,
          rule: `1. **Constitution of Kenya 2010**: Articles 255 (Amendments by Referendum), 256 (Parliamentary initiative), 257 (Popular initiative), Article 1 (Sovereignty of the People).
2. **Supreme Court Precedent**: *IEBC & 7 Others v David Ndii & 79 Others [2022] KSC 1* (BBI Judgment).
3. **Comparative Origins**: *Kesavananda Bharati v State of Kerala (1973) INSC*; *Minerva Mills v Union of India (1980)*.
4. **Constituent Power Hierarchy**:
   - Primary Constituent Power: Vesting exclusively in the People (People's referendum and civic assembly).
   - Secondary Constituent Power: People acting through representative assemblies/referendum pathways.
   - Constituted Power: Parliament or Executive creating ordinary legislation or proposing amendments.`,
          application: `1. **Application of Basic Structure in Kenya**: The Supreme Court held (6-1 majority) that the Basic Structure Doctrine is applicable in Kenya. However, unlike India's unamendable provisions, Kenya's basic structure can be amended, but *only* through the four sequential pillars of the Primary Constituent Power:
   - Civic education;
   - Public participation and collection of views;
   - Debating and drafting in a constituent assembly;
   - Approval by the People in a national referendum.
2. **Popular Initiative under Article 257**: The Supreme Court ruled that the President cannot initiate an amendment under Article 257 (Popular Initiative), as that route is reserved exclusively for citizen-led grassroots initiatives.
3. **Constituted vs Constituent Power**: Parliament acting under Article 256 cannot alter the foundational architecture (Chapter 1, 2, 4, 9, 10) without submitting the matter to the sovereign people under Article 255(1).`,
          conclusion: `The BBI judgment cemented the principle that sovereign power belongs to the People of Kenya under Article 1. The basic structure is protected from unilateral executive or parliamentary cannibalization. Any structural amendment requires the activation of the primary constituent power.`,
          rawMarkdown: `# 📌 ISSUE
- Applicability of the Basic Structure Doctrine in Kenya under Articles 255-257.
- Hierarchical boundaries between primary constituent power, secondary constituent power, and constituted power.

# 📜 RULE
- **Constitution of Kenya 2010**: Articles 1, 255, 256, 257.
- **Landmark Case**: *IEBC & Others v David Ndii & Others (BBI Case) [2022] KSC*.
- **Comparative Jurisprudence**: *Kesavananda Bharati v State of Kerala (1973)*.

# ⚖️ APPLICATION
- The Supreme Court confirmed that the basic structure doctrine applies in Kenya, safeguarding foundational values against fast-tracked amendments.
- The President cannot use the 'popular initiative' route under Article 257.
- The 4-step sequence for activating Primary Constituent Power must be satisfied.

# 🏁 CONCLUSION
- The sovereign people retain absolute primary constituent power. Constituted organs (Executive/Parliament) cannot amend the core pillars of the Constitution without strict referendum processes.`,
        },
        examinerRubric: [
          "Elucidation of the 4 steps of Primary Constituent Power (6 Marks)",
          "Analysis of BBI Judgment on Art 257 and Executive Initiative (7 Marks)",
          "Comparative evaluation of Indian vs Kenyan basic structure doctrines (7 Marks)",
        ],
      },
    ],
  },
  {
    id: "umma-shar202-2024",
    university: "Umma University",
    faculty: "School of Law and Shariah",
    courseCode: "SHAR 202",
    courseTitle: "Islamic Family Law & Law of Succession (Mirath)",
    academicYear: "2023/2024 Academic Year",
    semester: "Semester II Final Examinations",
    subject: "Islamic Family Law & Succession (Mirath)",
    examDuration: "3 Hours",
    instructions: "Answer Question ONE (Compulsory - 30 Marks) and any other TWO questions (20 Marks each). Calculate exact Quranic fractional shares (Fara'id) and cite Quranic Surahs (Surah An-Nisa 4:11-12) and relevant Kadhis' Court jurisprudence.",
    questions: [
      {
        id: "umma-shar202-q1",
        questionNumber: "Question 1 (Compulsory)",
        marks: 30,
        scenario: `Al-Hajj Omar, a devout Muslim residing in Garissa, passed away intestate leaving an estate valued at KES 24,000,000 net after deduction of funeral expenses and debt settlements. He is survived by:
1. Two lawful wives: Maryam and Khadijah;
2. His Mother: Zeinab;
3. Two biological sons: Tariq and Bilal;
4. Three biological daughters: Fatima, Aisha, and Zuleikha;
5. One uterine brother (Brother through mother only): Khalid;
6. A non-Muslim brother: John (who converted to Christianity).

Before the Kadhi's Court at Garissa, Khalid claims a 1/6 share under Surah An-Nisa (4:12), and John claims a share under Section 35 of the Kenyan Law of Succession Act (Cap 160).
(a) Determine the jurisdiction of the Kadhi's Court under Article 170(5) of the Constitution and Section 5 of the Kadhis' Courts Act (Cap 11). (6 Marks)
(b) Identify which surviving relatives are totally excluded (Hajib Hirman) and explain the legal basis of their exclusion in Islamic Fiqh and Kenyan law. (6 Marks)
(c) Calculate the exact Quranic fractional share (Fard) and residual inheritance (Asabah) for each eligible heir, showing the exact monetary distribution in KES. (14 Marks)
(d) State the position of Islamic law regarding John's claim under Cap 160 in light of the rule *La tawaritha bayna ahl millatayn* (No inheritance between two different religions). (4 Marks)`,
        modelIRACAnswer: {
          issue: `1. Whether the Kadhi's Court possesses exclusive jurisdiction under Article 170(5) COK 2010 over the succession of a deceased Muslim.
2. Which relatives are excluded by total exclusion (Hajib Hirman) under the rules of Fiqh al-Mawarith.
3. What are the specific Quranic fractional shares (Zawu al-Furud) and residual distributions (Asabah bi Ghayrihi) of the KES 24,000,000 net estate.
4. Whether a non-Muslim relative can inherit from a deceased Muslim under Kenyan Sharia application.`,
          rule: `1. **Jurisdiction**: Article 170(5) COK 2010, Kadhis' Courts Act (Cap 11 Sec 5), and Section 2(3) & 2(4) of the Law of Succession Act (Cap 160), which explicitly excludes the estates of deceased Muslims from the substantive provisions of Cap 160, subjecting them to Muslim law.
2. **Total Exclusion (Hajib Hirman)**:
   - Biological sons exclude collateral heirs completely (Uterine brothers and sisters are excluded by presence of male descendants / Asl or Far' Warith).
   - Difference of religion (*Ikhtilaf al-Din*) is a total legal impediment (*Mani' min Mawani' al-Irth*) based on Sahih Bukhari / Muslim Hadith: *"A Muslim cannot inherit from a non-Muslim, nor can a non-Muslim inherit from a Muslim."*
3. **Quranic Fractional Entitlements (Surah An-Nisa 4:11, 4:12)**:
   - Wives (Zawjatan): Shared 1/8 (Thumun) due to the existence of children (Far' Warith).
   - Mother (Umm): 1/6 (Sudus) due to children.
   - Children: Residuary heirs (*Asabah bi Ghayrihi*) where a male child takes twice the share of a female child (*Li al-dhakari mithlu hazz al-unthayayn*).`,
          application: `1. **Jurisdiction & Non-Muslim Exclusion**: Under Section 2(3) of Cap 160, Kenyan civil courts recognize Islamic succession as substantive law for Muslims. John is disqualified by *Ikhtilaf al-Din*. Khalid (uterine brother) is totally excluded (*Mahjub*) by the presence of sons Tariq and Bilal.
2. **Distribution Calculation**:
   - **Total Net Estate**: KES 24,000,000.
   - **Wives (Maryam & Khadijah)**: 1/8 of 24,000,000 = KES 3,000,000 (KES 1,500,000 each).
   - **Mother (Zeinab)**: 1/6 of 24,000,000 = KES 4,000,000.
   - **Total Fixed Shares (Zawu al-Furud)** = KES 3,000,000 + KES 4,000,000 = KES 7,000,000.
   - **Residue (Tarakah Baqiyah / Asabah)** = KES 24,000,000 - KES 7,000,000 = KES 17,000,000.
   - **Child Share Portions**:
     - 2 Sons (Tariq & Bilal) = 2 × 2 portions = 4 portions.
     - 3 Daughters (Fatima, Aisha, Zuleikha) = 3 × 1 portion = 3 portions.
     - Total portions = 7 portions.
     - Value of 1 portion = KES 17,000,000 / 7 = KES 2,428,571.43.
     - **Each Son (2 portions)**: KES 4,857,142.86 (Tariq: KES 4,857,142.86, Bilal: KES 4,857,142.86).
     - **Each Daughter (1 portion)**: KES 2,428,571.43 (Fatima: KES 2,428,571.43, Aisha: KES 2,428,571.43, Zuleikha: KES 2,428,571.43).`,
          conclusion: `Final Kadhi's Court Order:
- Maryam (Wife 1): KES 1,500,000 (1/16)
- Khadijah (Wife 2): KES 1,500,000 (1/16)
- Zeinab (Mother): KES 4,000,000 (1/6)
- Tariq (Son): KES 4,857,142.86
- Bilal (Son): KES 4,857,142.86
- Fatima (Daughter): KES 2,428,571.43
- Aisha (Daughter): KES 2,428,571.43
- Zuleikha (Daughter): KES 2,428,571.43
- Khalid & John: KES 0.00 (Excluded under Fiqh & Cap 160 Sec 2(3)).`,
          rawMarkdown: `# 📌 ISSUE
- Jurisdiction of Kadhi's Court under Art 170(5) COK 2010 and Sec 2(3) Cap 160.
- Application of Hajib Hirman to exclude collateral heirs and non-Muslim claimants.
- Mathematical determination of Quranic shares (Fara'id) and residual allocation (Asabah).

# 📜 RULE
- **Surah An-Nisa (4:11 & 4:12)**: 1/8 to wives, 1/6 to mother, 2:1 ratio for sons and daughters.
- **Law of Succession Act (Cap 160)**: Section 2(3) & 2(4) exempts Muslim estates from Part V of Cap 160.
- **Islamic Jurisprudence**: *La tawaritha bayna ahl millatayn* (Impediment of religion).

# ⚖️ APPLICATION
- John is excluded due to religious disparity (*Ikhtilaf al-Din*).
- Khalid is excluded (*Mahjub*) by the surviving sons.
- Total fixed Quranic deductions: KES 7,000,000.
- Residue of KES 17,000,000 is distributed across 7 units (4 for sons, 3 for daughters).

# 🏁 CONCLUSION
- The Kadhi's Court will decree the estate accordingly: Wives KES 3M (split 50/50), Mother KES 4M, Sons KES 4,857,142.86 each, Daughters KES 2,428,571.43 each.`,
        },
        examinerRubric: [
          "Accurate Quranic citation and fractional allocation for Zawu al-Furud (8 Marks)",
          "Correct calculation of Asabah bi Ghayrihi 2:1 male-to-female ratio (8 Marks)",
          "Legal justification for exclusion of Khalid (Hajib) and John (Ikhtilaf al-Din) (8 Marks)",
          "Jurisdictional analysis under Art 170(5) and Cap 160 Sec 2(3) (6 Marks)",
        ],
      },
    ],
  },
  {
    id: "umma-llb122-2024",
    university: "Umma University",
    faculty: "School of Law and Shariah",
    courseCode: "LLB 122",
    courseTitle: "Law of Contract",
    academicYear: "2023/2024 Academic Year",
    semester: "Semester II Final Examinations",
    subject: "Law of Contract",
    examDuration: "3 Hours",
    instructions: "Answer Question ONE (Compulsory - 30 Marks) and any other TWO questions. Cite the Law of Contract Act (Cap 23) and landmark English and Kenyan precedents.",
    questions: [
      {
        id: "umma-llb122-q1",
        questionNumber: "Question 1 (Compulsory)",
        marks: 30,
        scenario: `On 1st October, Nexus Solar Ltd posted a written offer by registered post to Safari Lodges Ltd in Naivasha offering to supply 200 high-capacity solar panels at KES 25,000 each, stating: "This special price remains open for your acceptance until 15th October." Safari Lodges received the letter on 4th October. On 8th October at 10:00 AM, Safari Lodges posted a letter of acceptance by registered post.

On 7th October, Nexus Solar Ltd sent an email revoking the offer, claiming solar panel market prices had doubled. Safari Lodges' procurement manager was on leave and only read the revocation email on 9th October. When Safari Lodges' letter of acceptance reached Nexus Solar Ltd on 12th October, Nexus refused to supply the panels, alleging no binding contract was formed because the offer was revoked before the acceptance letter arrived.

(a) Advise Safari Lodges Ltd on whether a binding contract was formed, analyzing the Postal Rule of Acceptance (*Adams v Lindsell*) and instantaneous communications under the Kenya Information and Communications Act (KICA, Cap 411A). (16 Marks)
(b) Discuss the legal effect of Nexus Solar Ltd's promise to keep the offer open until 15th October under common law doctrine of firm offers without consideration (*Routledge v Grant*). (8 Marks)
(c) What remedies are available to Safari Lodges Ltd under the Law of Contract Act (Cap 23)? (6 Marks)`,
        modelIRACAnswer: {
          issue: `1. Whether a valid, legally enforceable contract was concluded between Safari Lodges Ltd and Nexus Solar Ltd upon the posting of the acceptance letter on 8th October under the Postal Rule (*Adams v Lindsell*).
2. Whether the revocation of offer sent by email on 7th October was legally effective prior to its actual receipt and communication to the offeree on 9th October (*Byrne v Van Tienhoven*).
3. Whether the promise to keep the offer open until 15th October is legally binding without separate consideration (*Dickinson v Dodds*).
4. What remedies lie under Kenyan contract law for repudiatory breach.`,
          rule: `1. **Postal Rule of Acceptance**: *Adams v Lindsell (1818) 1 B & Ald 681*; *Household Fire Insurance Co v Grant (1879)*. Where the parties contemplate the post as a means of communication, acceptance is complete and effective the moment the letter of acceptance is posted, properly addressed and stamped.
2. **Rule on Revocation of Offer**: *Byrne & Co v Leon Van Tienhoven & Co (1880) 5 CPD 344*. A revocation of an offer is effective only when it is actually received and brought to the mind of the offeree; the postal rule does NOT apply to revocations.
3. **Electronic Communications in Kenya**: Section 83B & 83C of the Kenya Information and Communications Act (KICA, Cap 411A) and Section 3 of the Law of Contract Act (Cap 23). An electronic record is dispatched when it enters an information system outside the control of the originator, but revocation is governed by receipt rules.
4. **Firm Offers without Consideration**: *Routledge v Grant (1828)*; *Dickinson v Dodds (1876)*. A gratuitous promise to keep an offer open for a fixed period is not binding at common law unless supported by separate consideration (an option contract).`,
          application: `1. **Application of Postal Rule**: When Nexus Solar Ltd communicated their initial offer via registered post, they impliedly authorized post as the acceptable medium of reply. When Safari Lodges posted their letter of acceptance on 8th October at 10:00 AM, a binding contract materialized at that exact timestamp.
2. **Ineffective Revocation**: Although Nexus sent an email on 7th October, revocation is only effective upon actual communication. The email was not opened or read until 9th October. By 9th October, the contract had already been formed 24 hours earlier (on 8th October). Therefore, the attempted revocation arrived too late.
3. **Promise to keep open**: The promise to keep the offer open until 15th October was gratuitous under *Routledge v Grant*, meaning Nexus could theoretically revoke it prior to acceptance—but because their revocation was ineffective before 8th October, the postal acceptance sealed the deal.
4. **Breach & Remedies**: Nexus Solar Ltd's refusal to deliver constitutes anticipatory repudiatory breach. Under *Hadley v Baxendale*, Safari Lodges can sue for the difference between the contract price (KES 25,000) and the prevailing market price of substitute panels, or seek specific performance.`,
          conclusion: `A binding contract was validly created on 8th October 2023. Safari Lodges Ltd should issue a demand letter to Nexus Solar Ltd and, if they fail to supply, file suit before the Commercial and Admiralty Division of the High Court for specific performance or damages for breach of contract.`,
          rawMarkdown: `# 📌 ISSUE
- Whether posting the acceptance letter on 8th October created a binding contract under the Postal Rule.
- Whether the unread email revocation of 7th October defeated the postal acceptance.
- Available remedies under Law of Contract Act (Cap 23).

# 📜 RULE
- **Law of Contract Act (Cap 23, Laws of Kenya)**
- **Postal Rule**: *Adams v Lindsell [1818]*, *Household Fire Insurance v Grant [1879]*
- **Revocation of Offer Rule**: *Byrne v Van Tienhoven [1880]*, *Entores v Miles Far East Corp [1955]*
- **KICA (Cap 411A)**: Sections 83B & 83C.

# ⚖️ APPLICATION
- The post was an authorized mode of communication; acceptance took effect immediately upon dispatch into the postal box on 8th October.
- Revocation of an offer is NOT subject to the postal rule and only takes effect when actually communicated (*Byrne v Van Tienhoven*). The unread email on 7th October did not revoke the offer before 8th October.
- Nexus Solar is in repudiatory breach.

# 🏁 CONCLUSION
- A binding contract exists. Safari Lodges Ltd is entitled to damages or an order for specific performance.`,
        },
        examinerRubric: [
          "Mastery and application of Adams v Lindsell Postal Rule (10 Marks)",
          "Analysis of Byrne v Van Tienhoven revocation standards (10 Marks)",
          "Application of KICA Cap 411A electronic receipt rules (5 Marks)",
          "Remedies and conclusion (5 Marks)",
        ],
      },
    ],
  },
  {
    id: "umma-llb211-2023",
    university: "Umma University",
    faculty: "School of Law and Shariah",
    courseCode: "LLB 211",
    courseTitle: "Law of Torts",
    academicYear: "2022/2023 Academic Year",
    semester: "Semester I Final Examinations",
    subject: "Law of Torts",
    examDuration: "3 Hours",
    instructions: "Answer Question ONE (Compulsory - 30 Marks) and any other TWO questions. Cite the Occupiers' Liability Act (Cap 34), Defamation Act (Cap 36), and tortious precedents.",
    questions: [
      {
        id: "umma-llb211-q1",
        questionNumber: "Question 1 (Compulsory)",
        marks: 30,
        scenario: `Dr. Mwangi, a prominent orthopedic surgeon in Machakos, posted a message on a WhatsApp group of 450 medical practitioners and community leaders stating: "Beware of Dr. Salim of Apex Clinic. He performs fake surgeries, uses expired anesthesia, and bribes public health inspectors to avoid closure." Dr. Salim's surgical practice plummeted by 75% within two weeks, causing KES 8 million in lost earnings.

Furthermore, a chemical storage tank situated on Dr. Mwangi's private laboratory premises cracked following a heavy rainstorm. 500 liters of concentrated hydrochloric acid escaped and flowed downhill onto Dr. Salim's clinic garden, destroying specialized physiotherapy equipment stored in a greenhouse.

(a) Advise Dr. Salim on an action for Defamation against Dr. Mwangi, analyzing the elements of libel vs slander, publication on social media/WhatsApp, and potential defenses of justification and qualified privilege under the Defamation Act (Cap 36). (16 Marks)
(b) Advise Dr. Salim on his claim for the chemical damage under the Rule in *Rylands v Fletcher* and the defense of 'Act of God'. (14 Marks)`,
        modelIRACAnswer: {
          issue: `1. Whether Dr. Mwangi's WhatsApp post constitutes actionable Libel under the Defamation Act (Cap 36), and whether the defenses of Justification or Qualified Privilege apply.
2. Whether Dr. Mwangi is strictly liable under the Rule in *Rylands v Fletcher* for the escape of hydrochloric acid, and whether heavy rainstorm constitutes an 'Act of God' (*Vis Major*).`,
          rule: `1. **Defamation Act (Cap 36, Laws of Kenya)**:
   - Section 16A: Defamation in broadcasting and digital communications is actionable as Libel (permanent form).
   - Three core elements of Defamation: (a) Words were defamatory (lowering the plaintiff in the estimation of right-thinking members of society - *Sim v Stretch [1936]*); (b) Words referred to the plaintiff (*Knupffer v London Express [1944]*); (c) Words were published to a third party (*Pullman v Hill [1891]*).
   - Defenses: Justification (truth under Section 14 Cap 36), Fair Comment on matter of public interest, Qualified Privilege (*Adam v Ward [1917]*).
2. **Rule in *Rylands v Fletcher [1868] LR 3 HL 330***:
   - Elements: (a) Bringing onto land something likely to do mischief if it escapes; (b) Non-natural use of land; (c) Escape from the defendant's control to another's land; (d) Foreseeable damage (*Cambridge Water Co v Eastern Counties Leather [1994]*).
   - Defense of Act of God (*Nichols v Marsland [1876]*): Requires natural causes of extraordinary and unprecedented violence that could not have been reasonably anticipated or guarded against (*Greenock Corp v Caledonian Railway [1917]*).`,
          application: `1. **Defamation Analysis**: The WhatsApp message published in a 450-member group is in writing/permanent format, hence actionable *per se* as Libel under Section 16A. Alleging professional misconduct, fake surgeries, and bribery severely disparages Dr. Salim's professional reputation (*Sim v Stretch*). Qualified privilege fails because there was no reciprocal legal, social, or moral duty to publish unsubstantiated rumors to 450 random members (*Adam v Ward*). Malice destroys any privilege.
2. **Rylands v Fletcher Strict Liability**: Storing 500 liters of toxic hydrochloric acid constitutes a non-natural user of land. Acid is inherently dangerous and likely to cause mischief. The escape caused direct damage to Dr. Salim's specialized equipment.
3. **Rejection of 'Act of God' Defense**: A heavy rainstorm in Machakos is a normal seasonal meteorological event, not unprecedented catastrophic violence (*Greenock Corp*). Dr. Mwangi had a strict duty to ensure chemical containment tanks were impermeable.`,
          conclusion: `Dr. Salim will succeed on both counts:
1. In Defamation: Award of general damages for injured professional reputation, aggravated damages for malicious WhatsApp publication, and special damages for proven economic loss (KES 8 million).
2. In Strict Liability (*Rylands v Fletcher*): Special damages for replacement of the destroyed physiotherapy equipment and cleanup costs.`,
          rawMarkdown: `# 📌 ISSUE
- Actionability of WhatsApp group statement as Libel under Defamation Act (Cap 36).
- Strict liability for hazardous chemical escape under *Rylands v Fletcher*.
- Validity of 'Act of God' defense against ordinary seasonal rainstorms.

# 📜 RULE
- **Defamation Act (Cap 36)**: Sections 14 (Justification) & 16A (Digital Libel).
- **Landmark Precedents**: *Sim v Stretch [1936]*, *Adam v Ward [1917]*, *Rylands v Fletcher [1868]*, *Greenock Corp v Caledonian Railway [1917]*.

# ⚖️ APPLICATION
- WhatsApp group messages constitute digital libel actionable without proof of special damage, though KES 8M loss is provable.
- Qualified privilege fails because publication to 450 members exceeds any legitimate reciprocal duty.
- Storing concentrated acid is a non-natural use of land; seasonal rain is not an Act of God under *Greenock Corp*.

# 🏁 CONCLUSION
- Dr. Salim will recover substantial general, aggravated, and special damages in defamation, plus full property replacement costs under strict liability.`,
        },
        examinerRubric: [
          "Defamation elements, digital libel under Sec 16A Cap 36 (8 Marks)",
          "Rebuttal of Qualified Privilege and Justification defenses (8 Marks)",
          "Application of Rylands v Fletcher 4-part strict liability test (8 Marks)",
          "Refutation of Act of God defense using Greenock Corp (6 Marks)",
        ],
      },
    ],
  },
];
