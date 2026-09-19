import type {
  Career,
  CareerAcademicFit,
  CareerCategory,
  CareerFitProfile,
  CareerSkill,
  DemoDemandIndicator,
  DemoSalaryRange,
  DifficultyLevel,
  RoadmapPhase,
} from '../types';

const DEMO_DATA_DISCLAIMER =
  'Illustrative demo data only. Compensation and opportunities vary by employer, location, experience, and time; verify current information independently.';

const eligibilityDisclaimer =
  'Pathways and eligibility can change. Verify current requirements with the relevant institution, regulator, or recruitment notification.';

const salary = (range: string): DemoSalaryRange => ({
  range: `Illustrative ${range}`,
  label: 'Illustrative demo range',
  isDemoData: true,
  disclaimer: DEMO_DATA_DISCLAIMER,
});

const demand = (level: DemoDemandIndicator['level']): DemoDemandIndicator => ({
  level,
  label: 'Demo demand indicator',
  isDemoData: true,
  disclaimer: 'A qualitative sample indicator, not a live labour-market forecast. Verify current opportunities locally.',
});

const technical = (
  id: string,
  name: string,
  requiredLevel: number,
  assessmentKey = 'technicalAptitude',
): CareerSkill => ({ id, name, kind: 'technical', requiredLevel, assessmentKey });

const soft = (
  id: string,
  name: string,
  requiredLevel: number,
  assessmentKey: string,
): CareerSkill => ({ id, name, kind: 'soft', requiredLevel, assessmentKey });

const academic = (
  educationLevels: readonly string[],
  summary: string,
  preferredStreams?: readonly string[],
): CareerAcademicFit => ({ educationLevels, summary, preferredStreams });

type FitDimensions = Omit<CareerFitProfile, 'academic'>;
type FitOverrides = Partial<FitDimensions>;

const mergeFit = (
  base: FitDimensions,
  academicFit: CareerAcademicFit,
  overrides: FitOverrides = {},
): CareerFitProfile => ({
  interests: { ...base.interests, ...overrides.interests },
  skills: { ...base.skills, ...overrides.skills },
  personality: { ...base.personality, ...overrides.personality },
  values: { ...base.values, ...overrides.values },
  workPreferences: { ...base.workPreferences, ...overrides.workPreferences },
  academic: academicFit,
});

const technologyFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { investigative: 5, realistic: 3, conventional: 3 },
      skills: { analyticalThinking: 4, problemSolving: 5, technicalAptitude: 5 },
      personality: { collaboration: 4, independence: 4, creativityPreference: 3 },
      values: { growth: 5, intellectualChallenge: 5, salary: 4 },
      workPreferences: { peopleSystems: 2, analyticalCreative: 2, stabilityFlexibility: 4, sectorPreference: 5, remoteWork: 5 },
    },
    academicFit,
    overrides,
  );

const dataFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { investigative: 5, conventional: 4, realistic: 2 },
      skills: { analyticalThinking: 5, mathematics: 4, research: 4, problemSolving: 4, technicalAptitude: 4 },
      personality: { independence: 4, structurePreference: 4, collaboration: 3 },
      values: { intellectualChallenge: 5, growth: 5, salary: 4 },
      workPreferences: { peopleSystems: 2, analyticalCreative: 2, stabilityFlexibility: 3, sectorPreference: 5, remoteWork: 4 },
    },
    academicFit,
    overrides,
  );

const engineeringFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { realistic: 4, investigative: 5, conventional: 3 },
      skills: { analyticalThinking: 5, mathematics: 5, problemSolving: 5, technicalAptitude: 4 },
      personality: { collaboration: 4, independence: 4, structurePreference: 3 },
      values: { intellectualChallenge: 5, growth: 4, jobSecurity: 4 },
      workPreferences: { peopleSystems: 2, analyticalCreative: 2, stabilityFlexibility: 3, sectorPreference: 4, remoteWork: 2 },
    },
    academicFit,
    overrides,
  );

const healthcareFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { social: 5, investigative: 4, realistic: 3 },
      skills: { problemSolving: 4, research: 4, communication: 4, organization: 4 },
      personality: { collaboration: 5, structurePreference: 4, stabilityPreference: 4 },
      values: { socialImpact: 5, jobSecurity: 4, intellectualChallenge: 4 },
      workPreferences: { peopleSystems: 5, analyticalCreative: 2, stabilityFlexibility: 2, sectorPreference: 3, remoteWork: 1 },
    },
    academicFit,
    overrides,
  );

const financeFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { conventional: 5, investigative: 4, enterprising: 3 },
      skills: { mathematics: 5, analyticalThinking: 5, organization: 4, communication: 3 },
      personality: { structurePreference: 4, independence: 4, collaboration: 3 },
      values: { salary: 5, growth: 4, prestige: 4, jobSecurity: 3 },
      workPreferences: { peopleSystems: 3, analyticalCreative: 2, stabilityFlexibility: 3, sectorPreference: 5, remoteWork: 3 },
    },
    academicFit,
    overrides,
  );

const managementFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { enterprising: 5, social: 4, investigative: 3 },
      skills: { communication: 5, leadership: 5, analyticalThinking: 4, organization: 4 },
      personality: { leadership: 5, collaboration: 5, riskTolerance: 4 },
      values: { growth: 5, salary: 4, independence: 4 },
      workPreferences: { peopleSystems: 4, analyticalCreative: 3, stabilityFlexibility: 4, sectorPreference: 5, remoteWork: 3 },
    },
    academicFit,
    overrides,
  );

const governmentFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { social: 4, enterprising: 4, conventional: 4, investigative: 3 },
      skills: { communication: 5, leadership: 4, research: 4, organization: 4 },
      personality: { leadership: 4, structurePreference: 4, stabilityPreference: 5 },
      values: { socialImpact: 5, jobSecurity: 5, prestige: 4 },
      workPreferences: { peopleSystems: 4, analyticalCreative: 3, stabilityFlexibility: 2, sectorPreference: 1, remoteWork: 1 },
    },
    academicFit,
    overrides,
  );

const lawFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { investigative: 5, enterprising: 4, social: 3, conventional: 3 },
      skills: { communication: 5, research: 5, analyticalThinking: 4, organization: 4 },
      personality: { independence: 4, leadership: 4, riskTolerance: 3 },
      values: { intellectualChallenge: 5, prestige: 4, socialImpact: 4 },
      workPreferences: { peopleSystems: 4, analyticalCreative: 2, stabilityFlexibility: 3, sectorPreference: 4, remoteWork: 2 },
    },
    academicFit,
    overrides,
  );

const designFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { artistic: 5, realistic: 3, social: 3 },
      skills: { creativity: 5, communication: 4, problemSolving: 4, technicalAptitude: 3 },
      personality: { creativityPreference: 5, independence: 4, collaboration: 4 },
      values: { independence: 4, growth: 4, workLifeBalance: 3 },
      workPreferences: { peopleSystems: 3, analyticalCreative: 5, stabilityFlexibility: 4, sectorPreference: 5, remoteWork: 4 },
    },
    academicFit,
    overrides,
  );

const mediaFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { artistic: 5, enterprising: 4, social: 4 },
      skills: { creativity: 5, communication: 5, organization: 3, technicalAptitude: 3 },
      personality: { creativityPreference: 5, riskTolerance: 4, independence: 4 },
      values: { independence: 4, growth: 4, prestige: 3 },
      workPreferences: { peopleSystems: 4, analyticalCreative: 5, stabilityFlexibility: 5, sectorPreference: 5, remoteWork: 4 },
    },
    academicFit,
    overrides,
  );

const educationFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { social: 5, investigative: 3, artistic: 3 },
      skills: { communication: 5, organization: 4, research: 3, leadership: 3 },
      personality: { collaboration: 5, structurePreference: 4, stabilityPreference: 4 },
      values: { socialImpact: 5, workLifeBalance: 4, jobSecurity: 4 },
      workPreferences: { peopleSystems: 5, analyticalCreative: 3, stabilityFlexibility: 2, sectorPreference: 3, remoteWork: 2 },
    },
    academicFit,
    overrides,
  );

const researchFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { investigative: 5, realistic: 3, conventional: 3 },
      skills: { research: 5, analyticalThinking: 5, mathematics: 4, problemSolving: 4 },
      personality: { independence: 5, curiosityPreference: 5, structurePreference: 3 },
      values: { intellectualChallenge: 5, growth: 5, independence: 4 },
      workPreferences: { peopleSystems: 2, analyticalCreative: 2, stabilityFlexibility: 3, sectorPreference: 3, remoteWork: 3 },
    },
    academicFit,
    overrides,
  );

const entrepreneurshipFit = (academicFit: CareerAcademicFit, overrides?: FitOverrides): CareerFitProfile =>
  mergeFit(
    {
      interests: { enterprising: 5, artistic: 3, social: 4, investigative: 3 },
      skills: { leadership: 5, communication: 5, problemSolving: 5, creativity: 4, organization: 4 },
      personality: { riskTolerance: 5, independence: 5, leadership: 5, creativityPreference: 4 },
      values: { independence: 5, growth: 5, salary: 4 },
      workPreferences: { peopleSystems: 4, analyticalCreative: 4, stabilityFlexibility: 5, sectorPreference: 5, remoteWork: 4 },
    },
    academicFit,
    overrides,
  );

