export interface LearnerProfile {
  displayName: string;
  institution: string;
  academicLevel: string;
  focusSubjects: string[];
  preferredMode: "irac" | "vault" | "synthesizer" | "notes" | "statutes" | "offline";
  examTargetDate?: string;
  onboardingCompleted: boolean;
  themePreference?: "dark" | "light" | "system";
}

export const DEFAULT_LEARNER_PROFILE: LearnerProfile = {
  displayName: "Law Scholar",
  institution: "Umma University Faculty of Law",
  academicLevel: "LL.B Candidate",
  focusSubjects: [
    "Law of Contract",
    "Islamic Family Law & Succession (Mirath)",
    "Constitutional Law",
    "Criminal Law & Procedure",
    "Law of Torts",
  ],
  preferredMode: "irac",
  onboardingCompleted: false,
};

const PROFILE_STORAGE_KEY = "leximind_learner_profile_v1";

export const getLearnerProfile = (): LearnerProfile => {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_LEARNER_PROFILE;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_LEARNER_PROFILE, ...parsed };
  } catch {
    return DEFAULT_LEARNER_PROFILE;
  }
};

export const saveLearnerProfile = (profile: Partial<LearnerProfile>): LearnerProfile => {
  const current = getLearnerProfile();
  const updated: LearnerProfile = { ...current, ...profile };
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save learner profile locally:", e);
  }
  return updated;
};

export const isOnboardingCompleted = (): boolean => {
  return getLearnerProfile().onboardingCompleted;
};

export const completeOnboarding = (profileData: Partial<LearnerProfile>): LearnerProfile => {
  return saveLearnerProfile({
    ...profileData,
    onboardingCompleted: true,
  });
};

export const resetOnboarding = (): void => {
  saveLearnerProfile({ onboardingCompleted: false });
};
