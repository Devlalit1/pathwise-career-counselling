/**
 * Deterministic, explainable career matching.
 *
 * Values are expected to be 0–100 (0–1 is also accepted for convenience).
 * This service deliberately has no database or HTTP dependency so it can be
 * unit tested and used from a route handler, worker, or seed preview alike.
 */

export type ScoreMap = Record<string, number>;

export type EducationLevel =
  | "CLASS_10"
  | "CLASS_12"
  | "DIPLOMA"
  | "UNDERGRADUATE"
  | "POSTGRADUATE"
  | "GRADUATE"
  | "WORKING_PROFESSIONAL"
  | "OTHER";

export interface UserAcademicProfile {
  educationLevel?: EducationLevel;
  stream?: string;
  /** A normalized academic readiness score, percentage, or CGPA (0–10). */
  score?: number;
}

export interface UserCareerProfile {
  interests?: ScoreMap;
  skills?: ScoreMap;
  personality?: ScoreMap;
  values?: ScoreMap;
  workPreferences?: ScoreMap;
  academic?: UserAcademicProfile;
}

export interface CareerSkillRequirement {
  slug: string;
  name?: string;
  targetLevel: number;
  importance?: number;
}

export interface CareerAcademicProfile {
  minimumEducationLevel?: EducationLevel;
  preferredStreams?: string[];
  minimumAcademicScore?: number;
}

export interface CareerForMatching {
  id: string;
  slug: string;
  name: string;
  interestTargets?: ScoreMap;
  skillRequirements?: CareerSkillRequirement[];
  personalityTargets?: ScoreMap;
  valueTargets?: ScoreMap;
  workPreferenceTargets?: ScoreMap;
  academicProfile?: CareerAcademicProfile;
}

export interface RecommendationWeights {
  interest: number;
  skill: number;
  personality: number;
  academic: number;
  value: number;
  workPreference: number;
}

export const DEFAULT_RECOMMENDATION_WEIGHTS: RecommendationWeights = {
  interest: 0.3,
  skill: 0.25,
  personality: 0.15,
  academic: 0.15,
  value: 0.1,
  workPreference: 0.05,
};

export interface DimensionContribution {
  key: string;
  expected: number;
  actual: number;
  score: number;
}

export interface SkillGap {
  slug: string;
  name: string;
  currentLevel: number;
  targetLevel: number;
  importance: number;
}

export interface CareerMatch {
  careerId: string;
  careerSlug: string;
  careerName: string;
  overallScore: number;
  interestScore: number;
  skillScore: number;
  personalityScore: number;
  academicScore: number;
  valueScore: number;
  workPreferenceScore: number;
  reasons: string[];
  strengths: string[];
  skillGaps: SkillGap[];
  nextSteps: string[];
  breakdown: {
    weights: RecommendationWeights;
    interest: DimensionContribution[];
    personality: DimensionContribution[];
    values: DimensionContribution[];
    workPreferences: DimensionContribution[];
  };
}

const EDUCATION_RANK: Record<EducationLevel, number> = {
  CLASS_10: 1,
  CLASS_12: 2,
  DIPLOMA: 3,
  UNDERGRADUATE: 4,
  GRADUATE: 5,
  POSTGRADUATE: 6,
  WORKING_PROFESSIONAL: 7,
  OTHER: 0,
};

const DEFAULT_NEUTRAL_SCORE = 50;

function clamp(value: number, minimum = 0, maximum = 100): number {
  return Math.min(Math.max(value, minimum), maximum);
}

/** Accept 0–1, 0–10 (for CGPA), and 0–100 score inputs. */
export function normalizeScore(value: number | undefined, fallback = DEFAULT_NEUTRAL_SCORE): number {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  if (value >= 0 && value <= 1) return Math.round(value * 100);
  if (value > 1 && value <= 10) return Math.round(value * 10);
  return Math.round(clamp(value));
}

function formatLabel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function normalizeLabel(value: string): string {
  return value.trim().toLocaleLowerCase().replace(/[\s_-]+/g, " ");
}

function normalizedWeights(overrides?: Partial<RecommendationWeights>): RecommendationWeights {
  const proposed = { ...DEFAULT_RECOMMENDATION_WEIGHTS, ...overrides };
  const total = Object.values(proposed).reduce((sum, value) => sum + (Number.isFinite(value) && value > 0 ? value : 0), 0);

  if (total === 0) return { ...DEFAULT_RECOMMENDATION_WEIGHTS };

  return {
    interest: Math.max(0, proposed.interest) / total,
    skill: Math.max(0, proposed.skill) / total,
    personality: Math.max(0, proposed.personality) / total,
    academic: Math.max(0, proposed.academic) / total,
    value: Math.max(0, proposed.value) / total,
    workPreference: Math.max(0, proposed.workPreference) / total,
  };
}

