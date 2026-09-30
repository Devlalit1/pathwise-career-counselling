/**
 * Pathwise API client — typed fetch wrapper with JWT auth.
 * All calls go to VITE_API_URL (set in .env or .env.production).
 */

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3001'

// ─── Token management ──────────────────────────────────────────────────────

const TOKEN_KEY = 'pathwise-token'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

// ─── Core fetch wrapper ─────────────────────────────────────────────────────

interface ApiOptions extends RequestInit {
  auth?: boolean
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<T>(path: string, opts: ApiOptions = {}): Promise<T> {
  const { auth = true, headers: extraHeaders, ...rest } = opts
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(extraHeaders as Record<string, string>),
  }
  if (auth) {
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...rest, headers })

  let body: unknown
  try { body = await res.json() } catch { body = null }

  if (!res.ok) {
    const message =
      (body && typeof body === 'object' && 'message' in body)
        ? String((body as { message: unknown }).message)
        : `Request failed: ${res.status}`
    throw new ApiError(res.status, message, body)
  }

  return body as T
}

// ─── Typed API surface ──────────────────────────────────────────────────────

export interface ApiUser {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'ADMIN'
  createdAt: string
}

export interface ApiProfile {
  id: string
  userId: string
  age?: number
  location?: string
  preferredLanguage: string
  bio?: string
  education?: {
    educationLevel: string
    stream?: string
    degree?: string
    branch?: string
    institutionName?: string
    percentage?: number
    graduationYear?: number
  }
  interests: { interestId: string; strength: number }[]
  skills: { skillId: string; proficiency: number }[]
  goals: { id: string; title: string; status: string; targetDate?: string }[]
}

export interface ApiCareer {
  id: string
  slug: string
  name: string
  category: { id: string; name: string; slug: string }
  overview: string
  difficulty: string
  demandLevel: string
  salaryMinSample?: number
  salaryMaxSample?: number
  skills: { skill: { name: string }; targetLevel: number; isTechnical: boolean }[]
}

export interface ApiAssessment {
  id: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED'
  progressPercent: number
  profileSnapshot?: Record<string, Record<string, number>>
  completedAt?: string
  recommendations?: ApiRecommendation[]
}

export interface ApiRecommendation {
  id: string
  careerId: string
  career: ApiCareer
  overallScore: number
  interestScore: number
  skillScore: number
  personalityScore: number
  academicScore: number
  valueScore: number
  workPreferenceScore: number
  reasons: string[]
  strengths: string[]
  skillGaps: string[]
  nextSteps: string[]
}

export interface ApiMessage {
  id: string
  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string
  createdAt: string
}

export interface ApiConversation {
  id: string
  title?: string
  updatedAt: string
  messages?: ApiMessage[]
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export const authApi = {
  register: (data: { name: string; email: string; password: string; educationLevel?: string }) =>
    request<{ user: ApiUser; token: string }>('/api/auth/register', {
      method: 'POST', body: JSON.stringify(data), auth: false,
    }),

  login: (email: string, password: string) =>
    request<{ user: ApiUser; token: string }>('/api/auth/login', {
      method: 'POST', body: JSON.stringify({ email, password }), auth: false,
    }),

  logout: () => request<void>('/api/auth/logout', { method: 'POST' }),

  me: () => request<{ user: ApiUser; profile: ApiProfile }>('/api/auth/me'),
}

// ─── Careers ────────────────────────────────────────────────────────────────

export const careersApi = {
  list: (params?: { category?: string; search?: string; difficulty?: string; demand?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString()
    return request<ApiCareer[]>(`/api/careers${q ? `?${q}` : ''}`, { auth: false })
  },

  getBySlug: (slug: string) => request<ApiCareer>(`/api/careers/${slug}`, { auth: false }),
}

// ─── Profile ────────────────────────────────────────────────────────────────

export const profileApi = {
  get: () => request<ApiProfile>('/api/profile'),

  update: (data: Partial<ApiProfile>) =>
    request<ApiProfile>('/api/profile', { method: 'PATCH', body: JSON.stringify(data) }),

  setPrimaryCareer: (careerId: string) =>
    request<void>('/api/profile/primary-career', { method: 'PATCH', body: JSON.stringify({ careerId }) }),
}

// ─── Assessment ─────────────────────────────────────────────────────────────

export const assessmentApi = {
  getQuestions: () =>
    request<{ id: string; slug: string; dimension: string; prompt: string; helperText?: string; order: number }[]>(
      '/api/assessment/questions', { auth: false }
    ),

  start: () => request<ApiAssessment>('/api/assessment/start', { method: 'POST' }),

  saveAnswer: (assessmentId: string, questionId: string, value: number) =>
    request<void>(`/api/assessment/${assessmentId}/answer`, {
      method: 'PATCH', body: JSON.stringify({ questionId, numericValue: value }),
    }),

  submit: (assessmentId: string) =>
    request<ApiAssessment>(`/api/assessment/${assessmentId}/submit`, { method: 'POST' }),

  history: () => request<ApiAssessment[]>('/api/assessment/history'),
}

// ─── Recommendations ────────────────────────────────────────────────────────

export const recommendationsApi = {
  latest: () => request<ApiRecommendation[]>('/api/recommendations'),
  byAssessment: (id: string) => request<ApiRecommendation[]>(`/api/recommendations/${id}`),
}

// ─── Roadmap ────────────────────────────────────────────────────────────────

export interface ApiRoadmapPhase {
  id: string
  order: number
  title: string
  description?: string
  items: {
    id: string
    order: number
    title: string
    description?: string
    itemType: string
    estimatedHours?: number
    resourceUrl?: string
    isOptional: boolean
    isCompleted: boolean
  }[]
}

export const roadmapApi = {
  getForCareer: (careerId: string) =>
    request<{ phases: ApiRoadmapPhase[]; totalItems: number; completedItems: number }>(`/api/roadmap/${careerId}`),

  toggle: (roadmapItemId: string) =>
    request<{ isCompleted: boolean }>(`/api/roadmap/${roadmapItemId}/toggle`, { method: 'POST' }),
}

// ─── Counsellor ─────────────────────────────────────────────────────────────

export const counsellorApi = {
  listConversations: () => request<ApiConversation[]>('/api/counsellor/conversations'),

  createConversation: (title?: string) =>
    request<ApiConversation>('/api/counsellor/conversations', {
      method: 'POST', body: JSON.stringify({ title }),
    }),

  getMessages: (conversationId: string) =>
    request<ApiMessage[]>(`/api/counsellor/conversations/${conversationId}/messages`),

  sendMessage: (conversationId: string, content: string) =>
    request<{ userMessage: ApiMessage; assistantMessage: ApiMessage }>(
      `/api/counsellor/conversations/${conversationId}/messages`,
      { method: 'POST', body: JSON.stringify({ content }) }
    ),
}

// ─── Admin ──────────────────────────────────────────────────────────────────

export const adminApi = {
  stats: () => request<{ totalUsers: number; totalAssessments: number; totalCareers: number; recentUsers: ApiUser[] }>('/api/admin/stats'),
  users: () => request<ApiUser[]>('/api/admin/users'),
  careers: () => request<ApiCareer[]>('/api/admin/careers'),
  createCareer: (data: Partial<ApiCareer>) =>
    request<ApiCareer>('/api/admin/careers', { method: 'POST', body: JSON.stringify(data) }),
  updateCareer: (id: string, data: Partial<ApiCareer>) =>
    request<ApiCareer>(`/api/admin/careers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCareer: (id: string) =>
    request<void>(`/api/admin/careers/${id}`, { method: 'DELETE' }),
}