const makeRoadmap = (careerId: string, careerName: string, skills: readonly CareerSkill[]): readonly RoadmapPhase[] => {
  const primary = skills[0]?.name ?? 'core foundations';
  const secondary = skills[1]?.name ?? 'practical skills';
  const tertiary = skills[2]?.name ?? 'applied practice';

  return [
    {
      id: `${careerId}-foundation`,
      title: 'Foundation',
      description: `Build a clear view of ${careerName} and its entry pathways.`,
      items: [
        { id: `${careerId}-explore`, title: `Explore the ${careerName} pathway`, kind: 'learn' },
        { id: `${careerId}-primary`, title: `Learn ${primary}`, kind: 'learn' },
      ],
    },
    {
      id: `${careerId}-core`,
      title: 'Core skills',
      description: 'Develop the abilities most often used in beginner work and study.',
      items: [
        { id: `${careerId}-secondary`, title: `Practise ${secondary}`, kind: 'practice' },
        { id: `${careerId}-tertiary`, title: `Apply ${tertiary}`, kind: 'practice' },
      ],
    },
    {
      id: `${careerId}-evidence`,
      title: 'Evidence of learning',
      description: 'Create proof of progress that can support future applications.',
      items: [
        { id: `${careerId}-project`, title: `Complete a small ${careerName} project`, kind: 'project' },
        { id: `${careerId}-feedback`, title: 'Request feedback from a mentor or peer', kind: 'practice' },
      ],
    },
    {
      id: `${careerId}-prepare`,
      title: 'Career preparation',
      description: 'Translate skills and evidence into the next appropriate opportunity.',
      items: [
        { id: `${careerId}-portfolio`, title: 'Update your resume or portfolio', kind: 'prepare' },
        { id: `${careerId}-requirements`, title: 'Verify current eligibility and application requirements', kind: 'prepare' },
      ],
    },
  ];
};

interface CareerSeed {
  id: string;
  name: string;
  category: CareerCategory;
  shortDescription: string;
  overview: string;
  whatYouDo: readonly string[];
  whyChoose: readonly string[];
  education: string;
  difficulty: DifficultyLevel;
  salaryRange: string;
  demandLevel: DemoDemandIndicator['level'];
  skills: readonly CareerSkill[];
  fitProfile: CareerFitProfile;
  progression?: Career['progression'];
  entranceExams?: readonly string[];
  certifications?: readonly string[];
  courses?: readonly string[];
  relatedCareerIds?: readonly string[];
  workLifeBalance?: string;
  growthOutlook?: string;
  remoteWorkPotential?: string;
  governmentOpportunities?: string;
}

const makeCareer = (seed: CareerSeed): Career => ({
  id: seed.id,
  slug: seed.id,
  name: seed.name,
  category: seed.category,
  shortDescription: seed.shortDescription,
  overview: seed.overview,
  whatYouDo: seed.whatYouDo,
  whyChoose: seed.whyChoose,
  education: seed.education,
  difficulty: seed.difficulty,
  salary: salary(seed.salaryRange),
  demand: demand(seed.demandLevel),
  skills: seed.skills,
  technicalSkills: seed.skills.filter((skill) => skill.kind === 'technical').map((skill) => skill.name),
  softSkills: seed.skills.filter((skill) => skill.kind === 'soft').map((skill) => skill.name),
  fitProfile: seed.fitProfile,
  progression:
    seed.progression ??
    [
      { title: 'Foundation', description: `Build core knowledge and guided practice in ${seed.name}.` },
      { title: 'Early experience', description: 'Use projects, internships, volunteering, or supervised work to apply those skills.' },
      { title: 'Specialise', description: 'Choose a focus area based on your interests and available opportunities.' },
    ],
  entranceExams: seed.entranceExams ?? [eligibilityDisclaimer],
  certifications: seed.certifications ?? ['Optional credentials vary by employer and provider; prioritise demonstrable skills and verified requirements.'],
  courses: seed.courses ?? [`Foundational learning in ${seed.name}`, 'Applied projects and mentor feedback'],
  roadmap: makeRoadmap(seed.id, seed.name, seed.skills),
  relatedCareerIds: seed.relatedCareerIds ?? [],
  workLifeBalance: seed.workLifeBalance ?? 'Varies substantially by employer, team, location, and career stage.',
  growthOutlook: seed.growthOutlook ?? 'Demo qualitative outlook; current opportunities depend on local conditions and your specialisation.',
  remoteWorkPotential: seed.remoteWorkPotential ?? 'Varies by employer and day-to-day responsibilities.',
  governmentOpportunities: seed.governmentOpportunities ?? 'Potential pathways vary by current recruitment notifications and eligibility rules.',
});

const schoolAndGraduate = ['Class 10', 'Class 11', 'Class 12', 'Undergraduate', 'Graduate', 'Career switcher'] as const;
const higherEducation = ['Class 12', 'Undergraduate', 'Graduate', 'Postgraduate', 'Career switcher'] as const;
const engineeringPathway = ['Class 10', 'Class 11', 'Class 12', 'Diploma', 'Undergraduate', 'Graduate', 'Career switcher'] as const;

/**
 * Curated catalogue for the UI and local demo. Salary and demand fields are
 * explicitly illustrative; they must not be rendered as current market facts.
 */
