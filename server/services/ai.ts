/**
 * An intentionally provider-neutral contract for career counselling.  A
 * production provider can implement this interface without changing route or
 * controller code; this mock has no network or environment-variable
 * dependency, so local development remains useful without an API key.
 */

export type CounsellorRole = "user" | "assistant";

export interface CounsellorHistoryMessage {
  role: CounsellorRole;
  content: string;
}

export interface GuidanceCareerRecommendation {
  careerId: string;
  careerName: string;
  matchScore?: number;
  reasons?: readonly string[];
  skillGaps?: readonly string[];
}

export interface CareerGuidanceProfile {
  name?: string;
  educationLevel?: string;
  stream?: string;
  interests?: readonly string[];
  skills?: readonly string[];
  goals?: readonly string[];
  recommendations?: readonly GuidanceCareerRecommendation[];
}

export interface CounsellorChatRequest {
  message: string;
  profile?: CareerGuidanceProfile;
  selectedCareerIds?: readonly string[];
  activeCareerId?: string;
  history?: readonly CounsellorHistoryMessage[];
}

export interface CounsellorChatResponse {
  message: string;
  suggestedActions: string[];
  suggestedCareerIds: string[];
  followUpQuestions: string[];
  disclaimer: string;
}

/**
 * Implement this interface with an external LLM adapter when one is enabled.
 * The application only needs to depend on this small request/response shape.
 */
export interface AIService {
  chat(request: CounsellorChatRequest): Promise<CounsellorChatResponse>;
}

export type CareerGuidanceRequest = CounsellorChatRequest;
export type CareerGuidanceResponse = CounsellorChatResponse;

const MAX_VISIBLE_ITEMS = 3;
const MAX_NAME_LENGTH = 80;

const list = (items: readonly string[], maximum = MAX_VISIBLE_ITEMS): string => {
  const visibleItems = items.filter(Boolean).slice(0, maximum);

  if (visibleItems.length === 0) {
    return "";
  }
  if (visibleItems.length === 1) {
    return visibleItems[0] ?? "";
  }
  if (visibleItems.length === 2) {
    return `${visibleItems[0] ?? ""} and ${visibleItems[1] ?? ""}`;
  }

  return `${visibleItems.slice(0, -1).join(", ")}, and ${visibleItems[visibleItems.length - 1] ?? ""}`;
};

const normalized = (value: string | undefined): string =>
  (value ?? "").trim().toLocaleLowerCase();

const cleanDisplayText = (value: string, maximum: number): string =>
  value
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maximum);

const intentFor = (message: string): "compare" | "prepare" | "requirements" | "switch" | "choose" | "general" => {
  if (/(\bcompare\b|\bversus\b|\bvs\.?\b|\bdifference\b)/.test(message)) {
    return "compare";
  }
  if (/(\bprepare\b|\broadmap\b|\blearn\b|\bskills?\b|\bcourse\b|\bstudy\b)/.test(message)) {
    return "prepare";
  }
  if (/(\beligib|\badmission\b|\bexam\b|\bupsc\b|\brequirements?\b|\bqualification\b)/.test(message)) {
    return "requirements";
  }
  if (/(\bswitch\b|\btransition\b|\bchange careers?\b)/.test(message)) {
    return "switch";
  }
  if (/(\bbest\b|\bchoose\b|\bcareer for me\b|\bsuitable\b)/.test(message)) {
    return "choose";
  }

  return "general";
};

const rankRecommendations = (
  recommendations: readonly GuidanceCareerRecommendation[] | undefined,
  message: string,
  selectedCareerIds: readonly string[] | undefined,
  activeCareerId: string | undefined,
): GuidanceCareerRecommendation[] => {
  const selectedIds = new Set([...(selectedCareerIds ?? []), activeCareerId].filter(Boolean));
  const terms = new Set(
    message
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length > 2),
  );

  return [...(recommendations ?? [])]
    .map((recommendation, index) => {
      const searchable = normalized(
        [
          recommendation.careerName,
          ...(recommendation.reasons ?? []),
          ...(recommendation.skillGaps ?? []),
        ].join(" "),
      );
      const textRelevance = [...terms].filter((term) => searchable.includes(term)).length;
      const selectionBoost = selectedIds.has(recommendation.careerId) ? 10_000 : 0;
      const matchScore = Number.isFinite(recommendation.matchScore) ? recommendation.matchScore ?? 0 : 0;

      return { recommendation, index, score: selectionBoost + textRelevance * 100 + matchScore };
    })
    .sort((left, right) => right.score - left.score || left.index - right.index)
    .map(({ recommendation }) => recommendation);
};

