import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  GraduationCap,
  LineChart,
  MessageCircleHeart,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { CAREERS } from '../data/careers'
import { Button, ScoreBadge, SectionHeading } from '../components/ui'
import { useApp } from '../context/AppContext'

// ── Data ────────────────────────────────────────────────────────────────────

const CATEGORY_ICONS: Record<string, typeof Compass> = {
  Technology: Sparkles,
  'Data & AI': LineChart,
  Engineering: Target,
  Healthcare: ShieldCheck,
  Finance: BarChart3,
  Management: BriefcaseBusiness,
  Law: Scale,
  Design: Compass,
  Education: GraduationCap,
  Research: BookOpen,
  Media: MessageCircleHeart,
  Entrepreneurship: Target,
  'Government & Public Administration': ShieldCheck,
}

const CATEGORY_COUNTS = (() => {
  const c: Record<string, number> = {}
  for (const career of CAREERS) c[career.category] = (c[career.category] ?? 0) + 1
  return c
})()

const TOP_CATEGORIES = Object.entries(CATEGORY_COUNTS)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)

const STEPS = [
  {
    number: '01',
    title: 'Complete the assessment',
    body: 'Answer 36 reflective questions across 6 dimensions — interests, skills, personality, values, work preferences, and academics. Takes 8–10 minutes.',
  },
  {
    number: '02',
    title: 'Get transparent matches',
    body: "Our scoring engine ranks every career by overall fit with a detailed breakdown. You'll see exactly why a career was recommended.",
  },
  {
    number: '03',
    title: 'Build your roadmap',
    body: 'Dive into detailed career profiles, compare pathways side-by-side, chat with our AI counsellor, and build a personalised action plan.',
  },
]

const FEATURES = [
  {
    icon: BarChart3,
    title: 'Explainable matches',
    body: 'See a dimension-by-dimension score breakdown for every career — no black-box algorithms.',
  },
  {
    icon: BookOpen,
    title: 'Detailed roadmaps',
    body: 'Step-by-step learning plans for 50+ careers, with resources, certifications, and milestones.',
  },
  {
    icon: Scale,
    title: 'Side-by-side comparison',
    body: 'Compare up to 3 careers across salary, demand, skills, and work-life balance simultaneously.',
  },
  {
    icon: MessageCircleHeart,
    title: 'AI career counsellor',
    body: 'Chat with our AI counsellor for personalised guidance based on your assessment results.',
  },
  {
    icon: Target,
    title: 'Goal tracking',
    body: 'Set milestones, link them to careers, and track your progress toward your chosen path.',
  },
  {
    icon: Users,
    title: 'Built for India',
    body: 'Career data includes government opportunities, entrance exams, and Indian salary benchmarks.',
  },
]

const DEMO_MATCHES = [
  { rank: 1, name: 'Data Scientist', score: 89 },
  { rank: 2, name: 'Product Manager', score: 84 },
  { rank: 3, name: 'UX Designer', score: 79 },
]

const TESTIMONIALS = [
  {
    quote: '"Pathwise showed me why software engineering fit my profile so precisely. The dimension scores gave me the confidence to switch streams after Class 12."',
    name: 'Priya S.',
    detail: 'Class 12 student, Mumbai',
    initials: 'PS',
  },
  {
    quote: '"I was torn between MBA and civil services. The side-by-side comparison and counsellor chat helped me make an informed decision in under an hour."',
    name: 'Rahul M.',
    detail: 'Undergraduate, Delhi',
    initials: 'RM',
  },
  {
    quote: '"The roadmap for UX design was incredibly detailed. I knew exactly which courses to take and what to build for my portfolio."',
    name: 'Anjali K.',
    detail: 'Career switcher, Bengaluru',
    initials: 'AK',
  },
]

// ── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const { isAuthenticated } = useApp()

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__grid">
          <div className="animate-slide-up">
            <p className="eyebrow">Career guidance · Made for India</p>
            <h1>
              Find your{' '}
              <em style={{ color: 'var(--primary)', fontStyle: 'normal' }}>path</em>
              .<br />Not just a career.
            </h1>
            <p className="hero__copy">
              Pathwise uses your interests, strengths, values, and work preferences to
              recommend careers that actually fit you — with complete transparency on why.
            </p>
            <div className="hero__actions">
              <Link to={isAuthenticated ? '/assessment' : '/register'}>
                <Button variant="primary" size="lg">
                  Start your assessment <ArrowRight size={17} />
                </Button>
              </Link>
              <Link to="/careers">
                <Button variant="secondary" size="lg">
                  Explore careers
                </Button>
              </Link>
            </div>
            <div className="trust-line">
              <CheckCircle2 size={16} />
              Free forever · No account needed to explore · Explainable results
            </div>
          </div>

          {/* Demo card */}
          <div className="hero-demo-card animate-slide-up delay-200">
            <div className="hero-demo-card__header">
              <span>Your top matches</span>
              <ScoreBadge score={89} label="avg" />
            </div>
            {DEMO_MATCHES.map((m) => (
              <div key={m.rank} className="hero-demo-match">
                <span className="hero-demo-match__rank">{m.rank}</span>
                <div>
                  <div className="hero-demo-match__name">{m.name}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--muted)', marginTop: 2 }}>
                    Based on your interests & skills
                  </div>
                </div>
                <span className="hero-demo-match__score">{m.score}%</span>
              </div>
            ))}
            <div
              style={{
                marginTop: 14,
                padding: '10px 14px',
                background: '#f0f5ff',
                borderRadius: 10,
                fontSize: '.76rem',
                color: '#3655a0',
                lineHeight: 1.5,
              }}
            >
              ✦ Sample results — take the assessment to see your real matches
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────── */}
      <div className="stats-bar">
        <div className="stats-bar__inner">
          {[
            { number: '50+', label: 'Career profiles' },
            { number: '36', label: 'Assessment questions' },
            { number: '6', label: 'Scoring dimensions' },
            { number: '100%', label: 'Free to use' },
          ].map((s, i) => (
            <div key={s.label} className="stat-item animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
              <span className="stat-item__number">{s.number}</span>
              <span className="stat-item__label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="page-section">
        <div className="page-container">
          <SectionHeading
            eyebrow="How it works"
            title="Three steps to clarity"
            copy="Our research-backed process guides you from self-discovery to a concrete action plan in under 15 minutes."
            center
          />
          <div className="step-grid" style={{ marginTop: 36 }}>
            {STEPS.map((step, i) => (
              <div key={step.number} className={`step-card animate-slide-up delay-${(i + 1) * 100}`}>
                <div className="step-card__number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Career categories ─────────────────────────────────────────── */}
      <section className="page-section" style={{ background: '#f8faff', borderTop: '1px solid #e8edf5', borderBottom: '1px solid #e8edf5' }}>
        <div className="page-container">
          <SectionHeading
            eyebrow="50+ careers across 13 domains"
            title="Explore career categories"
            copy="From technology and finance to law and design — find careers that match your strengths."
            action={
              <Link to="/careers">
                <Button variant="secondary" size="sm">
                  View all careers <ArrowRight size={14} />
                </Button>
              </Link>
            }
          />
          <div className="career-category-grid" style={{ marginTop: 28 }}>
            {TOP_CATEGORIES.map(([cat, count], i) => {
              const Icon = CATEGORY_ICONS[cat] ?? Compass
              return (
                <Link
                  to={`/careers?category=${encodeURIComponent(cat)}`}
                  key={cat}
                  className={`category-tile animate-slide-up delay-${Math.min((i + 1) * 100, 400)}`}
                >
                  <div className="category-tile__icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <strong>{cat}</strong>
                    <span>{count} career{count !== 1 ? 's' : ''}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section className="page-section">
        <div className="page-container">
          <SectionHeading
            eyebrow="Why Pathwise"
            title="Built to give you real answers"
            copy="Not another quiz that gives you a vague personality type. Pathwise shows its work."
            center
          />
          <div className="feature-grid" style={{ marginTop: 36 }}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className={`feature-card animate-slide-up delay-${Math.min((i + 1) * 100, 400)}`}>
                <div className="feature-card__icon">
                  <f.icon size={22} />
                </div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="page-section" style={{ background: '#f8faff', borderTop: '1px solid #e8edf5', borderBottom: '1px solid #e8edf5' }}>
        <div className="page-container">
          <SectionHeading
            eyebrow="Student stories"
            title="What people are saying"
            center
          />
          <div className="testimonial-grid" style={{ marginTop: 32 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial animate-slide-up">
                <p className="testimonial__quote">{t.quote}</p>
                <div className="testimonial__person">
                  <div className="avatar">{t.initials}</div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA banner ────────────────────────────────────────────────── */}
      <section className="cta-banner">
        <div className="page-container">
          <h2>Ready to find your fit?</h2>
          <p>
            Take the free 8-minute assessment and get a personalised list of careers ranked by how
            well they match your profile — with transparent scores and a concrete action plan.
          </p>
          <Link to={isAuthenticated ? '/assessment' : '/register'}>
            <Button
              variant="secondary"
              size="lg"
              style={{ background: '#fff', color: 'var(--primary)', borderColor: 'transparent' }}
            >
              Start for free <ArrowRight size={17} />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