function scoreTargetMap(userValues: ScoreMap | undefined, targets: ScoreMap | undefined): {
  score: number;
  contributions: DimensionContribution[];
} {
  const entries = Object.entries(targets ?? {}).filter(([, target]) => typeof target === "number");
  if (entries.length === 0) return { score: DEFAULT_NEUTRAL_SCORE, contributions: [] };

  const contributions = entries.map(([key, target]) => {
    const expected = normalizeScore(target);
    const actual = normalizeScore(userValues?.[key]);
    return {
      key,
      expected,
      actual,
      score: Math.round(100 - Math.abs(expected - actual)),
    };
  });

  // Higher target values indicate a more central trait for the career.
  const totalImportance = contributions.reduce((sum, item) => sum + Math.max(item.expected, 25), 0);
  const score = contributions.reduce(
    (sum, item) => sum + item.score * Math.max(item.expected, 25),
    0,
  ) / totalImportance;

  return { score: Math.round(score), contributions };
}

function scoreSkills(
  userSkills: ScoreMap | undefined,
  requirements: CareerSkillRequirement[] | undefined,
): { score: number; gaps: SkillGap[]; strengths: SkillGap[] } {
  const requirementsWithTargets = (requirements ?? []).filter(
    (requirement) => Number.isFinite(requirement.targetLevel) && requirement.targetLevel > 0,
  );

  if (requirementsWithTargets.length === 0) {
    return { score: DEFAULT_NEUTRAL_SCORE, gaps: [], strengths: [] };
  }

  const evaluations = requirementsWithTargets.map((requirement) => {
    const targetLevel = normalizeScore(requirement.targetLevel);
    const currentLevel = normalizeScore(userSkills?.[requirement.slug], 0);
    const importance = clamp(requirement.importance ?? 50, 1, 100);
    const fit = Math.round(Math.min(currentLevel / targetLevel, 1) * 100);
    const skill: SkillGap = {
      slug: requirement.slug,
      name: requirement.name ?? formatLabel(requirement.slug),
      currentLevel,
      targetLevel,
      importance,
    };

    return { fit, importance, skill };
  });

  const totalImportance = evaluations.reduce((sum, item) => sum + item.importance, 0);
  const score = Math.round(
    evaluations.reduce((sum, item) => sum + item.fit * item.importance, 0) / totalImportance,
  );

  const gaps = evaluations
    .filter((item) => item.fit < 70)
    .sort((left, right) => right.importance - left.importance || left.fit - right.fit)
    .map((item) => item.skill);
  const strengths = evaluations
    .filter((item) => item.fit >= 80)
    .sort((left, right) => right.importance - left.importance || right.fit - left.fit)
    .map((item) => item.skill);

  return { score, gaps, strengths };
}

function scoreAcademicFit(userAcademic: UserAcademicProfile | undefined, careerAcademic: CareerAcademicProfile | undefined): number {
  if (!careerAcademic) return DEFAULT_NEUTRAL_SCORE;

  const levelScore = (() => {
    if (!careerAcademic.minimumEducationLevel) return DEFAULT_NEUTRAL_SCORE;
    if (!userAcademic?.educationLevel) return DEFAULT_NEUTRAL_SCORE;

    const difference = EDUCATION_RANK[userAcademic.educationLevel] - EDUCATION_RANK[careerAcademic.minimumEducationLevel];
    if (difference >= 0) return 100;
    if (difference === -1) return 60;
    return 25;
  })();

  const streamScore = (() => {
    const preferredStreams = careerAcademic.preferredStreams?.map(normalizeLabel) ?? [];
    if (preferredStreams.length === 0 || !userAcademic?.stream) return DEFAULT_NEUTRAL_SCORE;
    return preferredStreams.includes(normalizeLabel(userAcademic.stream)) ? 100 : 55;
  })();

  const gradeScore = (() => {
    if (careerAcademic.minimumAcademicScore === undefined) return DEFAULT_NEUTRAL_SCORE;
    const current = normalizeScore(userAcademic?.score);
    const target = normalizeScore(careerAcademic.minimumAcademicScore);
    return Math.round(Math.min(current / target, 1) * 100);
  })();

  const applicableScores = [
    careerAcademic.minimumEducationLevel ? levelScore : undefined,
    careerAcademic.preferredStreams?.length ? streamScore : undefined,
    careerAcademic.minimumAcademicScore !== undefined ? gradeScore : undefined,
  ].filter((score): score is number => score !== undefined);

  if (applicableScores.length === 0) return DEFAULT_NEUTRAL_SCORE;
  return Math.round(applicableScores.reduce((sum, score) => sum + score, 0) / applicableScores.length);
}

