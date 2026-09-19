import type {
  AssessmentAnswers,
  AssessmentDomain,
  AssessmentOption,
  AssessmentProfile,
  AssessmentQuestion,
} from '../types';

/** Shared response scale for the short, self-reflective assessment. */
export const LIKERT_OPTIONS: readonly AssessmentOption[] = [
  { value: 1, shortLabel: 'Not me', label: 'Not at all like me' },
  { value: 2, shortLabel: 'A little', label: 'A little like me' },
  { value: 3, shortLabel: 'Somewhat', label: 'Somewhat like me' },
  { value: 4, shortLabel: 'Mostly', label: 'Mostly like me' },
  { value: 5, shortLabel: 'Very much', label: 'Very much like me' },
];

const question = (
  id: string,
  order: number,
  domain: AssessmentDomain,
  dimension: string,
  prompt: string,
  helperText?: string,
): AssessmentQuestion => ({
  id,
  order,
  domain,
  dimension,
  prompt,
  helperText,
  options: LIKERT_OPTIONS,
});

/**
 * 36 concise questions covering interest, strengths, work personality,
 * values, and work-style preferences. Each dimension is deliberately stable
 * so saved answers remain interpretable when the UI changes.
 */
export const ASSESSMENT_QUESTIONS: readonly AssessmentQuestion[] = [
  question('interest-realistic', 1, 'interest', 'realistic', 'I enjoy building, repairing, or working with practical tools and equipment.'),
  question('interest-investigative', 2, 'interest', 'investigative', 'I like exploring complex questions and figuring out how things work.'),
  question('interest-artistic', 3, 'interest', 'artistic', 'I enjoy expressing ideas through design, writing, visuals, or other creative work.'),
  question('interest-social', 4, 'interest', 'social', 'I feel energised when I help, teach, support, or guide other people.'),
  question('interest-enterprising', 5, 'interest', 'enterprising', 'I enjoy persuading people, taking initiative, and turning ideas into action.'),
  question('interest-conventional', 6, 'interest', 'conventional', 'I enjoy organising information, following systems, and keeping work accurate.'),

  question('skill-analytical-thinking', 7, 'skill', 'analyticalThinking', 'I can break a complicated problem into smaller, logical parts.'),
  question('skill-mathematics', 8, 'skill', 'mathematics', 'I am comfortable using numbers, calculations, and quantitative reasoning.'),
  question('skill-communication', 9, 'skill', 'communication', 'I can explain an idea clearly to different kinds of people.'),
  question('skill-leadership', 10, 'skill', 'leadership', 'I can help a group stay focused and move toward a shared goal.'),
  question('skill-creativity', 11, 'skill', 'creativity', 'I often find original ways to approach a task or solve a problem.'),
  question('skill-problem-solving', 12, 'skill', 'problemSolving', 'I persist when something does not work and look for practical alternatives.'),
  question('skill-research', 13, 'skill', 'research', 'I can find reliable information, compare sources, and form a conclusion.'),
  question('skill-organisation', 14, 'skill', 'organization', 'I can plan tasks, manage details, and meet deadlines.'),
  question('skill-technical-aptitude', 15, 'skill', 'technicalAptitude', 'I learn new software, digital tools, or technical concepts comfortably.'),

  question('personality-risk-tolerance', 16, 'personality', 'riskTolerance', 'I am comfortable making a considered decision even when the outcome is uncertain.'),
  question('personality-collaboration', 17, 'personality', 'collaboration', 'I enjoy collaborating closely with other people to complete work.'),
  question('personality-independence', 18, 'personality', 'independence', 'I am comfortable taking ownership and working independently.'),
  question('personality-leadership', 19, 'personality', 'leadership', 'I am interested in taking responsibility for decisions that affect a group.'),
  question('personality-structure', 20, 'personality', 'structurePreference', 'I prefer clear processes, expectations, and routines in my work.'),
  question('personality-creativity', 21, 'personality', 'creativityPreference', 'I prefer work that gives me room to experiment and create new approaches.'),
  question('personality-stability', 22, 'personality', 'stabilityPreference', 'Long-term stability and predictability are important to me in a career.'),

  question('value-salary', 23, 'value', 'salary', 'Strong earning potential is important to me.'),
  question('value-job-security', 24, 'value', 'jobSecurity', 'Job security is important to me when choosing a career.'),
  question('value-social-impact', 25, 'value', 'socialImpact', 'Making a positive difference to people or society matters to me.'),
  question('value-prestige', 26, 'value', 'prestige', 'Professional recognition and reputation matter to me.'),
  question('value-work-life-balance', 27, 'value', 'workLifeBalance', 'Having time and energy outside work is important to me.'),
  question('value-growth', 28, 'value', 'growth', 'I want a career with frequent opportunities to learn and progress.'),
  question('value-intellectual-challenge', 29, 'value', 'intellectualChallenge', 'I value work that keeps me intellectually challenged.'),
  question('value-independence', 30, 'value', 'independence', 'I value having meaningful autonomy in how I work.'),

  question('work-people-systems', 31, 'workPreference', 'peopleSystems', 'I prefer work that involves interacting with people more than working mainly with systems or objects.', 'A high score indicates a people-focused preference.'),
  question('work-analytical-creative', 32, 'workPreference', 'analyticalCreative', 'I prefer creative expression more than highly analytical work.', 'A high score indicates a creative-work preference.'),
  question('work-stability-flexibility', 33, 'workPreference', 'stabilityFlexibility', 'I prefer flexibility and variety over a highly predictable routine.', 'A high score indicates a flexibility preference.'),
  question('work-sector', 34, 'workPreference', 'sectorPreference', 'I feel more drawn to private-sector roles than government or public-service roles.', 'A low score indicates a public-service preference.'),
  question('work-remote', 35, 'workPreference', 'remoteWork', 'The option to work remotely or in a hybrid way is important to me.'),
  question('work-work-life', 36, 'workPreference', 'workLifePriority', 'I would prioritise work-life balance when comparing otherwise suitable careers.'),
];

type ProfileDomain = 'interests' | 'skills' | 'personality' | 'values' | 'workPreferences';

const profileDomainForQuestion: Record<AssessmentDomain, ProfileDomain> = {
  interest: 'interests',
  skill: 'skills',
  personality: 'personality',
  value: 'values',
  workPreference: 'workPreferences',
};

export const createEmptyAssessmentProfile = (): AssessmentProfile => ({
  interests: {},
  skills: {},
  personality: {},
  values: {},
  workPreferences: {},
});

/** Converts saved question answers into the serialisable profile used by scoring. */
export const buildAssessmentProfile = (
  answers: AssessmentAnswers,
  context: Pick<AssessmentProfile, 'educationLevel' | 'stream'> = {},
): AssessmentProfile => {
  const profile: AssessmentProfile = {
    ...createEmptyAssessmentProfile(),
    ...context,
  };

  for (const currentQuestion of ASSESSMENT_QUESTIONS) {
    const answer = answers[currentQuestion.id];

    if (typeof answer !== 'number' || !Number.isFinite(answer)) {
      continue;
    }

    profile[profileDomainForQuestion[currentQuestion.domain]][currentQuestion.dimension] = Math.min(
      5,
      Math.max(1, Math.round(answer)),
    );
  }

  return profile;
};

export const ASSESSMENT_QUESTION_COUNT = ASSESSMENT_QUESTIONS.length;
