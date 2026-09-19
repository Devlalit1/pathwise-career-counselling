import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { CAREERS } from '../data/careers'
import { ASSESSMENT_QUESTIONS, buildAssessmentProfile, createEmptyAssessmentProfile } from '../data/questions'
import { calculateRecommendations } from '../services/recommendation'
import type { AssessmentAnswers, AssessmentProfile, CareerMatch, EducationLevel, UserRole } from '../types'

const STORAGE_KEY = 'pathwise-demo-state-v1'

export interface EducationInfo {
  level: EducationLevel
  stream: string
  degree: string
  branch: string
  grade: string
  graduationYear: string
}

export interface StudentProfile {
  age: string
  location: string
  language: string
  education: EducationInfo
  interests: string[]
  skills: Record<string, number>
  workPreferences: Record<string, number>
  goals: string[]
}

export interface AppUser {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface AssessmentRecord {
  id: string
  completedAt: string
  profile: AssessmentProfile
  recommendations: CareerMatch[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface Account extends AppUser {
  passwordHash: string
  onboardingComplete: boolean
  profile: StudentProfile
  answers: AssessmentAnswers
  assessmentProfile: AssessmentProfile | null
  recommendations: CareerMatch[]
  assessmentHistory: AssessmentRecord[]
  savedCareerIds: string[]
  primaryCareerId: string | null
  roadmapProgress: Record<string, boolean>
  messages: ChatMessage[]
}

interface StoredState {
  accounts: Account[]
  currentUserId: string | null
}

export interface AppContextValue {
  user: AppUser | null
  profile: StudentProfile | null
  isAuthenticated: boolean
  isOnboarded: boolean
  answers: AssessmentAnswers
  assessmentProfile: AssessmentProfile | null
  recommendations: CareerMatch[]
  assessmentHistory: AssessmentRecord[]
  savedCareerIds: string[]
  primaryCareerId: string | null
  roadmapProgress: Record<string, boolean>
  messages: ChatMessage[]
  register: (input: { name: string; email: string; password: string; educationLevel: EducationLevel }) => Promise<{ ok: boolean; message?: string }>
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>
  logout: () => void
  updateOnboarding: (profile: StudentProfile) => void
  updateProfile: (profile: Partial<StudentProfile>) => void
  saveAnswer: (questionId: string, value: number) => void
  submitAssessment: () => CareerMatch[]
  resetAssessment: () => void
  toggleSavedCareer: (careerId: string) => void
  setPrimaryCareer: (careerId: string) => void
  toggleRoadmapItem: (itemId: string) => void
  sendMessage: (message: string) => void
}

const AppContext = createContext<AppContextValue | null>(null)

const defaultEducation: EducationInfo = {
  level: 'Undergraduate',
  stream: 'Science',
  degree: 'B.Tech',
  branch: 'Computer Science',
  grade: '7.8 CGPA',
  graduationYear: '2027',
}

const demoProfile: StudentProfile = {
  age: '20',
  location: 'Pune, Maharashtra',
  language: 'English',
  education: defaultEducation,
  interests: ['Technology', 'Mathematics', 'Research', 'Business'],
  skills: {
    analyticalThinking: 4,
    mathematics: 4,
    communication: 3,
    leadership: 3,
    creativity: 3,
    problemSolving: 4,
    research: 4,
    organization: 3,
    technicalAptitude: 4,
  },
  workPreferences: {
    peopleSystems: 3,
    analyticalCreative: 2,
    stabilityFlexibility: 4,
    sectorPreference: 4,
    remoteWork: 4,
    workLifePriority: 4,
  },
  goals: ['Build a data portfolio', 'Find an internship', 'Explore product roles'],
}

const demoAnswers: AssessmentAnswers = Object.fromEntries(
  ASSESSMENT_QUESTIONS.map((question) => {
    const preferred: Record<string, number> = {
      realistic: 2,
      investigative: 5,
      artistic: 2,
      social: 3,
      enterprising: 3,
      conventional: 4,
      analyticalThinking: 4,
      mathematics: 4,
      communication: 3,
      leadership: 3,
      creativity: 3,
      problemSolving: 4,
      research: 4,
      organization: 3,
      technicalAptitude: 4,
      riskTolerance: 3,
      collaboration: 3,
      independence: 4,
      structurePreference: 3,
      creativityPreference: 3,
      stabilityPreference: 3,
      salary: 4,
      jobSecurity: 4,
      socialImpact: 3,
      prestige: 3,
      workLifeBalance: 4,
      growth: 5,
      intellectualChallenge: 5,
      peopleSystems: 3,
      analyticalCreative: 2,
      stabilityFlexibility: 4,
      sectorPreference: 4,
      remoteWork: 4,
      workLifePriority: 4,
    }
    return [question.id, preferred[question.dimension] ?? 3]
  }),
)

function createDemoAccount(): Account {
  const profile = buildAssessmentProfile(demoAnswers, {
    educationLevel: defaultEducation.level,
    stream: defaultEducation.stream,
  })
  const recommendations = calculateRecommendations(profile, CAREERS).slice(0, 5)
  const primaryCareerId = recommendations[0]?.careerId ?? CAREERS[0]?.id ?? null
  const primaryCareer = CAREERS.find((career) => career.id === primaryCareerId)
  const initialProgress = Object.fromEntries((primaryCareer?.roadmap ?? []).flatMap((phase, phaseIndex) =>
    phase.items.slice(0, phaseIndex === 0 ? 1 : 0).map((item) => [item.id, true]),
  )) as Record<string, boolean>

  return {
    id: 'demo-devendra',
    name: 'Devendra',
    email: 'demo@pathwise.in',
    role: 'STUDENT',
    createdAt: '2026-08-22T09:30:00.000Z',
    passwordHash: simpleHash('Pathwise123!'),
    onboardingComplete: true,
    profile: demoProfile,
    answers: demoAnswers,
    assessmentProfile: profile,
    recommendations,
    assessmentHistory: [{ id: 'assessment-demo-1', completedAt: '2026-08-30T11:30:00.000Z', profile, recommendations }],
    savedCareerIds: primaryCareerId ? [primaryCareerId, recommendations[1]?.careerId].filter((id): id is string => Boolean(id)) : [],
    primaryCareerId,
    roadmapProgress: initialProgress,
    messages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: "Hi Devendra — I can help you explore your recommendations, compare pathways, and turn your next step into a practical plan. What would you like to think through?",
        createdAt: '2026-08-30T11:35:00.000Z',
      },
    ],
  }
}

function simpleHash(value: string): string {
  let hash = 5381
  for (let index = 0; index < value.length; index += 1) hash = (hash * 33) ^ value.charCodeAt(index)
  return `demo-${(hash >>> 0).toString(36)}`
}

function freshProfile(level: EducationLevel): StudentProfile {
  return {
    age: '',
    location: '',
    language: 'English',
    education: { ...defaultEducation, level, stream: '', degree: '', branch: '', grade: '', graduationYear: '' },
    interests: [],
    skills: {},
    workPreferences: {},
    goals: [],
  }
}

function createAdminAccount(): Account {
  return {
    id: 'admin-pathwise',
    name: 'Admin',
    email: 'admin@pathwise.in',
    role: 'ADMIN',
    createdAt: '2026-01-01T00:00:00.000Z',
    passwordHash: simpleHash('Admin123!'),
    onboardingComplete: true,
    profile: freshProfile('Postgraduate'),
    answers: {},
    assessmentProfile: null,
    recommendations: [],
    assessmentHistory: [],
    savedCareerIds: [],
    primaryCareerId: null,
    roadmapProgress: {},
    messages: [],
  }
}

function loadState(): StoredState {
  if (typeof window === 'undefined') return { accounts: [createDemoAccount(), createAdminAccount()], currentUserId: null }
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored) as StoredState
      if (Array.isArray(parsed.accounts)) {
        // Ensure admin account is always present (for users with old cached state)
        const hasAdmin = parsed.accounts.some((a) => a.email === 'admin@pathwise.in')
        if (!hasAdmin) parsed.accounts.push(createAdminAccount())
        return parsed
      }
    }
  } catch {
    // A malformed demo cache should never stop someone from using the app.
  }
  return { accounts: [createDemoAccount(), createAdminAccount()], currentUserId: null }
}

