import { z } from "zod";

/**
 * Request validation lives at the API boundary.  The schemas intentionally
 * strip no information silently: unknown object keys are rejected so callers
 * have a small, auditable contract to maintain.
 */

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;
const IDENTIFIER_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const emptyStringToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const stringToNumber = (value: unknown): unknown => {
  if (typeof value === "string" && value.trim() !== "") {
    return Number(value);
  }

  return value;
};

const stringToBoolean = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true") {
    return true;
  }
  if (normalized === "false") {
    return false;
  }

  return value;
};

const hasNoControlCharacters = (value: string): boolean =>
  !CONTROL_CHARACTERS.test(value);

const cleanText = (minimum: number, maximum: number) =>
  z
    .string()
    .trim()
    .min(minimum)
    .max(maximum)
    .refine(hasNoControlCharacters, "Text contains unsupported control characters.");

const optionalText = (maximum: number) =>
  z.preprocess(
    emptyStringToUndefined,
    z
      .string()
      .trim()
      .max(maximum)
      .refine(hasNoControlCharacters, "Text contains unsupported control characters.")
      .optional(),
  );

const optionalNumber = (minimum: number, maximum: number) =>
  z.preprocess(
    (value) => stringToNumber(emptyStringToUndefined(value)),
    z.number().finite().min(minimum).max(maximum).optional(),
  );

const optionalInteger = (minimum: number, maximum: number) =>
  z.preprocess(
    (value) => stringToNumber(emptyStringToUndefined(value)),
    z.number().finite().int().min(minimum).max(maximum).optional(),
  );

const optionalBoolean = z.preprocess(
  (value) => stringToBoolean(emptyStringToUndefined(value)),
  z.boolean().optional(),
);

const timestampSchema = z
  .string()
  .trim()
  .max(64)
  .refine((value) => !Number.isNaN(Date.parse(value)), "Expected a valid date-time string.");

const optionalTimestampSchema = z.preprocess(
  emptyStringToUndefined,
  timestampSchema.optional(),
);

const normalizedTagSchema = cleanText(1, 60).transform((value) => value.replace(/\s+/g, " "));
const uniqueStringArray = (maximum: number, minimum = 0) =>
  z
    .array(normalizedTagSchema)
    .min(minimum)
    .max(maximum)
    .refine(
      (values) =>
        new Set(values.map((value) => value.toLocaleLowerCase())).size === values.length,
      "Values must not contain duplicates.",
    );

const hasAtLeastOneKey = (value: Record<string, unknown>): boolean =>
  Object.keys(value).some((key) => value[key] !== undefined);

export const identifierSchema = z
  .string()
  .trim()
  .min(1)
  .max(128)
  .regex(IDENTIFIER_PATTERN, "Identifier may contain only letters, numbers, underscores, and hyphens.");

export const emailSchema = z
  .string()
  .trim()
  .max(254)
  .email("Enter a valid email address.")
  .transform((value) => value.toLocaleLowerCase());

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters long.")
  .max(128, "Password must be at most 128 characters long.")
  .refine((value) => /[A-Za-z]/.test(value), "Password must include a letter.")
  .refine((value) => /\d/.test(value), "Password must include a number.");

export const educationLevelSchema = z.enum([
  "CLASS_10",
  "CLASS_11",
  "CLASS_12",
  "DIPLOMA",
  "UNDERGRADUATE",
  "GRADUATE",
  "POSTGRADUATE",
  "CAREER_SWITCHER",
  "OTHER",
]);

export const streamSchema = z.enum([
  "SCIENCE",
  "COMMERCE",
  "ARTS",
  "HUMANITIES",
  "VOCATIONAL",
  "OTHER",
]);

export const roleSchema = z.enum(["STUDENT", "ADMIN"]);

export const registrationSchema = z
  .object({
    name: cleanText(2, 100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
    educationLevel: educationLevelSchema,
  })
  .strict()
  .superRefine(({ password, confirmPassword }, context) => {
    if (password !== confirmPassword) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export const registerSchema = registrationSchema;

export const loginSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(1, "Password is required.").max(128),
  })
  .strict();

const educationFields = {
  currentEducationLevel: educationLevelSchema,
  stream: z.preprocess(emptyStringToUndefined, streamSchema.optional()),
  degree: optionalText(120),
  branch: optionalText(120),
  institution: optionalText(160),
  cgpa: optionalNumber(0, 10),
  percentage: optionalNumber(0, 100),
  graduationYear: optionalInteger(1950, 2100),
};

const educationBaseSchema = z.object(educationFields).strict();

export const educationSchema = educationBaseSchema.superRefine((education, context) => {
  if (education.cgpa !== undefined && education.percentage !== undefined) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["percentage"],
      message: "Provide either CGPA or percentage, not both.",
    });
  }
});

