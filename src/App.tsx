import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { AppShell, PublicLayout, RequireAuth, RequireAdmin } from './components/layout'

// Public pages
import Home from './pages/Home'
import CareersExplorer from './pages/CareersExplorer'
import CareerDetail from './pages/CareerDetail'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'

// Authenticated app pages
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Assessment from './pages/Assessment'
import CompareCarers from './pages/CompareCarers'
import MyPlan from './pages/MyPlan'
import Counsellor from './pages/Counsellor'
import Profile from './pages/Profile'
import AssessmentHistory from './pages/AssessmentHistory'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <Routes>
          {/* ── Public routes ─────────────────────────────────────── */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/careers" element={<CareersExplorer />} />
            <Route path="/careers/:slug" element={<CareerDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ── Authenticated app routes ───────────────────────────── */}
          <Route element={<RequireAuth />}>
            {/* Onboarding — app shell without sidebar */}
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

              {/* Admin */}
              <Route element={<RequireAdmin />}>
                <Route path="/admin" element={<Admin />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
