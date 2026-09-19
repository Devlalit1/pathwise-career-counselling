/**
 * Shared client-side domain contracts. Ratings use a 1–5 scale unless noted
 * otherwise; a missing key means that dimension has not been assessed yet.
 */

export type UserRole = 'STUDENT' | 'ADMIN';

export type CareerCategory =
  | 'Technology'
  | 'Data & AI'
  | 'Engineering'
  | 'Healthcare'
  | 'Finance'
  | 'Management'
  | 'Government & Public Administration'
  | 'Law'
  | 'Design'
  | 'Media'
  | 'Education'
  | 'Research'
  | 'Entrepreneurship';

export type EducationLevel =
  | 'Class 10'
  | 'Class 11'
  | 'Class 12'
  | 'Diploma'
  | 'Undergraduate'
  | 'Graduate'
  | 'Postgraduate'
  | 'Career switcher';

export type DifficultyLevel = 'Foundation' | 'Intermediate' | 'Advanced';
export type DemandLevel = 'Emerging' | 'Moderate' | 'Strong';
export type SkillKind = 'technical' | 'soft';
export type RoadmapItemKind = 'learn' | 'practice' | 'project' | 'credential' | 'prepare';
export type AssessmentDomain =
  | 'interest'
  | 'skill'
  | 'personality'
  | 'value'
  | 'workPreference';

export interface DemoSalaryRange {
  /** A deliberately illustrative range, never a current-market assertion. */
  range: string;
  label: 'Illustrative demo range';
  isDemoData: true;
  disclaimer: string;
}

export interface DemoDemandIndicator {
  level: DemandLevel;
  label: 'Demo demand indicator';
  isDemoData: true;
  disclaimer: string;
}

export interface CareerSkill {
  id: string;
  name: string;
  kind: SkillKind;
  /** Required confidence/ability on the shared 1–5 self-assessment scale. */
  requiredLevel: number;
  /** Broad assessment dimension used to make skill-gap feedback explainable. */
  assessmentKey?: string;
  description?: string;
}

export interface CareerAcademicFit {
  /** Education stages from which a learner can plausibly begin this pathway. */
  educationLevels: readonly string[];
  /** Optional pathways that make preparation especially direct, not mandatory. */
  preferredStreams?: readonly string[];
  summary: string;
}

export interface CareerFitProfile {
  interests: Record<string, number>;
  skills: Record<string, number>;
  personality: Record<string, number>;
  values: Record<string, number>;
  workPreferences: Record<string, number>;
  academic: CareerAcademicFit;
}

export interface RoadmapItem {
  id: string;
  title: string;
  kind: RoadmapItemKind;
  description?: string;
}

export interface RoadmapPhase {
  id: string;
  title: string;
  description: string;
  items: readonly RoadmapItem[];
}

export interface CareerProgressionStep {
  title: string;
  description: string;
}

export interface Career {
  id: string;
  slug: string;
  name: string;
  category: CareerCategory;
  shortDescription: string;
  overview: string;
  whatYouDo: readonly string[];
  whyChoose: readonly string[];
  education: string;
  difficulty: DifficultyLevel;
  salary: DemoSalaryRange;
  demand: DemoDemandIndicator;
  skills: readonly CareerSkill[];
  technicalSkills: readonly string[];
  softSkills: readonly string[];
  fitProfile: CareerFitProfile;
  progression: readonly CareerProgressionStep[];
  entranceExams: readonly string[];
  certifications: readonly string[];
  courses: readonly string[];
  roadmap: readonly RoadmapPhase[];
  relatedCareerIds: readonly string[];
  workLifeBalance: string;
  growthOutlook: string;
  remoteWorkPotential: string;
  governmentOpportunities: string;
}

export interface AssessmentOption {
  value: number;
  label: string;
  shortLabel: string;
}

export interface AssessmentQuestion {
  id: string;
  order: number;
  domain: AssessmentDomain;
  dimension: string;
  prompt: string;
  helperText?: string;
  options: readonly AssessmentOption[];
}

export type AssessmentAnswers = Record<string, number | undefined>;

/**
 * A compact, serialisable assessment snapshot. Domain maps intentionally use
 * string keys so the questionnaire can evolve without breaking saved results.
 */
export interface AssessmentProfile {
  interests: Record<string, number>;
  skills: Record<string, number>;
  personality: Record<string, number>;
  values: Record<string, number>;
  workPreferences: Record<string, number>;
  educationLevel?: string;
  stream?: string;
}

export interface RecommendationWeights {
  interest: number;
  skill: number;
  personality: number;
  academic: number;
  value: number;
  workPreference: number;
}

export interface SkillGap {
  id: string;
  name: string;
  kind: SkillKind;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  description: string;
}

export interface CareerMatch {
  career: Career;
  careerId: string;
  overallScore: number;
  interestScore: number;
  skillScore: number;
  personalityScore: number;
  academicScore: number;
  valueScore: number;
  workPreferenceScore: number;
  reasons: readonly string[];
  strengths: readonly string[];
  skillGaps: readonly SkillGap[];
  nextSteps: readonly string[];
}