export const educationUpdateSchema = educationBaseSchema
  .partial()
  .refine(hasAtLeastOneKey, "Provide at least one education field.");

export const peopleSystemsPreferenceSchema = z.enum(["PEOPLE", "SYSTEMS", "BALANCED"]);
export const analyticalCreativePreferenceSchema = z.enum([
  "ANALYTICAL",
  "CREATIVE",
  "BALANCED",
]);
export const stabilityFlexibilityPreferenceSchema = z.enum([
  "STABILITY",
  "FLEXIBILITY",
  "BALANCED",
]);
export const sectorPreferenceSchema = z.enum(["GOVERNMENT", "PRIVATE", "EITHER"]);
export const workModePreferenceSchema = z.enum(["ON_SITE", "HYBRID", "REMOTE", "FLEXIBLE"]);

const workPreferenceFields = {
  peopleOrSystems: z.preprocess(emptyStringToUndefined, peopleSystemsPreferenceSchema.optional()),
  analyticalOrCreative: z.preprocess(
    emptyStringToUndefined,
    analyticalCreativePreferenceSchema.optional(),
  ),
  stabilityOrFlexibility: z.preprocess(
    emptyStringToUndefined,
    stabilityFlexibilityPreferenceSchema.optional(),
  ),
  enjoysLeadership: optionalBoolean,
  sectorPreference: z.preprocess(emptyStringToUndefined, sectorPreferenceSchema.optional()),
  workModePreference: z.preprocess(emptyStringToUndefined, workModePreferenceSchema.optional()),
  salaryImportance: optionalInteger(1, 5),
  workLifeBalanceImportance: optionalInteger(1, 5),
  socialImpactImportance: optionalInteger(1, 5),
  growthImportance: optionalInteger(1, 5),
};

const workPreferencesBaseSchema = z.object(workPreferenceFields).strict();

export const workPreferencesSchema = workPreferencesBaseSchema.refine(
  hasAtLeastOneKey,
  "Provide at least one work preference.",
);

export const profileUpdateSchema = z
  .object({
    name: z.preprocess(emptyStringToUndefined, cleanText(2, 100).optional()),
    age: optionalInteger(13, 100),
    location: optionalText(120),
    preferredLanguage: optionalText(50),
    education: educationUpdateSchema.optional(),
    interests: uniqueStringArray(25).optional(),
    skills: uniqueStringArray(40).optional(),
    goals: uniqueStringArray(12).optional(),
    workPreferences: workPreferencesSchema.optional(),
  })
  .strict()
  .refine(hasAtLeastOneKey, "Provide at least one profile field.");

export const onboardingSchema = z
  .object({
    name: cleanText(2, 100),
    age: optionalInteger(13, 100),
    location: optionalText(120),
    preferredLanguage: optionalText(50),
    education: educationSchema,
    interests: uniqueStringArray(25, 1),
    skills: uniqueStringArray(40).optional(),
    goals: uniqueStringArray(12).optional(),
    workPreferences: workPreferencesSchema,
  })
  .strict();

export const profileSchema = profileUpdateSchema;
export const onboardingProfileSchema = onboardingSchema;

export const assessmentDimensionSchema = z.enum([
  "REALISTIC",
  "INVESTIGATIVE",
  "ARTISTIC",
  "SOCIAL",
  "ENTERPRISING",
  "CONVENTIONAL",
  "ANALYTICAL_THINKING",
  "MATHEMATICS",
  "COMMUNICATION",
  "LEADERSHIP",
  "CREATIVITY",
  "PROBLEM_SOLVING",
  "RESEARCH",
  "ORGANIZATION",
  "TECHNICAL_APTITUDE",
  "RISK_TOLERANCE",
  "COLLABORATION",
  "INDEPENDENCE",
  "STRUCTURE_PREFERENCE",
  "STABILITY_PREFERENCE",
  "SALARY",
  "JOB_SECURITY",
  "SOCIAL_IMPACT",
  "PRESTIGE",
  "WORK_LIFE_BALANCE",
  "GROWTH",
  "INTELLECTUAL_CHALLENGE",
]);