function topAlignedLabels(contributions: DimensionContribution[], minimumScore = 75): string[] {
  return contributions
    .filter((item) => item.score >= minimumScore)
    .sort((left, right) => right.score - left.score || right.expected - left.expected)
    .slice(0, 2)
    .map((item) => formatLabel(item.key));
}

function unique(items: string[]): string[] {
  return [...new Set(items.filter(Boolean))];
}

/**
 * Returns a reproducible explanation for one user/career pair. No stochastic
 * or model-based factor is used; equal scores are resolved by the caller.
 */
export function calculateCareerMatch(
  userProfile: UserCareerProfile,
  career: CareerForMatching,
  weightOverrides?: Partial<RecommendationWeights>,
): CareerMatch {
  const weights = normalizedWeights(weightOverrides);
  const interest = scoreTargetMap(userProfile.interests, career.interestTargets);
  const skills = scoreSkills(userProfile.skills, career.skillRequirements);
  const personality = scoreTargetMap(userProfile.personality, career.personalityTargets);
  const values = scoreTargetMap(userProfile.values, career.valueTargets);
  const workPreferences = scoreTargetMap(userProfile.workPreferences, career.workPreferenceTargets);
  const academicScore = scoreAcademicFit(userProfile.academic, career.academicProfile);

  const overallScore = Math.round(
    interest.score * weights.interest +
      skills.score * weights.skill +
      personality.score * weights.personality +
      academicScore * weights.academic +
      values.score * weights.value +
      workPreferences.score * weights.workPreference,
  );

  const reasons = unique([
    ...topAlignedLabels(interest.contributions).map(
      (label) => `Your ${label.toLocaleLowerCase()} interest is aligned with this path.`,
    ),
    ...topAlignedLabels(personality.contributions).map(
      (label) => `Your ${label.toLocaleLowerCase()} work style is compatible with the role.`,
    ),
    ...topAlignedLabels(values.contributions).map(
      (label) => `This path may support your stated value of ${label.toLocaleLowerCase()}.`,
    ),
    skills.strengths.slice(0, 2).map((skill) => `You already show readiness in ${skill.name}.`),
    academicScore >= 80 ? "Your current academic profile is a potentially suitable starting point." : "Academic fit is an area to review as you explore this path.",
  ]).slice(0, 5);

  const strengths = unique([
    ...topAlignedLabels(interest.contributions).map((label) => `${label} interest`),
    ...topAlignedLabels(personality.contributions).map((label) => `${label} work style`),
    ...skills.strengths.slice(0, 3).map((skill) => skill.name),
  ]).slice(0, 5);

  const nextSteps = unique([
    ...skills.gaps.slice(0, 3).map((skill) => `Build ${skill.name} toward the suggested ${skill.targetLevel}/100 level.`),
    academicScore < 70 ? "Review the education pathway and entry requirements with current institution or employer sources." : "Explore an introductory project or job-shadowing experience to validate your interest.",
    "Use this result as guidance and compare it with your lived interests, opportunities, and current requirements.",
  ]).slice(0, 5);

  return {
    careerId: career.id,
    careerSlug: career.slug,
    careerName: career.name,
    overallScore,
    interestScore: interest.score,
    skillScore: skills.score,
    personalityScore: personality.score,
    academicScore,
    valueScore: values.score,
    workPreferenceScore: workPreferences.score,
    reasons,
    strengths,
    skillGaps: skills.gaps,
    nextSteps,
    breakdown: {
      weights,
      interest: interest.contributions,
      personality: personality.contributions,
      values: values.contributions,
      workPreferences: workPreferences.contributions,
    },
  };
}

/** Return the strongest matches in a stable order, making test results reproducible. */
export function recommendCareers(
  userProfile: UserCareerProfile,
  careers: CareerForMatching[],
  options: { limit?: number; weights?: Partial<RecommendationWeights> } = {},
): CareerMatch[] {
  const limit = Math.max(1, Math.floor(options.limit ?? 5));

  return careers
    .map((career) => calculateCareerMatch(userProfile, career, options.weights))
    .sort(
      (left, right) =>
        right.overallScore - left.overallScore ||
        right.interestScore - left.interestScore ||
        left.careerSlug.localeCompare(right.careerSlug),
    )
    .slice(0, limit);
}

export function getMatchLabel(score: number): "Strong match" | "Potential match" | "Worth exploring" {
  if (score >= 75) return "Strong match";
  if (score >= 55) return "Potential match";
  return "Worth exploring";
}