export const CAREERS: readonly Career[] = [
  makeCareer({
    id: 'software-engineer',
    name: 'Software Engineer',
    category: 'Technology',
    shortDescription: 'Designs, builds, tests, and improves software products and services.',
    overview: 'Software engineering combines structured problem solving with collaborative product development across web, mobile, systems, and enterprise applications.',
    whatYouDo: ['Translate user or business needs into reliable software.', 'Review, test, and improve code with a development team.'],
    whyChoose: ['A strong option for learners who enjoy solving technical problems.', 'Offers many directions for specialisation, from front-end work to platforms and systems.'],
    education: 'Common routes include a computing degree, diploma, bootcamp, or self-directed portfolio; employer requirements vary.',
    difficulty: 'Advanced',
    salaryRange: '₹6–14 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('programming', 'Programming fundamentals', 4),
      technical('software-design', 'Software design', 4, 'problemSolving'),
      technical('debugging', 'Debugging and testing', 4, 'analyticalThinking'),
      technical('version-control', 'Version control workflows', 3),
      soft('technical-communication', 'Technical communication', 3, 'communication'),
    ],
    fitProfile: technologyFit(
      academic(engineeringPathway, 'A structured computing or engineering pathway can help, but portfolio-based routes also exist.', ['Science', 'Computer Science', 'Any stream']),
      { workPreferences: { remoteWork: 5, peopleSystems: 2 } },
    ),
    certifications: ['Vendor-neutral programming or cloud fundamentals credentials can be useful; verify relevance to the target role.'],
    courses: ['Programming fundamentals', 'Data structures and algorithms', 'Software testing and a portfolio project'],
    relatedCareerIds: ['cloud-engineer', 'cybersecurity-analyst', 'product-manager'],
    remoteWorkPotential: 'Often possible in some teams, but arrangement varies by employer and role.',
  }),
  makeCareer({
    id: 'data-analyst',
    name: 'Data Analyst',
    category: 'Data & AI',
    shortDescription: 'Turns data into clear insights that support practical decisions.',
    overview: 'Data analysts clean, explore, visualise, and communicate data so teams can understand patterns and make informed choices.',
    whatYouDo: ['Prepare and analyse datasets using spreadsheets, SQL, or similar tools.', 'Create dashboards and explain insights to stakeholders.'],
    whyChoose: ['A suitable exploratory path for analytical learners who like evidence-based problem solving.', 'Can connect business questions with technical data skills.'],
    education: 'Pathways include degrees in analytics, commerce, economics, mathematics, engineering, or a portfolio-backed transition.',
    difficulty: 'Intermediate',
    salaryRange: '₹4–10 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('spreadsheets', 'Spreadsheets and data cleaning', 4, 'organization'),
      technical('sql', 'SQL querying', 4, 'technicalAptitude'),
      technical('statistics', 'Applied statistics', 3, 'mathematics'),
      technical('data-visualisation', 'Data visualisation', 4, 'analyticalThinking'),
      soft('data-storytelling', 'Data storytelling', 3, 'communication'),
    ],
    fitProfile: dataFit(
      academic(schoolAndGraduate, 'Maths, commerce, economics, science, and self-directed data pathways can all be relevant.', ['Science', 'Commerce', 'Economics', 'Any stream']),
      { workPreferences: { peopleSystems: 3, remoteWork: 4 } },
    ),
    certifications: ['Entry-level analytics credentials may help demonstrate learning; check current provider requirements.'],
    courses: ['Excel or spreadsheet analysis', 'SQL and basic statistics', 'Dashboard project using sample data'],
    relatedCareerIds: ['data-scientist', 'business-analyst', 'financial-analyst'],
  }),
  makeCareer({
    id: 'data-scientist',
    name: 'Data Scientist',
    category: 'Data & AI',
    shortDescription: 'Uses statistics, programming, and domain knowledge to investigate and model complex data.',
    overview: 'Data science combines experimentation, modelling, and communication to answer uncertain questions with evidence.',
    whatYouDo: ['Frame a question, prepare data, and test analytical or predictive approaches.', 'Communicate limitations and findings to technical and non-technical audiences.'],
    whyChoose: ['Fits learners drawn to maths, research, and open-ended analytical challenges.', 'Provides room to specialise in domains such as health, finance, or product analytics.'],
    education: 'Often built through quantitative study plus programming practice; exact credentials depend on the employer and specialty.',
    difficulty: 'Advanced',
    salaryRange: '₹7–18 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('python', 'Python or similar data programming', 4),
      technical('statistical-modelling', 'Statistical modelling', 5, 'mathematics'),
      technical('machine-learning', 'Machine learning foundations', 4, 'technicalAptitude'),
      technical('data-experimentation', 'Data experimentation', 4, 'research'),
      soft('scientific-communication', 'Clear evidence communication', 4, 'communication'),
    ],
    fitProfile: dataFit(
      academic(higherEducation, 'Quantitative study is often helpful, alongside demonstrable programming and data projects.', ['Science', 'Mathematics', 'Statistics', 'Engineering', 'Economics']),
      { skills: { mathematics: 5, research: 5 }, values: { intellectualChallenge: 5 } },
    ),
    courses: ['Python for data analysis', 'Probability and statistics', 'End-to-end data science project'],
    relatedCareerIds: ['data-analyst', 'machine-learning-engineer', 'research-scientist'],
  }),
  makeCareer({
    id: 'machine-learning-engineer',
    name: 'Machine Learning Engineer',
    category: 'Data & AI',
    shortDescription: 'Builds reliable systems that put machine-learning models into practical use.',
    overview: 'Machine learning engineers connect modelling knowledge with software, data, testing, and deployment practices.',
    whatYouDo: ['Develop, evaluate, and improve model-powered features.', 'Build data and deployment workflows that make models maintainable in production.'],
    whyChoose: ['Suitable for people who enjoy both software engineering and applied data science.', 'Offers a technically demanding route into responsible AI product work.'],
    education: 'Typically requires substantial programming and quantitative preparation; routes vary by employer and project complexity.',
    difficulty: 'Advanced',
    salaryRange: '₹8–20 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('ml-programming', 'Production programming', 5),
      technical('model-development', 'Model development and evaluation', 4, 'technicalAptitude'),
      technical('data-pipelines', 'Data pipelines', 4, 'problemSolving'),
      technical('model-deployment', 'Model deployment practices', 4),
      soft('model-collaboration', 'Cross-functional communication', 3, 'communication'),
    ],
    fitProfile: technologyFit(
      academic(higherEducation, 'A strong base in computing and quantitative subjects is useful; project evidence matters.', ['Science', 'Mathematics', 'Computer Science', 'Engineering']),
      { interests: { investigative: 5 }, skills: { mathematics: 5, research: 4, technicalAptitude: 5 } },
    ),
    courses: ['Programming and data structures', 'Machine learning foundations', 'Deploy a small model responsibly'],
    relatedCareerIds: ['data-scientist', 'software-engineer', 'cloud-engineer'],
  }),
  makeCareer({
    id: 'cybersecurity-analyst',
    name: 'Cybersecurity Analyst',
    category: 'Technology',
    shortDescription: 'Helps identify, reduce, and respond to technology security risks.',
    overview: 'Cybersecurity analysts investigate systems, monitor risks, strengthen controls, and communicate practical security guidance.',
    whatYouDo: ['Review security alerts and investigate unusual activity.', 'Help teams improve access, configuration, awareness, and incident response practices.'],
    whyChoose: ['May suit investigative learners who enjoy structured, high-stakes problem solving.', 'Combines technical learning with careful judgement and communication.'],
    education: 'Common routes include computing study, IT support experience, labs, and vendor or industry learning; requirements vary.',
    difficulty: 'Advanced',
    salaryRange: '₹5–13 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('networking', 'Networking foundations', 4),
      technical('security-monitoring', 'Security monitoring', 4, 'analyticalThinking'),
      technical('threat-analysis', 'Threat analysis', 4, 'research'),
      technical('incident-response', 'Incident response basics', 3, 'problemSolving'),
      soft('risk-communication', 'Risk communication', 3, 'communication'),
    ],
    fitProfile: technologyFit(
      academic(engineeringPathway, 'IT, computing, engineering, and hands-on lab pathways can be relevant.', ['Science', 'Computer Science', 'Information Technology', 'Any stream']),
      { personality: { structurePreference: 4, stabilityPreference: 4 }, values: { jobSecurity: 4 } },
    ),
    certifications: ['Security fundamentals credentials can structure early learning; check current issuer objectives and cost.'],
    courses: ['Networking fundamentals', 'Security operations lab practice', 'Incident-response case study'],
    relatedCareerIds: ['cloud-engineer', 'software-engineer', 'government-officer'],
  }),
  makeCareer({
    id: 'cloud-engineer',
    name: 'Cloud Engineer',
    category: 'Technology',
    shortDescription: 'Designs and maintains cloud infrastructure, automation, and reliable services.',
    overview: 'Cloud engineers work with computing platforms, networks, automation, security, and teams that run digital products.',
    whatYouDo: ['Configure cloud infrastructure and automate repeatable operations.', 'Improve reliability, access controls, monitoring, and cost-aware service design.'],
    whyChoose: ['A practical option for people who enjoy systems thinking and automation.', 'Can blend software, infrastructure, and security interests.'],
    education: 'IT, computing, engineering, and portfolio-based routes can be relevant; platform requirements vary by employer.',
    difficulty: 'Advanced',
    salaryRange: '₹6–16 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('cloud-platforms', 'Cloud platform foundations', 4),
      technical('infrastructure-as-code', 'Infrastructure automation', 4, 'technicalAptitude'),
      technical('networking-cloud', 'Cloud networking', 4, 'analyticalThinking'),
      technical('monitoring', 'Monitoring and reliability practices', 3, 'problemSolving'),
      soft('operations-collaboration', 'Operations collaboration', 3, 'communication'),
    ],
    fitProfile: technologyFit(
      academic(engineeringPathway, 'Computing, IT, engineering, and hands-on infrastructure learning can provide a base.', ['Science', 'Computer Science', 'Information Technology', 'Engineering']),
      { interests: { realistic: 4 }, personality: { structurePreference: 4 } },
    ),
    certifications: ['Cloud foundation credentials can support early learning; choose a provider aligned with your intended platform.'],
    courses: ['Linux and networking basics', 'Cloud foundations', 'Infrastructure automation project'],
    relatedCareerIds: ['software-engineer', 'cybersecurity-analyst', 'machine-learning-engineer'],
  }),
  makeCareer({
    id: 'business-analyst',
    name: 'Business Analyst',
    category: 'Management',
    shortDescription: 'Clarifies business needs and helps teams design better processes, products, or decisions.',
    overview: 'Business analysts bridge stakeholder needs, processes, data, and delivery teams through structured discovery and communication.',
    whatYouDo: ['Gather requirements and map current processes.', 'Use data and workshops to recommend clear, testable improvements.'],
    whyChoose: ['A useful path for learners who enjoy both people and analytical work.', 'Can be a bridge into product, operations, consulting, or data roles.'],
    education: 'Business, technology, commerce, engineering, and portfolio-based pathways can all be relevant.',
    difficulty: 'Intermediate',
    salaryRange: '₹5–12 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('requirements-analysis', 'Requirements analysis', 4, 'analyticalThinking'),
      technical('process-mapping', 'Process mapping', 4, 'organization'),
      technical('business-data', 'Business data analysis', 3, 'technicalAptitude'),
      technical('documentation', 'Clear documentation', 4, 'organization'),
      soft('stakeholder-management', 'Stakeholder communication', 5, 'communication'),
    ],
    fitProfile: managementFit(
      academic(schoolAndGraduate, 'Many educational backgrounds can lead here when paired with problem-solving and stakeholder evidence.', ['Commerce', 'Business', 'Engineering', 'Any stream']),
      { interests: { conventional: 4 }, workPreferences: { peopleSystems: 4, analyticalCreative: 2 } },
    ),
    courses: ['Business analysis basics', 'Process mapping', 'Requirements case study'],
    relatedCareerIds: ['data-analyst', 'product-manager', 'management-consultant'],
  }),
  makeCareer({
    id: 'product-manager',
    name: 'Product Manager',
    category: 'Management',
    shortDescription: 'Guides product decisions by balancing user needs, business goals, and delivery constraints.',
    overview: 'Product managers shape priorities, align teams, learn from users and data, and make trade-offs visible.',
    whatYouDo: ['Discover customer problems and define product priorities.', 'Coordinate design, engineering, business, and support partners around outcomes.'],
    whyChoose: ['May suit people who enjoy leadership, ambiguity, and cross-functional work.', 'Allows broad exposure to strategy, user research, delivery, and analytics.'],
    education: 'There is no single required degree; product experience, communication, and evidence of judgement are important.',
    difficulty: 'Advanced',
    salaryRange: '₹8–20 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('product-discovery', 'Product discovery', 4, 'research'),
      technical('prioritisation', 'Prioritisation frameworks', 4, 'analyticalThinking'),
      technical('product-metrics', 'Product metrics', 3, 'technicalAptitude'),
      technical('roadmapping', 'Roadmapping', 4, 'organization'),
      soft('product-leadership', 'Cross-functional leadership', 5, 'leadership'),
    ],
    fitProfile: managementFit(
      academic(schoolAndGraduate, 'Relevant routes include business, technology, design, engineering, or experience in adjacent roles.', ['Business', 'Engineering', 'Design', 'Any stream']),
      { personality: { riskTolerance: 4, leadership: 5 }, values: { growth: 5 }, workPreferences: { analyticalCreative: 3 } },
    ),
    courses: ['Product discovery', 'Metrics and prioritisation', 'Build a product case-study portfolio'],
    relatedCareerIds: ['business-analyst', 'ui-ux-designer', 'entrepreneur'],
  }),
  makeCareer({
    id: 'ui-ux-designer',
    name: 'UI/UX Designer',
    category: 'Design',
    shortDescription: 'Researches user needs and designs accessible, useful digital experiences.',
    overview: 'UI/UX design combines empathy, research, interaction design, visual communication, and iterative testing.',
    whatYouDo: ['Interview or observe users to understand needs and pain points.', 'Create flows, prototypes, and visual interfaces that teams can test and build.'],
    whyChoose: ['A strong exploratory option for creative, people-aware problem solvers.', 'Builds a tangible portfolio through prototypes and case studies.'],
    education: 'Design, psychology, technology, and self-directed portfolio routes can all be relevant.',
    difficulty: 'Intermediate',
    salaryRange: '₹4–12 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('user-research', 'User research', 4, 'research'),
      technical('wireframing', 'Wireframing and prototyping', 4, 'technicalAptitude'),
      technical('interaction-design', 'Interaction design', 4, 'creativity'),
      technical('visual-design', 'Visual design foundations', 4, 'creativity'),
      soft('design-facilitation', 'User and team communication', 4, 'communication'),
    ],
    fitProfile: designFit(
      academic(schoolAndGraduate, 'Design, humanities, psychology, technology, and portfolio-based pathways can be relevant.', ['Design', 'Arts', 'Psychology', 'Computer Science', 'Any stream']),
      { interests: { social: 4 }, workPreferences: { peopleSystems: 4, analyticalCreative: 5 } },
    ),
    courses: ['Design fundamentals', 'User research and usability testing', 'Portfolio case study'],
    relatedCareerIds: ['graphic-designer', 'product-manager', 'content-creator'],
  }),
  makeCareer({
    id: 'chartered-accountant',
    name: 'Chartered Accountant',
    category: 'Finance',
    shortDescription: 'Provides accounting, assurance, tax, and financial advisory expertise.',
    overview: 'Chartered accountancy can involve financial reporting, audit, taxation, compliance, advisory, and business decision support.',
    whatYouDo: ['Review financial information and support accurate reporting or assurance work.', 'Interpret rules and financial evidence for clients or organisations.'],
    whyChoose: ['May suit detail-oriented learners who enjoy finance, systems, and professional responsibility.', 'Can open several specialisations across practice, industry, and advisory work.'],
    education: 'Professional pathways, stages, training requirements, and eligibility rules should be verified from the relevant institute.',
    difficulty: 'Advanced',
    salaryRange: '₹6–15 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('financial-accounting', 'Financial accounting', 5, 'mathematics'),
      technical('audit', 'Audit and assurance basics', 4, 'analyticalThinking'),
      technical('tax', 'Tax and compliance awareness', 4, 'research'),
      technical('financial-reporting', 'Financial reporting', 4, 'organization'),
      soft('client-advisory', 'Client communication', 3, 'communication'),
    ],
    fitProfile: financeFit(
      academic(schoolAndGraduate, 'Commerce is a direct preparation route, though current professional entry rules should be checked independently.', ['Commerce', 'Mathematics', 'Business']),
      { values: { jobSecurity: 4, prestige: 5 }, personality: { structurePreference: 5 } },
    ),
    entranceExams: ['Verify current Chartered Accountancy entry, examination, and practical-training requirements with the relevant professional institute.'],
    certifications: ['Professional qualification milestones are governed by the relevant institute; verify the latest official route.'],
    courses: ['Accounting foundations', 'Financial reporting', 'Audit and taxation case practice'],
    relatedCareerIds: ['financial-analyst', 'banking-officer', 'management-consultant'],
  }),
  makeCareer({
    id: 'financial-analyst',
    name: 'Financial Analyst',
    category: 'Finance',
    shortDescription: 'Analyses financial information to support planning, investment, or business decisions.',
    overview: 'Financial analysts use accounting, modelling, research, and communication to interpret performance and possible scenarios.',
    whatYouDo: ['Build and review financial models, budgets, or forecasts.', 'Research business and market information, then communicate assumptions and findings.'],
    whyChoose: ['A possible fit for learners who enjoy numbers, commercial questions, and evidence-based decisions.', 'Can lead toward corporate finance, research, planning, or investment-related pathways.'],
    education: 'Finance, commerce, economics, mathematics, and business routes can be relevant; employers set their own criteria.',
    difficulty: 'Advanced',
    salaryRange: '₹5–14 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('financial-modelling', 'Financial modelling', 4, 'mathematics'),
      technical('financial-statements', 'Financial statement analysis', 4, 'analyticalThinking'),
      technical('market-research', 'Market and company research', 4, 'research'),
      technical('forecasting', 'Forecasting and scenario analysis', 4, 'problemSolving'),
      soft('finance-presentations', 'Financial communication', 3, 'communication'),
    ],
    fitProfile: financeFit(
      academic(higherEducation, 'Commerce, finance, economics, business, and quantitative study can be relevant.', ['Commerce', 'Economics', 'Mathematics', 'Business']),
      { interests: { investigative: 5 }, values: { intellectualChallenge: 4 } },
    ),
    courses: ['Accounting and finance foundations', 'Spreadsheet modelling', 'Company-analysis project'],
    relatedCareerIds: ['chartered-accountant', 'investment-banker', 'data-analyst'],
  }),
  makeCareer({
    id: 'investment-banker',
    name: 'Investment Banker',
    category: 'Finance',
    shortDescription: 'Advises organisations on complex financial transactions and capital-raising decisions.',
    overview: 'Investment banking work can involve valuation, financial analysis, transaction materials, client service, and demanding team delivery.',
    whatYouDo: ['Analyse companies, transactions, and financial scenarios.', 'Prepare detailed materials and coordinate with client and deal teams.'],
    whyChoose: ['Can interest highly analytical learners who enjoy commercial strategy and fast-paced team work.', 'Provides exposure to corporate finance and transaction processes.'],
    education: 'Competitive roles often have employer-specific academic and recruitment expectations; verify current opportunities directly.',
    difficulty: 'Advanced',
    salaryRange: '₹9–25 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('valuation', 'Valuation methods', 5, 'mathematics'),
      technical('deal-modelling', 'Transaction modelling', 5, 'analyticalThinking'),
      technical('financial-research', 'Financial research', 4, 'research'),
      technical('presentation-materials', 'Presentation materials', 4, 'organization'),
      soft('client-delivery', 'Client-facing communication', 4, 'communication'),
    ],
    fitProfile: financeFit(
      academic(higherEducation, 'Finance, economics, commerce, business, and quantitative pathways can be relevant; hiring criteria vary.', ['Commerce', 'Economics', 'Mathematics', 'Business']),
      { personality: { riskTolerance: 4, collaboration: 5 }, values: { salary: 5, prestige: 5, workLifeBalance: 1 }, workPreferences: { workLifePriority: 1 } },
    ),
    courses: ['Corporate finance', 'Valuation and modelling', 'Transaction case-study practice'],
    relatedCareerIds: ['financial-analyst', 'management-consultant', 'entrepreneur'],
    workLifeBalance: 'Can be demanding during transaction cycles; working patterns vary by team and employer.',
  }),
  makeCareer({
    id: 'civil-services-officer',
    name: 'Civil Services Officer',
    category: 'Government & Public Administration',
    shortDescription: 'Contributes to public administration, policy implementation, and citizen-facing governance.',
    overview: 'Civil-service roles vary widely by cadre and posting, but can involve administration, public programmes, policy, coordination, and field leadership.',
    whatYouDo: ['Help implement public programmes and coordinate stakeholders.', 'Analyse local needs, make administrative decisions, and communicate with citizens and institutions.'],
    whyChoose: ['May suit learners motivated by public impact, responsibility, and complex social problems.', 'Offers a broad path across administration and public-service domains.'],
    education: 'Eligibility and recruitment pathways must be checked in the current official examination notification.',
    difficulty: 'Advanced',
    salaryRange: 'Illustrative public-pay band varies by post and rules',
    demandLevel: 'Moderate',
    skills: [
      technical('public-policy', 'Public policy foundations', 4, 'research'),
      technical('governance-analysis', 'Governance analysis', 4, 'analyticalThinking'),
      technical('administrative-writing', 'Administrative writing', 4, 'organization'),
      technical('current-affairs-research', 'Evidence-based current affairs research', 4, 'research'),
      soft('public-leadership', 'Public leadership and communication', 5, 'leadership'),
    ],
    fitProfile: governmentFit(
      academic(higherEducation, 'Official eligibility, subjects, stages, and age criteria can change; verify the current notification.', ['Any stream']),
      { interests: { investigative: 4 }, skills: { analyticalThinking: 4, research: 5 }, values: { socialImpact: 5, jobSecurity: 5 } },
    ),
    entranceExams: ['Verify the current Union Public Service Commission Civil Services Examination notification and eligibility criteria before planning.'],
    courses: ['Indian governance and public policy foundations', 'Answer writing and evidence evaluation', 'Current-affairs source verification'],
    relatedCareerIds: ['government-officer', 'indian-police-service', 'lawyer'],
    remoteWorkPotential: 'Usually limited by public-facing and administrative responsibilities.',
    governmentOpportunities: 'This is a public-service pathway; recruitment follows current official notifications.',
  }),
  makeCareer({
    id: 'indian-police-service',
    name: 'Indian Police Service Officer',
    category: 'Government & Public Administration',
    shortDescription: 'Leads public-safety, law-enforcement, and administrative responsibilities within a public-service framework.',
    overview: 'Police-service roles can involve leadership, law and order, investigation oversight, community engagement, and emergency decision making.',
    whatYouDo: ['Coordinate teams and respond to public-safety priorities.', 'Apply legal and administrative processes while engaging with communities and agencies.'],
    whyChoose: ['May appeal to people motivated by public service, leadership, and high-responsibility field work.', 'Requires careful judgement, resilience, and a commitment to lawful, ethical practice.'],
    education: 'Official eligibility, physical standards, examination stages, and service rules must be verified in current notifications.',
    difficulty: 'Advanced',
    salaryRange: 'Illustrative public-pay band varies by post and rules',
    demandLevel: 'Moderate',
    skills: [
      technical('legal-procedure', 'Legal and procedural awareness', 4, 'research'),
      technical('incident-assessment', 'Incident assessment', 4, 'problemSolving'),
      technical('public-administration', 'Public administration', 4, 'organization'),
      technical('evidence-handling', 'Evidence-aware decision making', 4, 'analyticalThinking'),
      soft('field-leadership', 'Leadership under pressure', 5, 'leadership'),
    ],
    fitProfile: governmentFit(
      academic(higherEducation, 'Verify current official recruitment, physical, medical, and examination requirements before making decisions.', ['Any stream']),
      { interests: { realistic: 4, social: 5 }, personality: { riskTolerance: 5, leadership: 5 }, workPreferences: { peopleSystems: 5 } },
    ),
    entranceExams: ['Verify the current official Civil Services Examination and service-allocation requirements.'],
    courses: ['Public administration foundations', 'Law and ethical decision making', 'Leadership and community engagement'],
    relatedCareerIds: ['civil-services-officer', 'defence-officer', 'government-officer'],
    remoteWorkPotential: 'Usually limited by public-facing and field responsibilities.',
    governmentOpportunities: 'This is a public-service pathway governed by current official recruitment rules.',
  }),
  makeCareer({
    id: 'lawyer',
    name: 'Lawyer',
    category: 'Law',
    shortDescription: 'Researches legal questions, advises clients, and represents or supports them through legal processes.',
    overview: 'Legal work can span litigation, corporate advisory, policy, intellectual property, labour, technology, public interest, and more.',
    whatYouDo: ['Research legal issues and prepare clear written arguments or advice.', 'Communicate with clients, institutions, and legal professionals.'],
    whyChoose: ['May suit learners who enjoy evidence, language, advocacy, and structured argument.', 'Offers many specialist pathways across private and public contexts.'],
    education: 'Degree, licensing, court-practice, and admission requirements vary and should be checked with current official bodies.',
    difficulty: 'Advanced',
    salaryRange: '₹4–14 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('legal-research', 'Legal research', 5, 'research'),
      technical('legal-writing', 'Legal writing and drafting', 5, 'communication'),
      technical('case-analysis', 'Case analysis', 4, 'analyticalThinking'),
      technical('legal-procedure-law', 'Procedural awareness', 3, 'organization'),
      soft('advocacy', 'Advocacy and negotiation', 4, 'communication'),
    ],
    fitProfile: lawFit(
      academic(higherEducation, 'Law-school admissions and practice requirements should be checked with the current official institution or regulator.', ['Humanities', 'Commerce', 'Science', 'Any stream']),
      { values: { prestige: 4, socialImpact: 4 }, workPreferences: { peopleSystems: 4 } },
    ),
    entranceExams: ['Law admission tests and eligibility requirements differ by institution and year; verify current official information.'],
    courses: ['Legal reasoning and research', 'Writing and argumentation', 'Mooting or supervised legal case practice'],
    relatedCareerIds: ['civil-services-officer', 'psychologist', 'government-officer'],
  }),
  makeCareer({
    id: 'doctor',
    name: 'Doctor',
    category: 'Healthcare',
    shortDescription: 'Assesses health needs, provides clinical care, and works with patients and healthcare teams.',
    overview: 'Medical careers require rigorous scientific study, supervised clinical training, ethical judgement, and ongoing learning.',
    whatYouDo: ['Assess symptoms, interpret evidence, and discuss care options with patients.', 'Collaborate with healthcare teams while following clinical and ethical standards.'],
    whyChoose: ['May suit learners strongly motivated by health, science, and direct social impact.', 'Offers many areas of medical practice and research to explore over time.'],
    education: 'Medical admissions, licensing, training, and clinical requirements are regulated and must be verified with current official sources.',
    difficulty: 'Advanced',
    salaryRange: '₹6–18 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('medical-science', 'Medical science foundations', 5, 'research'),
      technical('clinical-reasoning', 'Clinical reasoning', 5, 'problemSolving'),
      technical('patient-assessment', 'Patient assessment', 4, 'analyticalThinking'),
      technical('clinical-documentation', 'Clinical documentation', 4, 'organization'),
      soft('patient-communication', 'Empathetic patient communication', 5, 'communication'),
    ],
    fitProfile: healthcareFit(
      academic(higherEducation, 'Medical admissions and licensing rules are regulated; verify the current official pathway and eligibility.', ['Science', 'Biology']),
      { skills: { research: 5, problemSolving: 5 }, personality: { stabilityPreference: 3 }, values: { socialImpact: 5, intellectualChallenge: 5 } },
    ),
    entranceExams: ['Medical entrance and eligibility requirements change; verify the current official notification and regulator guidance.'],
    courses: ['Biology and health-science foundations', 'Clinical reasoning case studies', 'Ethics and patient communication'],
    relatedCareerIds: ['pharmacist', 'nurse', 'psychologist'],
    remoteWorkPotential: 'Usually limited for direct clinical care, though some support functions may differ.',
  }),
  makeCareer({
    id: 'pharmacist',
    name: 'Pharmacist',
    category: 'Healthcare',
    shortDescription: 'Supports safe, informed use of medicines across community, hospital, industry, and research settings.',
    overview: 'Pharmacy work combines scientific knowledge, accuracy, patient communication, and regulated professional practice.',
    whatYouDo: ['Review medicine-related information and support safe dispensing or supply processes.', 'Communicate appropriately with patients and healthcare professionals.'],
    whyChoose: ['A possible fit for people interested in health science, precision, and service.', 'Can lead toward community, hospital, industry, research, or regulatory contexts.'],
    education: 'Professional education, registration, and practice requirements vary; verify current regulator and institution guidance.',
    difficulty: 'Advanced',
    salaryRange: '₹3–8 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('pharmacology', 'Pharmacology foundations', 4, 'research'),
      technical('medicine-safety', 'Medicine safety awareness', 5, 'organization'),
      technical('dispensing-processes', 'Dispensing processes', 4, 'technicalAptitude'),
      technical('clinical-information', 'Clinical information review', 3, 'analyticalThinking'),
      soft('medicine-counselling', 'Clear patient communication', 4, 'communication'),
    ],
    fitProfile: healthcareFit(
      academic(higherEducation, 'Pharmacy course and registration requirements should be confirmed through current official channels.', ['Science', 'Biology', 'Chemistry']),
      { interests: { conventional: 4 }, personality: { structurePreference: 5 } },
    ),
    entranceExams: ['Pharmacy admissions and registration requirements vary by institution and jurisdiction; verify official guidance.'],
    courses: ['Chemistry and biology foundations', 'Pharmacology basics', 'Medication-safety case practice'],
    relatedCareerIds: ['doctor', 'nurse', 'research-scientist'],
  }),
  makeCareer({
    id: 'mechanical-engineer',
    name: 'Mechanical Engineer',
    category: 'Engineering',
    shortDescription: 'Designs, analyses, tests, and improves mechanical systems and products.',
    overview: 'Mechanical engineering applies physics, maths, materials, design, manufacturing, and systems thinking to practical challenges.',
    whatYouDo: ['Design or analyse components, machines, products, or manufacturing processes.', 'Test ideas, interpret results, and collaborate with technical teams.'],
    whyChoose: ['May suit learners who enjoy physical systems, maths, and practical problem solving.', 'Provides routes into manufacturing, energy, automotive, robotics, and product development.'],
    education: 'Engineering degrees, diplomas, apprenticeships, and employer-specific pathways vary by role and location.',
    difficulty: 'Advanced',
    salaryRange: '₹4–10 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('engineering-mechanics', 'Engineering mechanics', 5, 'mathematics'),
      technical('cad', 'Computer-aided design', 4, 'technicalAptitude'),
      technical('materials', 'Materials and manufacturing basics', 4, 'research'),
      technical('testing', 'Testing and analysis', 4, 'problemSolving'),
      soft('engineering-teamwork', 'Engineering teamwork', 3, 'communication'),
    ],
    fitProfile: engineeringFit(
      academic(engineeringPathway, 'Science, maths, diploma, and engineering pathways can provide relevant preparation.', ['Science', 'Mathematics', 'Engineering']),
      { interests: { realistic: 5 }, workPreferences: { remoteWork: 2 } },
    ),
    courses: ['Mathematics and physics', 'CAD fundamentals', 'Build-and-test engineering project'],
    relatedCareerIds: ['civil-engineer', 'electrical-engineer', 'electronics-engineer'],
  }),
  makeCareer({
    id: 'civil-engineer',
    name: 'Civil Engineer',
    category: 'Engineering',
    shortDescription: 'Plans, designs, and helps deliver infrastructure and built-environment projects.',
    overview: 'Civil engineers work on structures, transport, water, construction, geotechnics, and project delivery under local standards and constraints.',
    whatYouDo: ['Analyse site, design, material, and safety considerations for infrastructure work.', 'Coordinate plans, contractors, clients, and technical documentation.'],
    whyChoose: ['Can suit people who want to see tangible projects take shape in the built environment.', 'Connects technical design with public infrastructure and project coordination.'],
    education: 'Engineering qualifications and project requirements vary by employer, regulator, and jurisdiction.',
    difficulty: 'Advanced',
    salaryRange: '₹4–10 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('structural-basics', 'Structural and materials basics', 5, 'mathematics'),
      technical('civil-cad', 'Civil design tools', 4, 'technicalAptitude'),
      technical('site-analysis', 'Site and project analysis', 4, 'problemSolving'),
      technical('technical-drawings', 'Technical drawings and specifications', 4, 'organization'),
      soft('project-coordination', 'Project coordination', 4, 'communication'),
    ],
    fitProfile: engineeringFit(
      academic(engineeringPathway, 'Science, maths, diploma, and civil-engineering routes can be relevant.', ['Science', 'Mathematics', 'Engineering']),
      { interests: { realistic: 5, social: 3 }, workPreferences: { remoteWork: 1 } },
    ),
    courses: ['Maths and mechanics', 'Civil design foundations', 'Infrastructure case study'],
    relatedCareerIds: ['mechanical-engineer', 'architect', 'government-officer'],
  }),
  makeCareer({
    id: 'electrical-engineer',
    name: 'Electrical Engineer',
    category: 'Engineering',
    shortDescription: 'Works with electrical systems, power, controls, and related equipment.',
    overview: 'Electrical engineering applies scientific and mathematical principles to power, control, communications, devices, and industrial systems.',
    whatYouDo: ['Design, test, or maintain electrical systems and components.', 'Analyse safety, reliability, and performance requirements with technical teams.'],
    whyChoose: ['May appeal to learners who enjoy physics, maths, and systems that power real-world infrastructure.', 'Can lead to roles across energy, automation, manufacturing, and technology.'],
    education: 'Relevant engineering and diploma pathways vary by employer and the responsibilities of the role.',
    difficulty: 'Advanced',
    salaryRange: '₹4–11 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('circuits', 'Circuit analysis', 5, 'mathematics'),
      technical('power-systems', 'Power and control systems', 4, 'technicalAptitude'),
      technical('electrical-testing', 'Electrical testing', 4, 'problemSolving'),
      technical('safety-standards', 'Safety-aware design', 4, 'organization'),
      soft('technical-reporting', 'Technical reporting', 3, 'communication'),
    ],
    fitProfile: engineeringFit(
      academic(engineeringPathway, 'Science, maths, electrical engineering, and diploma pathways can be relevant.', ['Science', 'Mathematics', 'Engineering']),
      { interests: { realistic: 4 }, skills: { mathematics: 5 } },
    ),
    courses: ['Circuit theory', 'Electrical machines and controls', 'Design-and-test project'],
    relatedCareerIds: ['electronics-engineer', 'mechanical-engineer', 'cloud-engineer'],
  }),
  makeCareer({
    id: 'electronics-engineer',
    name: 'Electronics Engineer',
    category: 'Engineering',
    shortDescription: 'Designs and tests electronic devices, embedded systems, and communications components.',
    overview: 'Electronics engineering combines circuit design, hardware, programming, testing, and systems integration.',
    whatYouDo: ['Design or test circuits, devices, sensors, or embedded systems.', 'Troubleshoot technical issues and document reliable design choices.'],
    whyChoose: ['A possible fit for learners who enjoy devices, coding, and hands-on technical experimentation.', 'Can connect hardware interests with robotics, communication, consumer products, and industrial systems.'],
    education: 'Engineering, diploma, and lab-based technical pathways vary by role and employer.',
    difficulty: 'Advanced',
    salaryRange: '₹4–11 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('electronics-circuits', 'Electronic circuit design', 5, 'mathematics'),
      technical('embedded-systems', 'Embedded systems basics', 4, 'technicalAptitude'),
      technical('hardware-testing', 'Hardware testing', 4, 'problemSolving'),
      technical('signal-basics', 'Signals and communication basics', 4, 'analyticalThinking'),
      soft('design-documentation', 'Design documentation', 3, 'organization'),
    ],
    fitProfile: engineeringFit(
      academic(engineeringPathway, 'Science, maths, electronics, and diploma pathways can offer relevant preparation.', ['Science', 'Mathematics', 'Engineering']),
      { interests: { realistic: 4 }, skills: { technicalAptitude: 5 } },
    ),
    courses: ['Electronics fundamentals', 'Microcontrollers and embedded programming', 'Hardware prototype project'],
    relatedCareerIds: ['electrical-engineer', 'mechanical-engineer', 'software-engineer'],
  }),
  makeCareer({
    id: 'teacher',
    name: 'Teacher',
    category: 'Education',
    shortDescription: 'Designs learning experiences and helps students develop knowledge, confidence, and skills.',
    overview: 'Teaching combines subject expertise, communication, planning, assessment, inclusion, and responsive support for learners.',
    whatYouDo: ['Plan and deliver lessons adapted to learner needs.', 'Assess progress, provide feedback, and collaborate with families or colleagues where relevant.'],
    whyChoose: ['May suit people motivated by direct social impact and ongoing interaction with learners.', 'Allows a focus on subjects, age groups, learning support, or educational innovation.'],
    education: 'Teaching qualifications, registrations, and school requirements vary by institution, level, and jurisdiction.',
    difficulty: 'Intermediate',
    salaryRange: '₹3–8 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('lesson-design', 'Lesson design', 4, 'organization'),
      technical('assessment', 'Assessment and feedback', 4, 'analyticalThinking'),
      technical('subject-mastery', 'Subject knowledge', 4, 'research'),
      technical('learning-tools', 'Learning tools and resources', 3, 'technicalAptitude'),
      soft('teaching-communication', 'Clear, supportive communication', 5, 'communication'),
    ],
    fitProfile: educationFit(
      academic(schoolAndGraduate, 'Subject study and teaching qualifications vary by level and institution; verify current requirements.', ['Any stream']),
      { interests: { artistic: 4 }, personality: { creativityPreference: 4 } },
    ),
    entranceExams: ['Teaching eligibility and recruitment requirements vary by institution and jurisdiction; verify official information.'],
    courses: ['Learning science foundations', 'Inclusive lesson planning', 'Supervised teaching or tutoring experience'],
    relatedCareerIds: ['professor', 'psychologist', 'government-officer'],
    remoteWorkPotential: 'Some online or hybrid teaching exists, but availability depends on the institution and subject.',
  }),
  makeCareer({
    id: 'professor',
    name: 'Professor',
    category: 'Education',
    shortDescription: 'Teaches advanced learners and may contribute to research, scholarship, and academic service.',
    overview: 'Academic careers usually combine deep subject expertise, teaching, research, writing, supervision, and institution-specific responsibilities.',
    whatYouDo: ['Teach, assess, and mentor students in a specialist subject.', 'Conduct, publish, or support scholarly research depending on the institution and role.'],
    whyChoose: ['May fit learners who want to combine research with education and mentorship.', 'Offers deep long-term engagement with a chosen field of study.'],
    education: 'Academic qualifications, research expectations, and appointment criteria vary by field, institution, and country.',
    difficulty: 'Advanced',
    salaryRange: '₹5–14 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('academic-research', 'Academic research', 5, 'research'),
      technical('curriculum-design', 'Curriculum design', 4, 'organization'),
      technical('scholarly-writing', 'Scholarly writing', 5, 'communication'),
      technical('assessment-design', 'Assessment design', 4, 'analyticalThinking'),
      soft('student-mentoring', 'Student mentoring', 5, 'communication'),
    ],
    fitProfile: educationFit(
      academic(higherEducation, 'Advanced study, research output, and appointment requirements vary by subject and institution.', ['Any stream']),
      { interests: { investigative: 5 }, skills: { research: 5 }, values: { intellectualChallenge: 5 } },
    ),
    courses: ['Research methods', 'Teaching and learning practice', 'Academic writing and supervised research'],
    relatedCareerIds: ['teacher', 'research-scientist', 'psychologist'],
  }),
  makeCareer({
    id: 'research-scientist',
    name: 'Research Scientist',
    category: 'Research',
    shortDescription: 'Designs investigations that expand knowledge or solve specialised scientific and technical problems.',
    overview: 'Research scientists formulate questions, review evidence, plan studies, analyse results, and communicate uncertainty responsibly.',
    whatYouDo: ['Design and carry out studies, experiments, or analyses.', 'Interpret results carefully, document methods, and communicate findings.'],
    whyChoose: ['Potentially suitable for deeply curious learners who enjoy evidence, uncertainty, and sustained inquiry.', 'Offers specialisation across science, technology, health, environment, and many other domains.'],
    education: 'Research roles can have varying study and experience expectations, especially for independent or advanced positions.',
    difficulty: 'Advanced',
    salaryRange: '₹5–13 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('research-design', 'Research design', 5, 'research'),
      technical('data-interpretation', 'Data interpretation', 5, 'analyticalThinking'),
      technical('experimental-methods', 'Experimental or field methods', 4, 'problemSolving'),
      technical('scientific-writing', 'Scientific writing', 4, 'communication'),
      soft('research-collaboration', 'Research collaboration', 3, 'communication'),
    ],
    fitProfile: researchFit(
      academic(higherEducation, 'Required qualifications depend on the discipline, research setting, and degree of independence expected.', ['Science', 'Mathematics', 'Engineering', 'Any stream']),
      { interests: { investigative: 5 }, personality: { independence: 5 }, values: { intellectualChallenge: 5 } },
    ),
    courses: ['Research methods', 'Statistics or domain analysis', 'Documented research project'],
    relatedCareerIds: ['data-scientist', 'professor', 'doctor'],
  }),
  makeCareer({
    id: 'entrepreneur',
    name: 'Entrepreneur',
    category: 'Entrepreneurship',
    shortDescription: 'Builds or grows an initiative by identifying needs, testing ideas, and mobilising resources.',
    overview: 'Entrepreneurship can involve customer discovery, product or service design, finances, operations, leadership, and learning from uncertainty.',
    whatYouDo: ['Identify a problem worth solving and test assumptions with potential users.', 'Coordinate product, sales, finance, operations, and people decisions as the venture evolves.'],
    whyChoose: ['May suit people who value autonomy, initiative, variety, and learning through action.', 'Can be pursued alongside study or work through small, evidence-based experiments.'],
    education: 'There is no single required credential; legal, financial, and sector-specific obligations should be verified for each venture.',
    difficulty: 'Advanced',
    salaryRange: 'Highly variable; illustrative only',
    demandLevel: 'Emerging',
    skills: [
      technical('customer-discovery', 'Customer discovery', 4, 'research'),
      technical('business-models', 'Business-model thinking', 4, 'analyticalThinking'),
      technical('venture-finance', 'Basic venture finance', 3, 'mathematics'),
      technical('experimentation', 'Rapid experimentation', 4, 'problemSolving'),
      soft('venture-leadership', 'Leadership and persuasion', 5, 'leadership'),
    ],
    fitProfile: entrepreneurshipFit(
      academic(schoolAndGraduate, 'Any educational background can be relevant; sector-specific rules and support programmes vary.', ['Any stream']),
      { values: { independence: 5 }, personality: { riskTolerance: 5 }, workPreferences: { stabilityFlexibility: 5 } },
    ),
    courses: ['Customer discovery', 'Business-model experimentation', 'Small venture or community project'],
    relatedCareerIds: ['product-manager', 'digital-marketer', 'management-consultant'],
    workLifeBalance: 'Can be highly variable and may be demanding during early stages of a venture.',
  }),
  makeCareer({
    id: 'digital-marketer',
    name: 'Digital Marketer',
    category: 'Media',
    shortDescription: 'Plans and evaluates digital communication that helps organisations reach relevant audiences.',
    overview: 'Digital marketing blends customer understanding, content, channels, campaign operations, experimentation, and analytics.',
    whatYouDo: ['Plan content or campaigns for defined audiences and goals.', 'Track results, learn from data, and improve communication across channels.'],
    whyChoose: ['Can suit learners who enjoy creativity, communication, and measurable experimentation.', 'Offers paths in content, performance, brand, community, and growth work.'],
    education: 'Marketing, business, communications, design, and portfolio-based routes can be relevant; tools change frequently.',
    difficulty: 'Intermediate',
    salaryRange: '₹3–9 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('campaign-planning', 'Campaign planning', 4, 'organization'),
      technical('marketing-analytics', 'Marketing analytics', 3, 'analyticalThinking'),
      technical('content-strategy', 'Content strategy', 4, 'creativity'),
      technical('channel-tools', 'Digital channel tools', 3, 'technicalAptitude'),
      soft('audience-communication', 'Audience-focused communication', 5, 'communication'),
    ],
    fitProfile: mediaFit(
      academic(schoolAndGraduate, 'Business, communications, design, and self-directed portfolio pathways can be relevant.', ['Business', 'Commerce', 'Arts', 'Any stream']),
      { interests: { conventional: 3 }, workPreferences: { analyticalCreative: 4 } },
    ),
    certifications: ['Platform-specific credentials can be useful but should be selected based on current role goals and verified content.'],
    courses: ['Marketing fundamentals', 'Analytics and experimentation', 'Campaign portfolio project'],
    relatedCareerIds: ['content-creator', 'business-analyst', 'entrepreneur'],
  }),
  makeCareer({
    id: 'content-creator',
    name: 'Content Creator',
    category: 'Media',
    shortDescription: 'Creates useful, entertaining, or educational content for a defined audience and platform.',
    overview: 'Content creation can involve research, storytelling, production, community interaction, editing, and sustainable audience strategy.',
    whatYouDo: ['Research topics and develop content in written, visual, audio, or video formats.', 'Review audience feedback and improve a consistent creative process.'],
    whyChoose: ['May appeal to people who enjoy storytelling, expression, and independently building a body of work.', 'Can combine creative interests with education, marketing, community, or entrepreneurship.'],
    education: 'No single credential is required, though platform rules, contracts, taxes, and sector-specific responsibilities should be checked.',
    difficulty: 'Intermediate',
    salaryRange: 'Highly variable; illustrative only',
    demandLevel: 'Emerging',
    skills: [
      technical('storytelling', 'Storytelling and scripting', 5, 'creativity'),
      technical('content-production', 'Content production', 4, 'technicalAptitude'),
      technical('audience-research', 'Audience research', 3, 'research'),
      technical('editing', 'Editing workflow', 4, 'organization'),
      soft('community-voice', 'Authentic audience communication', 5, 'communication'),
    ],
    fitProfile: mediaFit(
      academic(schoolAndGraduate, 'Any background can be relevant; develop a sustainable portfolio and verify platform or business obligations.', ['Any stream']),
      { personality: { independence: 5, riskTolerance: 4 }, values: { independence: 5 }, workPreferences: { stabilityFlexibility: 5 } },
    ),
    courses: ['Storytelling and audience research', 'Production and editing practice', 'Publish a small, responsible content series'],
    relatedCareerIds: ['digital-marketer', 'graphic-designer', 'entrepreneur'],
    workLifeBalance: 'Varies with workload, audience goals, and whether creation is independent or part of an organisation.',
  }),
  makeCareer({
    id: 'architect',
    name: 'Architect',
    category: 'Design',
    shortDescription: 'Designs buildings and spaces by balancing human needs, aesthetics, safety, and technical constraints.',
    overview: 'Architecture combines spatial design, visual communication, materials, regulations, collaboration, and iterative project delivery.',
    whatYouDo: ['Develop concepts, drawings, and models for built spaces.', 'Coordinate with clients, engineers, consultants, and approval processes.'],
    whyChoose: ['May suit people who enjoy design, practical constraints, and shaping physical environments.', 'Brings together creative thinking with technical and collaborative project work.'],
    education: 'Architecture education, registration, and practice requirements are regulated in many contexts; verify current official guidance.',
    difficulty: 'Advanced',
    salaryRange: '₹4–10 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('spatial-design', 'Spatial design', 5, 'creativity'),
      technical('architectural-drawing', 'Architectural drawing and modelling', 4, 'technicalAptitude'),
      technical('building-systems', 'Building systems awareness', 3, 'analyticalThinking'),
      technical('design-documentation', 'Design documentation', 4, 'organization'),
      soft('client-design-dialogue', 'Client and consultant communication', 4, 'communication'),
    ],
    fitProfile: designFit(
      academic(higherEducation, 'Architecture programmes and professional registration requirements should be verified with current official sources.', ['Science', 'Mathematics', 'Arts', 'Design']),
      { interests: { realistic: 4 }, skills: { mathematics: 3 }, workPreferences: { remoteWork: 2 } },
    ),
    entranceExams: ['Architecture admissions and registration requirements vary by institution and year; verify current official information.'],
    courses: ['Design and drawing foundations', 'Spatial modelling', 'Built-environment portfolio project'],
    relatedCareerIds: ['civil-engineer', 'ui-ux-designer', 'graphic-designer'],
  }),
  makeCareer({
    id: 'psychologist',
    name: 'Psychologist',
    category: 'Healthcare',
    shortDescription: 'Uses evidence-based psychological knowledge to understand behaviour, wellbeing, learning, or organisations.',
    overview: 'Psychology has research, education, organisational, counselling, and clinical-adjacent pathways with differing qualification and practice requirements.',
    whatYouDo: ['Use ethical, evidence-based methods to understand behaviour and support appropriate interventions or research.', 'Communicate carefully with individuals, teams, or communities within the scope of training.'],
    whyChoose: ['May suit people who are curious about behaviour and motivated by careful, people-centred work.', 'Offers several specialisations across research, education, work, and wellbeing contexts.'],
    education: 'Protected titles, clinical practice, and registration requirements vary substantially; verify current official rules before planning practice.',
    difficulty: 'Advanced',
    salaryRange: '₹4–11 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('psychology-research', 'Psychology research methods', 4, 'research'),
      technical('behaviour-analysis', 'Behavioural analysis', 4, 'analyticalThinking'),
      technical('ethical-practice', 'Ethical practice awareness', 5, 'organization'),
      technical('assessment-awareness', 'Assessment awareness', 3, 'technicalAptitude'),
      soft('active-listening', 'Active listening and empathy', 5, 'communication'),
    ],
    fitProfile: healthcareFit(
      academic(higherEducation, 'Study and regulated-practice requirements depend on the specific psychology pathway and location.', ['Humanities', 'Science', 'Psychology', 'Any stream']),
      { interests: { investigative: 4, social: 5 }, values: { socialImpact: 5 }, workPreferences: { peopleSystems: 5 } },
    ),
    entranceExams: ['Psychology course, registration, and practice requirements vary by institution and jurisdiction; verify official guidance.'],
    courses: ['Psychology foundations', 'Research methods and ethics', 'Supervised, scope-appropriate experience'],
    relatedCareerIds: ['teacher', 'doctor', 'research-scientist'],
  }),
  makeCareer({
    id: 'government-officer',
    name: 'Government Officer',
    category: 'Government & Public Administration',
    shortDescription: 'Supports public administration, operations, citizen services, and programme delivery.',
    overview: 'Government roles vary by department and recruitment channel, but can involve records, policy support, public interaction, operations, and compliance.',
    whatYouDo: ['Support administrative processes, records, service delivery, or programme operations.', 'Communicate with citizens, teams, and institutions while following current procedures.'],
    whyChoose: ['Can fit people who value public service, structure, and stable administrative work.', 'Offers varied functions across departments and levels of government.'],
    education: 'Recruitment, examinations, age limits, and eligibility vary by department and current official notification.',
    difficulty: 'Intermediate',
    salaryRange: 'Illustrative public-pay band varies by post and rules',
    demandLevel: 'Moderate',
    skills: [
      technical('administration', 'Administrative processes', 4, 'organization'),
      technical('public-records', 'Records and documentation', 4, 'organization'),
      technical('policy-awareness', 'Policy and procedure awareness', 3, 'research'),
      technical('service-analysis', 'Service problem analysis', 3, 'analyticalThinking'),
      soft('citizen-communication', 'Citizen-facing communication', 4, 'communication'),
    ],
    fitProfile: governmentFit(
      academic(schoolAndGraduate, 'Official qualifications and selection requirements vary by post and notification.', ['Any stream']),
      { personality: { leadership: 3, structurePreference: 5 }, values: { jobSecurity: 5 }, workPreferences: { peopleSystems: 4 } },
    ),
    entranceExams: ['Verify current SSC, State PSC, banking, departmental, or other official recruitment notices relevant to the target post.'],
    courses: ['Public administration basics', 'Office and records workflows', 'Current-affairs source evaluation'],
    relatedCareerIds: ['civil-services-officer', 'banking-officer', 'teacher'],
    remoteWorkPotential: 'Often depends on department policy and the public-facing nature of the role.',
    governmentOpportunities: 'This is a public-sector pathway governed by current official recruitment notices.',
  }),
  makeCareer({
    id: 'nurse',
    name: 'Nurse',
    category: 'Healthcare',
    shortDescription: 'Provides patient-centred care, health education, and coordinated support within healthcare teams.',
    overview: 'Nursing combines clinical knowledge, observation, communication, teamwork, empathy, and safe practice in varied care settings.',
    whatYouDo: ['Provide and document care within professional scope and care plans.', 'Communicate with patients, families, and multidisciplinary healthcare teams.'],
    whyChoose: ['May suit people motivated by direct service, teamwork, and practical health care.', 'Offers specialisations across community, hospital, critical, mental-health, and education contexts.'],
    education: 'Nursing education, registration, and scope-of-practice requirements vary and must be verified through current official sources.',
    difficulty: 'Advanced',
    salaryRange: '₹3–8 LPA',
    demandLevel: 'Strong',
    skills: [
      technical('patient-care', 'Patient-care foundations', 5, 'problemSolving'),
      technical('clinical-observation', 'Clinical observation', 4, 'analyticalThinking'),
      technical('care-documentation', 'Care documentation', 4, 'organization'),
      technical('health-education', 'Health education', 3, 'research'),
      soft('compassionate-care', 'Compassionate communication', 5, 'communication'),
    ],
    fitProfile: healthcareFit(
      academic(higherEducation, 'Nursing education, registration, and employer requirements should be verified through official channels.', ['Science', 'Biology']),
      { interests: { social: 5, realistic: 4 }, personality: { collaboration: 5 }, values: { socialImpact: 5 } },
    ),
    entranceExams: ['Nursing admissions, registration, and recruitment requirements vary by institution and jurisdiction; verify official information.'],
    courses: ['Health-science foundations', 'Patient safety and communication', 'Supervised clinical learning'],
    relatedCareerIds: ['doctor', 'pharmacist', 'psychologist'],
    remoteWorkPotential: 'Usually limited for direct patient-care roles.',
  }),
  makeCareer({
    id: 'graphic-designer',
    name: 'Graphic Designer',
    category: 'Design',
    shortDescription: 'Creates visual communication that helps audiences understand, remember, or act on information.',
    overview: 'Graphic design combines visual hierarchy, typography, brand thinking, digital tools, feedback, and a portfolio of finished work.',
    whatYouDo: ['Develop visual concepts for print, digital, brand, or campaign needs.', 'Iterate designs based on audience, accessibility, and stakeholder feedback.'],
    whyChoose: ['May fit visually creative learners who enjoy making abstract ideas clear and memorable.', 'Allows portfolio-building across many industries and independent or team-based work.'],
    education: 'Design degrees, short courses, apprenticeships, and portfolio routes can all be relevant depending on the role.',
    difficulty: 'Intermediate',
    salaryRange: '₹3–9 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('visual-hierarchy', 'Visual hierarchy and typography', 5, 'creativity'),
      technical('design-tools', 'Design-tool workflow', 4, 'technicalAptitude'),
      technical('brand-systems', 'Brand systems', 3, 'organization'),
      technical('accessible-design', 'Accessible visual communication', 3, 'problemSolving'),
      soft('design-feedback', 'Receiving and explaining design feedback', 4, 'communication'),
    ],
    fitProfile: designFit(
      academic(schoolAndGraduate, 'Design, arts, communications, and self-directed portfolio routes can be relevant.', ['Arts', 'Design', 'Any stream']),
      { interests: { artistic: 5 }, workPreferences: { peopleSystems: 3, analyticalCreative: 5 } },
    ),
    courses: ['Visual design fundamentals', 'Typography and layout', 'Curated portfolio project'],
    relatedCareerIds: ['ui-ux-designer', 'content-creator', 'digital-marketer'],
  }),
  makeCareer({
    id: 'defence-officer',
    name: 'Defence Officer',
    category: 'Government & Public Administration',
    shortDescription: 'Leads teams and supports national defence responsibilities within a disciplined public-service context.',
    overview: 'Defence careers can involve leadership, training, operations, technology, logistics, and public responsibility under strict standards and current service rules.',
    whatYouDo: ['Lead, train, and coordinate teams in assigned operational or support contexts.', 'Apply disciplined planning, communication, and ethical judgement under demanding conditions.'],
    whyChoose: ['May appeal to people motivated by service, teamwork, leadership, and structured challenge.', 'Offers a broad set of technical, operational, and administrative specialisations.'],
    education: 'Selection, medical, physical, age, education, and training standards are official and can change; verify current notifications.',
    difficulty: 'Advanced',
    salaryRange: 'Illustrative public-pay band varies by service, rank, and rules',
    demandLevel: 'Moderate',
    skills: [
      technical('operational-planning', 'Operational planning', 4, 'organization'),
      technical('situational-assessment', 'Situational assessment', 4, 'problemSolving'),
      technical('service-procedures', 'Service procedures', 4, 'research'),
      technical('team-readiness', 'Team-readiness practices', 4, 'technicalAptitude'),
      soft('defence-leadership', 'Leadership and teamwork', 5, 'leadership'),
    ],
    fitProfile: governmentFit(
      academic(higherEducation, 'Official defence recruitment pathways and standards vary by service and notification; verify current information.', ['Any stream']),
      { interests: { realistic: 5, social: 4 }, personality: { riskTolerance: 5, leadership: 5, collaboration: 5 }, workPreferences: { peopleSystems: 4 } },
    ),
    entranceExams: ['Verify current official defence recruitment, examination, medical, and physical-standard information before planning.'],
    courses: ['Leadership and team coordination', 'Physical readiness appropriate to your situation', 'Current-affairs and service-pathway research'],
    relatedCareerIds: ['indian-police-service', 'civil-services-officer', 'government-officer'],
    remoteWorkPotential: 'Usually limited by service and operational responsibilities.',
    governmentOpportunities: 'This is a public-service pathway governed by current official recruitment rules.',
  }),
  makeCareer({
    id: 'banking-officer',
    name: 'Banking Officer',
    category: 'Finance',
    shortDescription: 'Supports banking operations, customer service, risk-aware decisions, and financial products.',
    overview: 'Banking roles vary across retail, operations, credit, risk, relationship management, and public or private institutions.',
    whatYouDo: ['Support customer, credit, operational, or service processes with attention to policy.', 'Analyse financial information and communicate options responsibly.'],
    whyChoose: ['Can suit learners who like organised financial work, service, and clear processes.', 'Offers public- and private-sector pathways with varied specialisations.'],
    education: 'Recruitment exams, qualification requirements, and role expectations differ across institutions and current notifications.',
    difficulty: 'Intermediate',
    salaryRange: '₹4–10 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('banking-operations', 'Banking operations', 4, 'organization'),
      technical('financial-literacy', 'Financial literacy', 4, 'mathematics'),
      technical('risk-awareness', 'Risk and compliance awareness', 4, 'analyticalThinking'),
      technical('customer-processes', 'Customer-service processes', 3, 'technicalAptitude'),
      soft('customer-trust', 'Trust-building communication', 4, 'communication'),
    ],
    fitProfile: financeFit(
      academic(schoolAndGraduate, 'Commerce, business, finance, and many other backgrounds may be considered depending on the role and notification.', ['Commerce', 'Business', 'Mathematics', 'Any stream']),
      { values: { jobSecurity: 5 }, personality: { structurePreference: 5 }, workPreferences: { peopleSystems: 4, sectorPreference: 3 } },
    ),
    entranceExams: ['For public-sector roles, verify current official banking recruitment notifications; private-sector criteria vary by employer.'],
    courses: ['Banking and financial-services basics', 'Customer and compliance scenarios', 'Numerical and reasoning practice'],
    relatedCareerIds: ['chartered-accountant', 'financial-analyst', 'government-officer'],
  }),
  makeCareer({
    id: 'management-consultant',
    name: 'Management Consultant',
    category: 'Management',
    shortDescription: 'Helps organisations structure problems, assess options, and support change or improvement.',
    overview: 'Consulting can involve research, analysis, workshops, project delivery, presentations, and learning rapidly across industries.',
    whatYouDo: ['Break a client problem into researchable questions and analyse evidence.', 'Communicate recommendations and help teams turn decisions into practical actions.'],
    whyChoose: ['May suit adaptable learners who enjoy variety, structured thinking, and working with different people.', 'Offers exposure to strategy, operations, technology, and organisational change.'],
    education: 'Recruitment expectations vary significantly by firm, role level, and location; evidence of analysis and communication matters.',
    difficulty: 'Advanced',
    salaryRange: '₹7–18 LPA',
    demandLevel: 'Moderate',
    skills: [
      technical('problem-structuring', 'Problem structuring', 5, 'analyticalThinking'),
      technical('consulting-research', 'Research and synthesis', 4, 'research'),
      technical('business-modelling', 'Business modelling', 4, 'mathematics'),
      technical('presentation-design', 'Presentation design', 4, 'organization'),
      soft('client-facilitation', 'Client facilitation', 5, 'communication'),
    ],
    fitProfile: managementFit(
      academic(higherEducation, 'Business, engineering, economics, and many other backgrounds can be relevant depending on the firm and role.', ['Business', 'Engineering', 'Economics', 'Any stream']),
      { interests: { investigative: 5 }, skills: { analyticalThinking: 5 }, personality: { collaboration: 5, riskTolerance: 4 } },
    ),
    courses: ['Structured problem solving', 'Research and synthesis', 'Consulting-style case project'],
    relatedCareerIds: ['business-analyst', 'product-manager', 'investment-banker'],
    workLifeBalance: 'Can vary by project, client expectations, and travel requirements.',
  }),
];