const assessmentRatingSchema = z.preprocess(
  stringToNumber,
  z
    .number({ invalid_type_error: "Answer value must be a number from 1 to 5." })
    .finite()
    .int()
    .min(1)
    .max(5),
);

export const assessmentAnswerSchema = z
  .object({
    questionId: identifierSchema,
    value: assessmentRatingSchema,
    dimension: z.preprocess(emptyStringToUndefined, assessmentDimensionSchema.optional()),
  })
  .strict();

const assessmentSubmissionBaseSchema = z
  .object({
    assessmentId: z.preprocess(emptyStringToUndefined, identifierSchema.optional()),
    answers: z.array(assessmentAnswerSchema).min(1).max(50),
    startedAt: optionalTimestampSchema,
    submittedAt: optionalTimestampSchema,
  })
  .strict();

export const assessmentSubmissionSchema = assessmentSubmissionBaseSchema.superRefine(
  (submission, context) => {
    const seenQuestionIds = new Set<string>();

    submission.answers.forEach((answer, index) => {
      if (seenQuestionIds.has(answer.questionId)) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["answers", index, "questionId"],
          message: "Each assessment question may be answered only once.",
        });
      }
      seenQuestionIds.add(answer.questionId);
    });

    if (
      submission.startedAt !== undefined &&
      submission.submittedAt !== undefined &&
      Date.parse(submission.submittedAt) < Date.parse(submission.startedAt)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["submittedAt"],
        message: "Submission time cannot be earlier than start time.",
      });
    }
  },
);

export const assessmentAnswersSchema = z
  .object({ answers: z.array(assessmentAnswerSchema).min(1).max(50) })
  .strict();

export const assessmentSubmitSchema = assessmentSubmissionSchema;

export const careerCategorySchema = z.enum([
  "TECHNOLOGY",
  "DATA_AI",
  "ENGINEERING",
  "HEALTHCARE",
  "FINANCE",
  "MANAGEMENT",
  "GOVERNMENT_PUBLIC_ADMINISTRATION",
  "LAW",
  "DESIGN",
  "MEDIA",
  "EDUCATION",
  "RESEARCH",
  "ENTREPRENEURSHIP",
]);

export const demandLevelSchema = z.enum(["LOW", "MODERATE", "HIGH"]);
export const difficultyLevelSchema = z.enum(["BEGINNER", "MODERATE", "ADVANCED"]);
export const potentialLevelSchema = z.enum(["LOW", "MODERATE", "HIGH"]);

const salaryAmountSchema = z.preprocess(
  (value) => stringToNumber(emptyStringToUndefined(value)),
  z.number().finite().min(0).max(100_000_000).optional(),
);

const careerFields = {
  name: cleanText(2, 120),
  slug: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().max(140).regex(SLUG_PATTERN, "Slug must use lowercase words separated by hyphens.").optional(),
  ),
  category: careerCategorySchema,
  shortDescription: optionalText(280),
  overview: cleanText(20, 8_000),
  whatProfessionalsDo: optionalText(8_000),
  whyChoose: optionalText(4_000),
  requiredEducation: uniqueStringArray(20, 1),
  requiredSkills: uniqueStringArray(40).optional(),
  technicalSkills: uniqueStringArray(40).optional(),
  softSkills: uniqueStringArray(30).optional(),
  entranceExams: uniqueStringArray(20).optional(),
  certifications: uniqueStringArray(30).optional(),
  recommendedCourses: uniqueStringArray(30).optional(),
  relatedCareerIds: z.array(identifierSchema).max(12).optional(),
  salaryMin: salaryAmountSchema,
  salaryMax: salaryAmountSchema,
  salaryCurrency: z.preprocess(emptyStringToUndefined, z.enum(["INR", "USD", "OTHER"]).optional()),
  salaryNote: optionalText(300),
  demandLevel: demandLevelSchema.optional(),
  difficultyLevel: difficultyLevelSchema.optional(),
  workLifeBalance: potentialLevelSchema.optional(),
  growthPotential: potentialLevelSchema.optional(),
  remoteWorkPotential: potentialLevelSchema.optional(),
  governmentOpportunities: optionalBoolean,
  isPublished: optionalBoolean,
};

const careerCreateBaseSchema = z.object(careerFields).strict();

const validateSalaryRange = (career: unknown, context: z.RefinementCtx): void => {
  if (typeof career !== "object" || career === null) {
    return;
  }

  const { salaryMin, salaryMax } = career as {
    salaryMin?: unknown;
    salaryMax?: unknown;
  };

  if (
    typeof salaryMin === "number" &&
    typeof salaryMax === "number" &&
    salaryMin > salaryMax
  ) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["salaryMax"],
      message: "Maximum salary must be greater than or equal to minimum salary.",
    });
  }
};

