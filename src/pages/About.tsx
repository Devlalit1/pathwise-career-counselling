import { Link } from 'react-router-dom'
import { BookOpenCheck, CheckCircle2, ChevronDown, ChevronUp, GraduationCap, MessageCircleHeart, Route } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../components/ui'

const STEPS = [
  {
    icon: BookOpenCheck,
    title: 'Complete the 36-question assessment',
    body: 'Answer reflective questions across five dimensions: interests (what excites you), skills (what you\'re good at), personality (how you work), values (what matters to you), and work preferences (the environment you thrive in). The assessment takes 8–10 minutes and can be saved at any time.',
  },
  {
    icon: CheckCircle2,
    title: 'Receive explainable career matches',
    body: 'Your answers are scored against 50+ career profiles using a transparent weighted model. You\'ll see an overall match percentage and individual dimension scores — so you know exactly why a career appears on your list.',
  },
  {
    icon: Route,
    title: 'Explore and build your roadmap',
    body: 'Each career has a personalised roadmap with phases, tasks, certifications, and entrance exams relevant to your starting point. Track your progress as you complete items. Compare careers side-by-side with charts and tables.',
  },
  {
    icon: MessageCircleHeart,
    title: 'Get guidance from the counsellor',
    body: 'Use the built-in career counsellor to ask follow-up questions, compare pathways, and turn your plan into specific next steps — all grounded in your actual assessment profile.',
  },
]

const PRINCIPLES = [
  {
    title: 'Results must be explainable',
    body: 'Every score shows you the exact dimensions that drove it. We don\'t just say "you\'re a good fit" — we show you the interest, skill, and personality factors that matter.',
  },
  {
    title: 'Guidance is not a guarantee',
    body: 'Career advice depends on individual circumstances, market conditions, and timing. Pathwise gives you a starting direction, not a promise. Verify requirements with institutions.',
  },
  {
    title: 'One size doesn\'t fit all',
    body: 'Your education level, stream, and stage of life all influence your path. Our model accounts for academic fit alongside interests and skills.',
  },
]

const FAQS = [
  {
    question: 'Is the assessment scientifically validated?',
    answer: 'The interest dimensions are inspired by Holland\'s RIASEC model, which has broad academic support. The full scoring model is purpose-built for Indian career contexts and presented as a structured guidance tool, not a clinical psychometric instrument.',
  },
  {
    question: 'Are the salary figures accurate?',
    answer: 'No. All salary figures in Pathwise are explicitly labelled as illustrative demo ranges. Real compensation varies enormously by employer, location, experience, year, and negotiation. Always verify with current, local sources.',
  },
  {
    question: 'Can I retake the assessment?',
    answer: 'Yes. You can retake the assessment at any time. Your history is saved so you can compare how your profile evolves over time. A new submission generates a new set of recommendations without removing your previous results.',
  },
  {
    question: 'Who is Pathwise designed for?',
    answer: 'Pathwise is designed for Indian learners at any stage — students in Class 10–12 choosing streams, undergraduates exploring specialisations, recent graduates entering the workforce, and career switchers looking to redirect their experience.',
  },
  {
    question: 'Is my data stored securely?',
    answer: 'This demo version stores all data in your browser\'s localStorage only. Nothing is sent to a server. Clearing your browser data will reset your account.',
  },
  {
    question: 'Can I use Pathwise for free?',
    answer: 'Yes. The full demo experience — assessment, recommendations, roadmap, counsellor, and career explorer — is available without payment.',
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <details className="faq-item" open={open} onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}>
      <summary>
        {question}
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </summary>
      <p>{answer}</p>
    </details>
  )
}

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="about-hero">
        <div className="page-container">
          <p className="eyebrow">About Pathwise</p>
          <h1>Thoughtful career guidance built around your responses</h1>
          <p style={{ maxWidth: 680, margin: 0, color: '#53647e', lineHeight: 1.65, fontSize: '1.05rem' }}>
            We built Pathwise to give every Indian learner — regardless of their background or stage — access to personalised, explainable career guidance that treats them as an individual.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="page-section">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The process</p>
              <h2>How Pathwise works</h2>
            </div>
          </div>
          <div className="step-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {STEPS.map((step, i) => (
              <div key={i} className="step-card">
                <div className="step-card__number"><step.icon size={14} /></div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="page-section page-section--tight" style={{ background: '#f7f9ff' }} id="principles">
        <div className="page-container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Our approach</p>
              <h2>Guidance principles</h2>
              <p className="section-heading__copy">How we think about giving career advice responsibly.</p>
            </div>
          </div>
          <div className="principle-grid">
            {PRINCIPLES.map((p) => (
              <div key={p.title} className="principle-card">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="page-section" id="faq">
        <div className="page-container">
          <div className="section-heading" style={{ justifyContent: 'center', textAlign: 'center' }}>
            <div>
              <p className="eyebrow">Questions</p>
              <h2>Frequently asked questions</h2>
            </div>
          </div>
          <div className="faq-list">
            {FAQS.map((faq) => <FAQItem key={faq.question} {...faq} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="page-section page-section--tight" style={{ background: '#f0f5ff', textAlign: 'center' }}>
        <div className="page-container">
          <GraduationCap size={36} style={{ color: 'var(--primary)', marginBottom: 14 }} />
          <h2 style={{ marginBottom: 12 }}>Ready to find your direction?</h2>
          <p style={{ maxWidth: 480, margin: '0 auto 22px', color: 'var(--muted)', lineHeight: 1.65 }}>
            Take the free assessment and get your personalised career matches in under 10 minutes.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/register"><Button size="lg">Start the assessment</Button></Link>
            <Link to="/careers"><Button variant="secondary" size="lg">Explore careers</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
