import { LawUnit } from "../types";
import { YEAR_1_LAW_UNITS } from "./curriculumYear1";
import { YEAR_2_LAW_UNITS } from "./curriculumYear2";
import { YEAR_3_LAW_UNITS } from "./curriculumYear3";
import { YEAR_4_LAW_UNITS } from "./curriculumYear4";

// All 4 years of Umma University School of Law & Shariah units in sequential semester order
export const ALL_UMMA_LAW_UNITS: LawUnit[] = [
  ...YEAR_1_LAW_UNITS,
  ...YEAR_2_LAW_UNITS,
  ...YEAR_3_LAW_UNITS,
  ...YEAR_4_LAW_UNITS,
];

export const SEMESTER_SECTIONS = [
  { id: "all", label: "All Semesters (Complete 4-Year LL.B)", shortLabel: "All Units", count: ALL_UMMA_LAW_UNITS.length },
  { id: "y1s1", label: "Year 1 - Semester 1", shortLabel: "Y1 S1", year: 1, semester: 1 },
  { id: "y1s2", label: "Year 1 - Semester 2", shortLabel: "Y1 S2", year: 1, semester: 2 },
  { id: "y2s1", label: "Year 2 - Semester 1", shortLabel: "Y2 S1", year: 2, semester: 1 },
  { id: "y2s2", label: "Year 2 - Semester 2", shortLabel: "Y2 S2", year: 2, semester: 2 },
  { id: "y3s1", label: "Year 3 - Semester 1", shortLabel: "Y3 S1", year: 3, semester: 1 },
  { id: "y3s2", label: "Year 3 - Semester 2", shortLabel: "Y3 S2", year: 3, semester: 2 },
  { id: "y4s1", label: "Year 4 - Semester 1", shortLabel: "Y4 S1", year: 4, semester: 1 },
  { id: "y4s2", label: "Year 4 - Semester 2", shortLabel: "Y4 S2", year: 4, semester: 2 },
];