export const careerCreateSchema = careerCreateBaseSchema.superRefine(validateSalaryRange);

export const careerUpdateSchema = careerCreateBaseSchema
  .partial()
  .refine(hasAtLeastOneKey, "Provide at least one career field.")
  .superRefine(validateSalaryRange);

export const createCareerSchema = careerCreateSchema;
export const updateCareerSchema = careerUpdateSchema;

export const careerIdParamSchema = z.object({ id: identifierSchema }).strict();

export const roadmapProgressSchema = z
  .object({
    careerId: identifierSchema,
    roadmapItemId: identifierSchema,
    completed: z.preprocess(stringToBoolean, z.boolean()),
    notes: optionalText(1_000),
    completedAt: optionalTimestampSchema,
  })
  .strict()
  .superRefine((progress, context) => {
    if (progress.completed === false && progress.completedAt !== undefined) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["completedAt"],
        message: "A completion time may only be supplied for completed roadmap items.",
      });
    }
  });

export const roadmapProgressUpdateSchema = roadmapProgressSchema;

export const counsellorRequestSchema = z
  .object({
    conversationId: z.preprocess(emptyStringToUndefined, identifierSchema.optional()),
    message: cleanText(1, 2_000),
    careerIds: z.array(identifierSchema).max(3).optional(),
    activeCareerId: z.preprocess(emptyStringToUndefined, identifierSchema.optional()),
  })
  .strict()
  .superRefine((request, context) => {
    if (
      request.activeCareerId !== undefined &&
      request.careerIds !== undefined &&
      !request.careerIds.includes(request.activeCareerId)
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["activeCareerId"],
        message: "Active career must be one of the selected careers.",
      });
    }
  });

export const counsellorChatSchema = counsellorRequestSchema;
export const aiCounsellorRequestSchema = counsellorRequestSchema;

const pageSchema = z.preprocess(
  (value) => stringToNumber(emptyStringToUndefined(value)),
  z.number().finite().int().min(1).max(100_000).default(1),
);

const limitSchema = z.preprocess(
  (value) => stringToNumber(emptyStringToUndefined(value)),
  z.number().finite().int().min(1).max(50).default(12),
);

const optionalCareerCategorySchema = z.preprocess(
  emptyStringToUndefined,
  careerCategorySchema.optional(),
);

const optionalDemandLevelSchema = z.preprocess(emptyStringToUndefined, demandLevelSchema.optional());
const optionalDifficultyLevelSchema = z.preprocess(emptyStringToUndefined, difficultyLevelSchema.optional());

const queryStringListSchema = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const values = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    return values.length === 0 ? undefined : values;
  },
  uniqueStringArray(10).optional(),
);

export const paginationQuerySchema = z
  .object({
    page: pageSchema,
    limit: limitSchema,
  })
  .strict();

export const careerQuerySchema = z
  .object({
    page: pageSchema,
    limit: limitSchema,
    search: z.preprocess(emptyStringToUndefined, cleanText(1, 100).optional()),
    category: optionalCareerCategorySchema,
    demandLevel: optionalDemandLevelSchema,
    difficultyLevel: optionalDifficultyLevelSchema,
    educationLevel: z.preprocess(emptyStringToUndefined, educationLevelSchema.optional()),
    skills: queryStringListSchema,
    sortBy: z.preprocess(
      (value) => (typeof value === "string" ? value.trim() : value),
      z
        .enum(["name", "createdAt", "updatedAt", "demandLevel", "difficultyLevel"])
        .default("name"),
    ),
    sortOrder: z.preprocess(
      (value) => (typeof value === "string" ? value.trim().toUpperCase() : value),
      z.enum(["ASC", "DESC"]).default("ASC"),
    ),
  })
  .strict();

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
export type AssessmentAnswerInput = z.infer<typeof assessmentAnswerSchema>;
export type AssessmentSubmissionInput = z.infer<typeof assessmentSubmissionSchema>;
export type CareerCreateInput = z.infer<typeof careerCreateSchema>;
export type CareerUpdateInput = z.infer<typeof careerUpdateSchema>;
export type RoadmapProgressInput = z.infer<typeof roadmapProgressSchema>;
export type CounsellorRequestInput = z.infer<typeof counsellorRequestSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type CareerQuery = z.infer<typeof careerQuerySchema>;