export const CAREER_CATEGORIES: readonly { id: CareerCategory; description: string }[] = [
  { id: 'Technology', description: 'Software, cloud, security, and digital systems.' },
  { id: 'Data & AI', description: 'Data analysis, data science, and machine learning.' },
  { id: 'Engineering', description: 'Design and delivery of physical and technical systems.' },
  { id: 'Healthcare', description: 'Health science, care, wellbeing, and regulated practice.' },
  { id: 'Finance', description: 'Accounting, financial analysis, banking, and advisory.' },
  { id: 'Management', description: 'Products, operations, analysis, and organisational improvement.' },
  { id: 'Government & Public Administration', description: 'Public service, administration, and community-facing leadership.' },
  { id: 'Law', description: 'Legal research, advocacy, and advisory pathways.' },
  { id: 'Design', description: 'Visual, spatial, and user-centred problem solving.' },
  { id: 'Media', description: 'Content, audiences, campaigns, and creative communication.' },
  { id: 'Education', description: 'Teaching, mentoring, and academic development.' },
  { id: 'Research', description: 'Evidence-led inquiry and specialised investigation.' },
  { id: 'Entrepreneurship', description: 'Building initiatives, ventures, and new solutions.' },
];

export const CAREERS_BY_ID: Readonly<Record<string, Career>> = Object.fromEntries(
  CAREERS.map((career) => [career.id, career]),
);

export const getCareerById = (id: string): Career | undefined => CAREERS_BY_ID[id];
