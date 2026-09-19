import {
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Compass,
  GraduationCap,
  LineChart,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { CAREERS } from '../data/careers'
import { Button, Tag } from '../components/ui'
import { useApp } from '../context/AppContext'

const CATEGORY_ICONS: Record<string, typeof Compass> = {
  Technology: Sparkles,
  'Data & AI': LineChart,
  Engineering: Target,
  Healthcare: ShieldCheck,
  Finance: LineChart,
  Management: BriefcaseBusiness,
  Law: BookOpenCheck,
  Design: Compass,
  Education: GraduationCap,
  Research: BookOpenCheck,
  Media: MessageCircleHeart,
  Entrepreneurship: Target,
  'Government & Public Administration': ShieldCheck,
}

const CATEGORY_COUNTS = (() => {
  const counts: Record<string, number> = {}
  for (const c of CAREERS) counts[c.category] = (counts[c.category] ?? 0) + 1
  return counts
})()

const TOP_CATEGORIES = Object.entries(CATEGORY_COUNTS)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)

const STEPS = [
  {
    number: '01',
    title: 'Complete the assessment',
    body: 'Answer 36 reflective questions about your interests, skills, personality, values, and work preferences. It takes about 8–10 minutes.',
  },
  {
    number: '02',
    title: 'Receive your matches',
    body: 'Our scoring engine compares your profile across multiple dimensions and ranks careers by overall fit — with transparent, explainable scores.',
  },
  {
    number: '03',
    title: 'Explore and plan',
    body: 'Dive into detailed career profiles, compare pathways side-by-side, and build a personalised roadmap for your chosen direction.',
  },
]

const BENEFITS = [
  {
    icon: CheckCircle2,
    title: 'Explainable results',
    body: 'Every recommendation shows exactly which interests, skills, and preferences drove it — no black-box answers.',
  },
  {
    icon: Target,
    title: 'Personalised roadmaps',
    body: 'Get a step-by-step action plan for your top career match, from foundation skills to certifications and first roles.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Guided counsellor',
    body: 'Ask questions, compare pathways, and get structured guidance based on your actual saved assessment profile.',
  },
]

const TESTIMONIALS = [
  {
    quote: '"I had no idea which engineering branch to pick after Class 12. Pathwise showed me that my love of maths and systems thinking pointed clearly toward data science — and gave me a concrete plan."',
    name: 'Aditi R.',
    role: 'Engineering student, Pune',
  },
  {
    quote: '"As a career switcher, I needed something that would acknowledge my existing strengths. Pathwise mapped my project management skills to product roles in a way no counsellor ever had."',
    name: 'Sandeep M.',
    role: 'Career switcher, Bengaluru',
  },
  {
    quote: '"The compare tool helped me finally decide between law and civil services. Seeing the full skill gap breakdown made the choice obvious."',
    name: 'Priya K.',
    role: 'Postgraduate student, Delhi',
  },
]

const HERO_MATCHES = [
  { name: 'Data Scientist', reason: 'Investigative interest · Analytical strength', percent: '89%' },
  { name: 'Product Manager', reason: 'Enterprising interest · Leadership fit', percent: '81%' },
  { name: 'UX Designer', reason: 'Artistic interest · Creativity preference', percent: '74%' },
]

export default function Home() {
  const { isAuthenticated } = useApp()

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero__grid">
          <div>
            <p className="eyebrow">Career guidance, made personal</p>
            <h1>Find the career that <em>fits you</em></h1>
            <p className="hero__copy">
              Pathwise uses a reflective 36-question assessment to map your interests, skills, personality, and values to real career pathways — with transparent scores and step-by-step plans.
            </p>
            <div className="hero__actions">
              {isAuthenticated ? (
                <Link to="/dashboard"><Button size="lg">Go to my dashboard</Button></Link>
              ) : (
                <>
                  <Link to="/register"><Button size="lg">Start free assessment</Button></Link>
                  <Link to="/careers"><Button variant="secondary" size="lg">Explore careers</Button></Link>
                </>
              )}
            </div>
            <p className="trust-line"><CheckCircle2 size={15} /> Free demo · No account required to browse · Results explained, not just listed</p>
          </div>

          {/* Insight card */}
          <div>
            <div className="hero-insight">
              <div className="hero-insight__top">
                <span className="hero-insight__label">Sample career matches</span>
                <Tag tone="teal">Demo data</Tag>
              </div>
              {HERO_MATCHES.map((match) => (
                <div key={match.name} className="hero-match">
                  <div className="hero-match__number">{HERO_MATCHES.indexOf(match) + 1}</div>
                  <div>
                    <div className="hero-match__name">{match.name}</div>
                    <div className="hero-match__reason">{match.reason}</div>
                  </div>
                  <div className="hero-match__percent">{match.percent}</div>
                </div>
              ))}
              <div style={{ marginTop: 18 }}>
                <p className="demo-disclaimer">Illustrative demo data only. Actual scores depend on your own responses.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logo line */}
      <div className="logo-line">Trusted approach · Reflective assessment · Explainable scoring · 50+ Indian career pathways</div>

      {/* How it works */}
      <section className="page-section">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">How it works</p>
              <h2>Three steps to a clearer direction</h2>
              <p className="section-heading__copy">No vague advice, no one-size-fits-all lists. Just a thoughtful process that starts with you.</p>
            </div>
          </div>
          <div className="step-grid">
            {STEPS.map((step) => (
              <div key={step.number} className="step-card">
                <div className="step-card__number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career categories */}
      <section className="page-section page-section--tight" style={{ background: '#f7f9ff' }}>
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Explore by area</p>
              <h2>Career categories</h2>
            </div>
            <div className="section-heading__action">
              <Link to="/careers"><Button variant="soft" size="sm">View all careers</Button></Link>
            </div>
          </div>
          <div className="career-category-grid">
            {TOP_CATEGORIES.map(([category, count]) => {
              const Icon = CATEGORY_ICONS[category] ?? Compass
              return (
                <Link key={category} to={`/careers?category=${encodeURIComponent(category)}`} className="category-tile">
                  <div className="category-tile__icon"><Icon size={18} /></div>
                  <div>
                    <strong>{category}</strong>
                    <span>{count} career{count !== 1 ? 's' : ''}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="page-section">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Why Pathwise</p>
              <h2>Guidance you can actually act on</h2>
            </div>
          </div>
          <div className="benefit-grid">
            {BENEFITS.map((benefit) => (
              <div key={benefit.title} className="benefit-card">
                <div className="benefit-card__icon"><benefit.icon size={20} /></div>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="page-section page-section--tight" style={{ background: '#f7f9ff' }}>
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">From learners</p>
              <h2>What people say</h2>
              <p className="section-heading__copy muted" style={{ fontSize: '.8rem' }}>Illustrative demo testimonials.</p>
            </div>
          </div>
          <div className="testimonial-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial">
                <p className="testimonial__quote">{t.quote}</p>
                <div className="testimonial__person">
                  <span className="avatar">{t.name[0]}</span>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section">
        <div className="page-container" style={{ textAlign: 'center' }}>
          <p className="eyebrow">Ready to start?</p>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: 14 }}>Your career direction starts here</h2>
          <p style={{ maxWidth: 520, margin: '0 auto 28px', color: 'var(--muted)', lineHeight: 1.65 }}>
            Take the free assessment and get personalised career matches with skill-gap analysis and roadmaps — all explained in plain language.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/register"><Button size="lg">Get started — it's free</Button></Link>
            <Link to="/about"><Button variant="secondary" size="lg">How it works</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
