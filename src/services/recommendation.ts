/**
 * Client-side career recommendation engine.
 *
 * Maps the client AssessmentProfile (1–5 Likert scale) and the client Career
 * type into CareerMatch results using the same weighted-dimension approach as
 * the server-side service. Scores are normalised to 0–100 internally.
 */

import type { AssessmentProfile, Career, CareerMatch, SkillGap } from '../types'

const DEFAULT_NEUTRAL = 50

function normalize1to5(value: number | undefined, fallback = DEFAULT_NEUTRAL): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback
  // 1–5 scale → 0–100
  return Math.round(((value - 1) / 4) * 100)
}

function clamp(v: number, min = 0, max = 100) {
  return Math.min(Math.max(v, min), max)
}

function formatLabel(key: string) {
  return key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

// ── Interest scoring ──────────────────────────────────────────────────────────

function scoreInterests(profile: AssessmentProfile, career: Career): number {
  const targets = career.fitProfile.interests
  const entries = Object.entries(targets)
  if (entries.length === 0) return DEFAULT_NEUTRAL

  let weightedSum = 0
  let totalWeight = 0
  for (const [dim, target] of entries) {
    const expected = normalize1to5(target as number)
    const actual = normalize1to5(profile.interests[dim])
    const score = 100 - Math.abs(expected - actual)
    const weight = Math.max(expected, 25)
    weightedSum += score * weight
    totalWeight += weight
  }
  return Math.round(weightedSum / totalWeight)
}

// ── Skill scoring ─────────────────────────────────────────────────────────────

function scoreSkillsDetailed(
  profile: AssessmentProfile,
  career: Career,
): { score: number; gaps: SkillGap[] } {
  const skills = career.skills
  if (skills.length === 0) return { score: DEFAULT_NEUTRAL, gaps: [] }

  const evaluations = skills.map((skill) => {
    const assessmentKey = skill.assessmentKey ?? skill.id
    const domain = skill.kind === 'technical' ? profile.skills : skill.kind === 'soft' ? profile.skills : profile.skills
    const rawUser = domain[assessmentKey] ?? profile.skills[assessmentKey] ?? undefined
    const currentLevel = normalize1to5(rawUser, 0)
    const targetLevel = normalize1to5(skill.requiredLevel)
    const fit = targetLevel > 0 ? Math.round(Math.min(currentLevel / targetLevel, 1) * 100) : 100
    const gap = targetLevel - currentLevel
    return { fit, skill, currentLevel, targetLevel, gap }
  })

  const score = Math.round(evaluations.reduce((s, e) => s + e.fit, 0) / evaluations.length)

  const gaps: SkillGap[] = evaluations
    .filter((e) => e.fit < 70)
    .sort((a, b) => a.fit - b.fit)
    .slice(0, 4)
    .map((e) => ({
      id: e.skill.id,
      name: e.skill.name,
      kind: e.skill.kind,
      currentLevel: e.currentLevel,
      requiredLevel: e.targetLevel,
      gap: Math.max(0, e.gap),
      description: e.skill.description ?? `Build ${e.skill.name} to be more competitive in this path.`,
    }))

  return { score, gaps }
}

// ── Personality scoring ───────────────────────────────────────────────────────

function scoreTargetMap(userMap: Record<string, number>, targets: Record<string, number>): number {
  const entries = Object.entries(targets)
  if (entries.length === 0) return DEFAULT_NEUTRAL

  let weightedSum = 0
  let totalWeight = 0
  for (const [dim, target] of entries) {
    const expected = normalize1to5(target as number)
    const actual = normalize1to5(userMap[dim])
    const score = 100 - Math.abs(expected - actual)
    const weight = Math.max(expected, 25)
    weightedSum += score * weight
    totalWeight += weight
  }
  return Math.round(weightedSum / totalWeight)
}

// ── Academic scoring ──────────────────────────────────────────────────────────

const EDUCATION_RANK: Record<string, number> = {
  'Class 10': 1,
  'Class 11': 2,
  'Class 12': 3,
  Diploma: 4,
  Undergraduate: 5,
  Graduate: 6,
  Postgraduate: 7,
  'Career switcher': 5,
}

function scoreAcademic(profile: AssessmentProfile, career: Career): number {
  const academicFit = career.fitProfile.academic
  const userLevel = profile.educationLevel ?? ''
  const userStream = (profile.stream ?? '').trim().toLowerCase()

  const levelScore = (() => {
    if (!academicFit.educationLevels?.length) return DEFAULT_NEUTRAL
    const fits = academicFit.educationLevels.some((level) => {
      const diff = (EDUCATION_RANK[userLevel] ?? 0) - (EDUCATION_RANK[level] ?? 99)
      return diff >= 0
    })
    if (fits) return 100
    const oneBelow = academicFit.educationLevels.some((level) => {
      const diff = (EDUCATION_RANK[userLevel] ?? 0) - (EDUCATION_RANK[level] ?? 99)
      return diff === -1
    })
    return oneBelow ? 60 : 30
  })()

  const streamScore = (() => {
    const preferred = (academicFit.preferredStreams ?? []).map((s) => s.toLowerCase())
    if (preferred.length === 0 || !userStream) return DEFAULT_NEUTRAL
    return preferred.some((s) => userStream.includes(s) || s.includes(userStream)) ? 100 : 55
  })()

  return Math.round((levelScore + streamScore) / 2)
}

// ── Reason / next-step generation ─────────────────────────────────────────────

function generateReasons(
  profile: AssessmentProfile,
  career: Career,
  scores: { interestScore: number; skillScore: number; personalityScore: number; academicScore: number; valueScore: number },
  gaps: SkillGap[],
): string[] {
  const reasons: string[] = []

  // Top interest dimensions
  for (const [dim, target] of Object.entries(career.fitProfile.interests)) {
    const expected = normalize1to5(target as number)
    const actual = normalize1to5(profile.interests[dim])
    if (Math.abs(expected - actual) < 25) {
      reasons.push(`Your ${formatLabel(dim).toLowerCase()} interest aligns well with this path.`)
      if (reasons.length >= 2) break
    }
  }

  // Personality
  for (const [dim, target] of Object.entries(career.fitProfile.personality)) {
    const expected = normalize1to5(target as number)
    const actual = normalize1to5(profile.personality[dim])
    if (Math.abs(expected - actual) < 20) {
      reasons.push(`Your ${formatLabel(dim).toLowerCase()} work style is compatible with this role.`)
      if (reasons.length >= 3) break
    }
  }

  if (scores.academicScore >= 75) reasons.push('Your current academic background is a suitable starting point.')
  if (gaps.length === 0) reasons.push('Your existing skills align closely with what this career requires.')

  return reasons.slice(0, 5)
}

function generateNextSteps(gaps: SkillGap[], academicScore: number): string[] {
  const steps: string[] = []
  for (const gap of gaps.slice(0, 3)) {
    steps.push(`Build ${gap.name} — currently at ${gap.currentLevel}/100 vs. the suggested ${gap.requiredLevel}/100 level.`)
  }
  if (academicScore < 65) {
    steps.push('Review the education pathway and entry requirements with current institution sources.')
  } else {
    steps.push('Try a small project or job-shadow experience to validate your interest in this path.')
  }
  steps.push('Use this result as a starting point, not a final verdict — compare with your lived interests and real opportunities.')
  return steps.slice(0, 5)
}

function generateStrengths(profile: AssessmentProfile, career: Career): string[] {
  const strengths: string[] = []
  for (const [dim, target] of Object.entries(career.fitProfile.interests)) {
    const expected = normalize1to5(target as number)
    const actual = normalize1to5(profile.interests[dim])
    if (actual >= expected - 15) strengths.push(`${formatLabel(dim)} interest`)
    if (strengths.length >= 2) break
  }
  for (const skill of career.skills) {
    const key = skill.assessmentKey ?? skill.id
    const current = normalize1to5(profile.skills[key], 0)
    const required = normalize1to5(skill.requiredLevel)
    if (current >= required * 0.8) strengths.push(skill.name)
    if (strengths.length >= 4) break
  }
  return [...new Set(strengths)].slice(0, 5)
}

// ── Main export ───────────────────────────────────────────────────────────────

const WEIGHTS = {
  interest: 0.3,
  skill: 0.25,
  personality: 0.15,
  academic: 0.15,
  value: 0.1,
  workPreference: 0.05,
}

export function calculateRecommendations(
  profile: AssessmentProfile,
  careers: readonly Career[],
): CareerMatch[] {
  return careers
    .map((career): CareerMatch => {
      const interestScore = scoreInterests(profile, career)
      const { score: skillScore, gaps: skillGaps } = scoreSkillsDetailed(profile, career)
      const personalityScore = scoreTargetMap(profile.personality, career.fitProfile.personality)
      const valueScore = scoreTargetMap(profile.values, career.fitProfile.values)
      const workPreferenceScore = scoreTargetMap(profile.workPreferences, career.fitProfile.workPreferences)
      const academicScore = scoreAcademic(profile, career)

      const overallScore = Math.round(
        clamp(
          interestScore * WEIGHTS.interest +
            skillScore * WEIGHTS.skill +
            personalityScore * WEIGHTS.personality +
            academicScore * WEIGHTS.academic +
            valueScore * WEIGHTS.value +
            workPreferenceScore * WEIGHTS.workPreference,
        ),
      )

      const reasons = generateReasons(profile, career, { interestScore, skillScore, personalityScore, academicScore, valueScore }, skillGaps)
      const strengths = generateStrengths(profile, career)
      const nextSteps = generateNextSteps(skillGaps, academicScore)

      return {
        career,
        careerId: career.id,
        overallScore,
        interestScore,
        skillScore,
        personalityScore,
        academicScore,
        valueScore,
        workPreferenceScore,
        reasons,
        strengths,
        skillGaps,
        nextSteps,
      }
    })
    .sort(
      (a, b) =>
        b.overallScore - a.overallScore ||
        b.interestScore - a.interestScore ||
        a.career.slug.localeCompare(b.career.slug),
    )
}