function counsellorReply(account: Account, prompt: string): string {
  const primary = account.recommendations[0]
  const trimmed = prompt.toLowerCase()
  const leading = primary
    ? `${primary.career.name} is currently your strongest match (${primary.overallScore}%) based on your saved responses.`
    : 'I would start by completing the assessment so I can use your interests, strengths, and preferences.'

  if (trimmed.includes('compare') || trimmed.includes(' or ') || trimmed.includes('versus') || trimmed.includes('vs')) {
    const second = account.recommendations[1]
    return `${leading} A useful comparison is the day-to-day work: ${primary?.career.name ?? 'your first option'} leans on ${primary?.career.skills.slice(0, 2).map((skill) => skill.name).join(' and ') ?? 'your strengths'}, while ${second?.career.name ?? 'a second option'} may suit a different mix of interests. Choose by testing a small project in each area, then notice which work you want to continue when it becomes challenging. Requirements and outcomes vary by employer, institution, year, and location.`
  }
  if (trimmed.includes('skill') || trimmed.includes('learn') || trimmed.includes('prepare')) {
    const gaps = primary?.skillGaps.slice(0, 3).map((gap) => gap.name).join(', ')
    return `${leading} Your next practical focus could be ${gaps || 'one foundational skill and a small practice project'}. Set a two-week target, make one visible project, and reflect on whether you enjoy the work itself—not just the title. Courses and hiring expectations vary, so check current requirements before committing.`
  }
  if (trimmed.includes('best') || trimmed.includes('right')) {
    return `${leading} Treat that as a strong starting point, not a guaranteed answer. Your profile shows ${primary?.reasons.slice(0, 2).join(' and ') ?? 'several useful signals'}, so explore it through conversations, a mini-project, and current course requirements before making a high-stakes choice.`
  }
  return `${leading} Based on your profile, I would translate this question into one small experiment: identify the relevant skill, spend a few focused hours trying it, and note your energy, curiosity, and progress. I can help you turn that into a roadmap. Career requirements, salaries, and opportunities vary by institution, employer, year, and location.`
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadState)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Persistence is an enhancement in this demo, not a prerequisite.
    }
  }, [state])

  const account = useMemo(
    () => state.accounts.find((candidate) => candidate.id === state.currentUserId) ?? null,
    [state],
  )

  const updateCurrent = useCallback((updater: (current: Account) => Account) => {
    setState((previous) => {
      if (!previous.currentUserId) return previous
      return {
        ...previous,
        accounts: previous.accounts.map((candidate) => candidate.id === previous.currentUserId ? updater(candidate) : candidate),
      }
    })
  }, [])

  const register = useCallback(async (input: { name: string; email: string; password: string; educationLevel: EducationLevel }) => {
    const email = input.email.trim().toLowerCase()
    if (state.accounts.some((candidate) => candidate.email.toLowerCase() === email)) {
      return { ok: false, message: 'An account with this email already exists. Try signing in instead.' }
    }
    const created: Account = {
      id: `user-${Date.now()}`,
      name: input.name.trim(),
      email,
      role: 'STUDENT',
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash(input.password),
      onboardingComplete: false,
      profile: freshProfile(input.educationLevel),
      answers: {},
      assessmentProfile: null,
      recommendations: [],
      assessmentHistory: [],
      savedCareerIds: [],
      primaryCareerId: null,
      roadmapProgress: {},
      messages: [],
    }
    setState((previous) => ({ accounts: [...previous.accounts, created], currentUserId: created.id }))
    return { ok: true }
  }, [state.accounts])

  const login = useCallback(async (email: string, password: string) => {
    const candidate = state.accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase())
    if (!candidate || candidate.passwordHash !== simpleHash(password)) {
      return { ok: false, message: 'That email or password did not match an account.' }
    }
    setState((previous) => ({ ...previous, currentUserId: candidate.id }))
    return { ok: true }
  }, [state.accounts])

  const logout = useCallback(() => setState((previous) => ({ ...previous, currentUserId: null })), [])

  const updateOnboarding = useCallback((profile: StudentProfile) => {
    updateCurrent((current) => ({ ...current, profile, onboardingComplete: true }))
  }, [updateCurrent])

  const updateProfile = useCallback((profileUpdate: Partial<StudentProfile>) => {
    updateCurrent((current) => ({
      ...current,
      profile: { ...current.profile, ...profileUpdate, education: { ...current.profile.education, ...profileUpdate.education } },
    }))
  }, [updateCurrent])

  const saveAnswer = useCallback((questionId: string, value: number) => {
    updateCurrent((current) => ({ ...current, answers: { ...current.answers, [questionId]: value } }))
  }, [updateCurrent])

  const submitAssessment = useCallback(() => {
    if (!account) return []
    const profile = buildAssessmentProfile(account.answers, {
      educationLevel: account.profile.education.level,
      stream: account.profile.education.stream,
    })
    const recommendations = calculateRecommendations(profile, CAREERS).slice(0, 5)
    const record: AssessmentRecord = {
      id: `assessment-${Date.now()}`,
      completedAt: new Date().toISOString(),
      profile,
      recommendations,
    }
    updateCurrent((current) => ({
      ...current,
      assessmentProfile: profile,
      recommendations,
      assessmentHistory: [record, ...current.assessmentHistory],
      primaryCareerId: current.primaryCareerId ?? recommendations[0]?.careerId ?? null,
      savedCareerIds: current.primaryCareerId || !recommendations[0] ? current.savedCareerIds : [...new Set([...current.savedCareerIds, recommendations[0].careerId])],
    }))
    return recommendations
  }, [account, updateCurrent])

  const resetAssessment = useCallback(() => {
    updateCurrent((current) => ({ ...current, answers: {}, assessmentProfile: null, recommendations: [] }))
  }, [updateCurrent])

  const toggleSavedCareer = useCallback((careerId: string) => {
    updateCurrent((current) => {
      const exists = current.savedCareerIds.includes(careerId)
      const savedCareerIds = exists ? current.savedCareerIds.filter((id) => id !== careerId) : [...current.savedCareerIds, careerId]
      return { ...current, savedCareerIds, primaryCareerId: current.primaryCareerId === careerId && exists ? savedCareerIds[0] ?? null : current.primaryCareerId }
    })
  }, [updateCurrent])

  const setPrimaryCareer = useCallback((careerId: string) => {
    updateCurrent((current) => ({
      ...current,
      primaryCareerId: careerId,
      savedCareerIds: current.savedCareerIds.includes(careerId) ? current.savedCareerIds : [...current.savedCareerIds, careerId],
    }))
  }, [updateCurrent])

  const toggleRoadmapItem = useCallback((itemId: string) => {
    updateCurrent((current) => ({ ...current, roadmapProgress: { ...current.roadmapProgress, [itemId]: !current.roadmapProgress[itemId] } }))
  }, [updateCurrent])

  const sendMessage = useCallback((message: string) => {
    const content = message.trim()
    if (!content) return
    updateCurrent((current) => ({
      ...current,
      messages: [
        ...current.messages,
        { id: `user-${Date.now()}`, role: 'user', content, createdAt: new Date().toISOString() },
        { id: `assistant-${Date.now() + 1}`, role: 'assistant', content: counsellorReply(current, content), createdAt: new Date().toISOString() },
      ],
    }))
  }, [updateCurrent])

  const value = useMemo<AppContextValue>(() => ({
    user: account ? { id: account.id, name: account.name, email: account.email, role: account.role, createdAt: account.createdAt } : null,
    profile: account?.profile ?? null,
    isAuthenticated: Boolean(account),
    isOnboarded: account?.onboardingComplete ?? false,
    answers: account?.answers ?? {},
    assessmentProfile: account?.assessmentProfile ?? null,
    recommendations: account?.recommendations ?? [],
    assessmentHistory: account?.assessmentHistory ?? [],
    savedCareerIds: account?.savedCareerIds ?? [],
    primaryCareerId: account?.primaryCareerId ?? null,
    roadmapProgress: account?.roadmapProgress ?? {},
    messages: account?.messages ?? [],
    register,
    login,
    logout,
    updateOnboarding,
    updateProfile,
    saveAnswer,
    submitAssessment,
    resetAssessment,
    toggleSavedCareer,
    setPrimaryCareer,
    toggleRoadmapItem,
    sendMessage,
  }), [account, login, logout, register, resetAssessment, saveAnswer, sendMessage, setPrimaryCareer, submitAssessment, toggleRoadmapItem, toggleSavedCareer, updateOnboarding, updateProfile])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within AppProvider')
  return context
}

export { createEmptyAssessmentProfile }
