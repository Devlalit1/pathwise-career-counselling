import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ErrorBoundary, ToastProvider } from './components/ui'
import { AppShell, PublicLayout, RequireAdmin, RequireAuth } from './components/layout'

// Public pages
import Home from './pages/Home'
import CareersExplorer from './pages/CareersExplorer'
import CareerDetail from './pages/CareerDetail'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'

// Authenticated app pages
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import CompareCarers from './pages/CompareCarers'
import MyPlan from './pages/MyPlan'
import Counsellor from './pages/Counsellor'
import Profile from './pages/Profile'
import AssessmentHistory from './pages/AssessmentHistory'
import Goals from './pages/Goals'
import Settings from './pages/Settings'
import Admin from './pages/Admin'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ErrorBoundary>
          <AppProvider>
            <ToastProvider>
              <Routes>
                {/* ── Public routes ────────────────────────────────── */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/careers" element={<CareersExplorer />} />
                  <Route path="/careers/:slug" element={<CareerDetail />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                {/* ── Authenticated routes ──────────────────────────── */}
                <Route element={<RequireAuth />}>
                  {/* Onboarding — no app shell */}
                  <Route path="/onboarding" element={<Onboarding />} />

                  {/* Main app shell */}
                  <Route element={<AppShell />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/assessment" element={<Assessment />} />
                    <Route path="/compare" element={<CompareCarers />} />
                    <Route path="/my-plan" element={<MyPlan />} />
                    <Route path="/counsellor" element={<Counsellor />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/assessment-history" element={<AssessmentHistory />} />
                    <Route path="/goals" element={<Goals />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Admin */}
                    <Route element={<RequireAdmin />}>
                      <Route path="/admin" element={<Admin />} />
                    </Route>
                  </Route>
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </ToastProvider>
          </AppProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