const profileContext = (profile: CareerGuidanceProfile | undefined): string => {
  if (!profile) {
    return "Based on the information currently available";
  }

  const name = profile.name ? cleanDisplayText(profile.name, MAX_NAME_LENGTH) : "";
  const interests = (profile.interests ?? [])
    .map((interest) => cleanDisplayText(interest, 60))
    .filter(Boolean);
  const goals = (profile.goals ?? []).map((goal) => cleanDisplayText(goal, 100)).filter(Boolean);

  const subject = name ? `${name}, based on your responses` : "Based on your responses";
  const interestClause = interests.length > 0 ? ` and your interests in ${list(interests, 2)}` : "";
  const goalClause = goals.length > 0 ? `, especially your goal around ${goals[0] ?? "career exploration"}` : "";

  return `${subject}${interestClause}${goalClause}`;
};

const skillGapsFor = (recommendations: readonly GuidanceCareerRecommendation[]): string[] =>
  [...new Set(recommendations.flatMap((recommendation) => recommendation.skillGaps ?? []))]
    .map((gap) => cleanDisplayText(gap, 80))
    .filter(Boolean)
    .slice(0, MAX_VISIBLE_ITEMS);

/**
 * A repeatable local implementation used when no external provider is
 * configured.  It deliberately gives process-oriented guidance and never
 * invents salary, admission, job-market, or regulatory facts.
 */
export class DeterministicMockAIService implements AIService {
  async chat(request: CounsellorChatRequest): Promise<CounsellorChatResponse> {
    const message = normalized(request.message);
    const intent = intentFor(message);
    const recommendations = rankRecommendations(
      request.profile?.recommendations,
      message,
      request.selectedCareerIds,
      request.activeCareerId,
    ).slice(0, MAX_VISIBLE_ITEMS);
    const careerNames = recommendations.map((recommendation) => cleanDisplayText(recommendation.careerName, 100));
    const careerIds = recommendations.map((recommendation) => recommendation.careerId);
    const skillGaps = skillGapsFor(recommendations);
    const context = profileContext(request.profile);
    const careerSentence =
      careerNames.length > 0
        ? `, ${list(careerNames)} appear to be worthwhile options to explore further`
        : ", start by shortlisting two or three career directions that interest you";

    let guidance: string;
    switch (intent) {
      case "compare":
        guidance = `${context}${careerSentence}. Compare them using the day-to-day work, the skills you enjoy practicing, the entry path available to you, and the working style you prefer. A short introductory project or conversation with a practitioner can give more useful evidence than choosing from a title alone.`;
        break;
      case "prepare":
        guidance = `${context}${careerSentence}. Turn the next step into a small plan: learn one foundation, apply it in a beginner project, and reflect on whether you enjoy the work. ${skillGaps.length > 0 ? `Possible areas to investigate first are ${list(skillGaps)}.` : "Choose a foundation skill from the career's roadmap before committing to a long course."}`;
        break;
      case "requirements":
        guidance = `${context}${careerSentence}. Entry requirements, exams, and eligibility criteria can change by institution, employer, location, and year. Use the latest official notice or institution website to verify each requirement before making an application decision.`;
        break;
      case "switch":
        guidance = `${context}${careerSentence}. A career change can be explored in stages: identify transferable strengths, test one adjacent skill through a small project, then compare the learning investment with your goals. You do not need to treat an early experiment as a permanent commitment.`;
        break;
      case "choose":
        guidance = `${context}${careerSentence}. I would not label one path as definitely best for you. Treat the shortlist as hypotheses, then use hands-on exploration, your priorities, and practical constraints to decide which direction feels strongest.`;
        break;
      default:
        guidance = `${context}${careerSentence}. The most useful next move is to connect your interests, current strengths, and preferred work style to a concrete exploration task rather than relying on a broad career label alone.`;
    }

    const suggestedActions = [
      careerNames.length > 0
        ? `Review the day-to-day work and education path for ${careerNames[0] ?? "your top option"}.`
        : "Write down three career directions you would like to test.",
      skillGaps.length > 0
        ? `Try a small beginner project that practices ${skillGaps[0] ?? "one relevant skill"}.`
        : "Choose one low-risk activity to test a skill you are curious about.",
      "Discuss your shortlist with a qualified counsellor, mentor, or professional when the decision has high personal or financial stakes.",
    ];

    const followUpQuestions = [
      "Which part of a typical workday would you enjoy most?",
      "What learning time, budget, and location constraints should the plan respect?",
      careerNames.length > 1
        ? `Would you like to compare ${careerNames[0] ?? "the first option"} and ${careerNames[1] ?? "the second option"} by skills and work style?`
        : "Would you like help turning one career option into a short learning roadmap?",
    ];

    return {
      message: guidance,
      suggestedActions,
      suggestedCareerIds: careerIds,
      followUpQuestions,
      disclaimer:
        "This is educational career guidance based on the information you shared, not a guarantee of admission, employment, salary, or career outcomes. Verify current requirements and market information with official or primary sources.",
    };
  }

  async getCareerGuidance(request: CareerGuidanceRequest): Promise<CareerGuidanceResponse> {
    return this.chat(request);
  }
}

export const deterministicAIService: AIService = new DeterministicMockAIService();
export const mockAIService = deterministicAIService;
