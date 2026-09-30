import type { PrismaClient } from '@prisma/client'

interface CareerWithProfile {
  id: string
  name: string
  difficulty: string
  demandLevel: string
  fitProfile?: {
    interests: Record<string, number>
    skills: Record<string, number>
    personality: Record<string, number>
    values: Record<string, number>
    workPreferences: Record<string, number>
  } | null
}

interface ProfileSnapshot {
  interest?: Record<string, number>
  skill?: Record<string, number>
  personality?: Record<string, number>
  value?: Record<string, number>
  workPreference?: Record<string, number>
  academic?: Record<string, number>
}

const WEIGHTS = {
  interest: 0.30,
  skill: 0.25,
  personality: 0.15,
  academic: 0.10,
  value: 0.10,
  workPreference: 0.10,
}

function cosine(a: Record<string, number>, b: Record<string, number>): number {
  const keys = [...new Set([...Object.keys(a), ...Object.keys(b)])]
  if (keys.length === 0) return 0
  let dot = 0; let magA = 0; let magB = 0
  for (const k of keys) {
    const av = (a[k] ?? 0) / 100 * 5
    const bv = (b[k] ?? 0) / 5 * 5
    dot += av * bv
    magA += av * av
    magB += bv * bv
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  return denom === 0 ? 0 : Math.min(1, dot / denom)
}

function scoreCareer(profile: ProfileSnapshot, career: CareerWithProfile): {
  overall: number
  interest: number
  skill: number
  personality: number
  academic: number
  value: number
  workPreference: number
} {
  const fit = career.fitProfile
  if (!fit) return { overall: 50, interest: 50, skill: 50, personality: 50, academic: 50, value: 50, workPreference: 50 }

  const interest = Math.round(cosine(profile.interest ?? {}, fit.interests) * 100)
  const skill = Math.round(cosine(profile.skill ?? {}, fit.skills) * 100)
  const personality = Math.round(cosine(profile.personality ?? {}, fit.personality) * 100)
  const value = Math.round(cosine(profile.value ?? {}, fit.values) * 100)
  const workPreference = Math.round(cosine(profile.workPreference ?? {}, fit.workPreferences) * 100)
  const academic = 70 // default academic score — would use education data if available

  const overall = Math.round(
    interest * WEIGHTS.interest +
    skill * WEIGHTS.skill +
    personality * WEIGHTS.personality +
    academic * WEIGHTS.academic +
    value * WEIGHTS.value +
    workPreference * WEIGHTS.workPreference,
  )

  return { overall, interest, skill, personality, academic, value, workPreference }
}

function generateReasons(scores: ReturnType<typeof scoreCareer>, career: CareerWithProfile): string[] {
  const reasons: string[] = []
  if (scores.interest >= 70) reasons.push(`Your interests align strongly with ${career.name}`)
  if (scores.skill >= 70) reasons.push(`Your skill profile matches what ${career.name} professionals need`)
  if (scores.personality >= 70) reasons.push(`Your personality traits suit the working style of this field`)
  if (scores.value >= 70) reasons.push(`${career.name} aligns with your core values and motivations`)
  if (scores.workPreference >= 70) reasons.push(`Your work preferences match the typical environment in this career`)
  if (reasons.length === 0) reasons.push(`${career.name} has several dimensions that match your profile`)
  return reasons.slice(0, 4)
}

function generateStrengths(scores: ReturnType<typeof scoreCareer>): string[] {
  const dims = [
    { label: 'Interest alignment', v: scores.interest },
    { label: 'Skill match', v: scores.skill },
    { label: 'Personality fit', v: scores.personality },
    { label: 'Value alignment', v: scores.value },
    { label: 'Work preference match', v: scores.workPreference },
  ].filter((d) => d.v >= 65).sort((a, b) => b.v - a.v)
  return dims.map((d) => `${d.label} (${d.v}%)`)
}

function generateNextSteps(career: CareerWithProfile): string[] {
  return [
    `Explore the detailed career profile for ${career.name}`,
    `Review the step-by-step roadmap for this career path`,
    `Identify and begin closing your skill gaps`,
    `Connect with professionals in ${career.name} on LinkedIn`,
  ]
}

export async function calculateRecommendations(
  assessmentId: string,
  _userId: string,
  prisma: PrismaClient,
): Promise<void> {
  try {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      select: { profileSnapshot: true },
    })
    if (!assessment?.profileSnapshot) return

    const snapshot = assessment.profileSnapshot as ProfileSnapshot

    const careers = await prisma.career.findMany({
      where: { isActive: true },
      include: { fitProfile: true },
    })

    const scored = careers.map((career) => {
      const scores = scoreCareer(snapshot, career as unknown as CareerWithProfile)
      return { career, scores }
    }).sort((a, b) => b.scores.overall - a.scores.overall).slice(0, 20)

    // Delete existing recommendations for this assessment
    await prisma.recommendation.deleteMany({ where: { assessmentId } })

    // Create new recommendations
    for (const { career, scores } of scored) {
      await prisma.recommendation.create({
        data: {
          assessmentId,
          careerId: career.id,
          overallScore: scores.overall,
          interestScore: scores.interest,
          skillScore: scores.skill,
          personalityScore: scores.personality,
          academicScore: scores.academic,
          valueScore: scores.value,
          workPreferenceScore: scores.workPreference,
          reasons: generateReasons(scores, career as unknown as CareerWithProfile),
          strengths: generateStrengths(scores),
          skillGaps: [],
          nextSteps: generateNextSteps(career as unknown as CareerWithProfile),
        },
      })
    }
  } catch (err) {
    console.error('[Recommendations] Calculation failed:', err)
  }
}
