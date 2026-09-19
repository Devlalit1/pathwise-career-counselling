import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { ASSESSMENT_QUESTIONS, ASSESSMENT_QUESTION_COUNT } from '../data/questions'
import { Button, InlineNotice, ScoreBadge, Tag } from '../components/ui'
import { useState } from 'react'
import type { AssessmentDomain } from '../types'

const DOMAIN_LABELS: Record<AssessmentDomain, string> = {
  interest: 'Interests',
  skill: 'Skills',
  personality: 'Personality',
  value: 'Values',
  workPreference: 'Work preferences',
}

const DOMAIN_ORDER: AssessmentDomain[] = ['interest', 'skill', 'personality', 'value', 'workPreference']

// Group questions by domain, in order
const QUESTION_GROUPS = DOMAIN_ORDER.map((domain) => ({
  domain,
  label: DOMAIN_LABELS[domain],
  questions: ASSESSMENT_QUESTIONS.filter((q) => q.domain === domain),
}))

// Flat ordered question list
const FLAT_QUESTIONS = DOMAIN_ORDER.flatMap((domain) =>
  ASSESSMENT_QUESTIONS.filter((q) => q.domain === domain),
)

export default function Assessment() {
  const { answers, saveAnswer, submitAssessment, resetAssessment } = useApp()
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(() => {
    // Resume from last answered question (ES2023 findLastIndex compatible polyfill)
    let lastAnswered = -1
    for (let i = FLAT_QUESTIONS.length - 1; i >= 0; i--) {
      if (answers[FLAT_QUESTIONS[i].id] !== undefined) { lastAnswered = i; break }
    }
    return Math.min(lastAnswered + 1, FLAT_QUESTIONS.length - 1)
  })
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<ReturnType<typeof submitAssessment> | null>(null)

  const current = FLAT_QUESTIONS[currentIndex]
  const answeredCount = FLAT_QUESTIONS.filter((q) => answers[q.id] !== undefined).length
  const progressPercent = Math.round((answeredCount / ASSESSMENT_QUESTION_COUNT) * 100)
  const allAnswered = answeredCount === ASSESSMENT_QUESTION_COUNT
  const selectedValue = current ? answers[current.id] : undefined

  // Find which group we're in
  const currentGroup = QUESTION_GROUPS.find((g) => g.questions.some((q) => q.id === current?.id))

  function handleSelect(value: number) {
    if (!current) return
    saveAnswer(current.id, value)
    // Auto-advance
    if (currentIndex < FLAT_QUESTIONS.length - 1) {
      setTimeout(() => setCurrentIndex((i) => i + 1), 200)
    }
  }

  function handleSubmit() {
    const recs = submitAssessment()
    setResults(recs)
    setSubmitted(true)
  }

  function handleReset() {
    resetAssessment()
    setCurrentIndex(0)
    setSubmitted(false)
    setResults(null)
  }

  // Results view
  if (submitted && results) {
    return (
      <div className="assessment-shell">
        <div className="assessment-top">
          <div>
            <h1>Your career matches</h1>
            <p>Based on your 36-question assessment. Scores are for guidance, not guaranteed outcomes.</p>
          </div>
        </div>

        <InlineNotice tone="info">
          These results are based on your self-reported responses. Career opportunities, requirements, and outcomes vary by employer, institution, year, and location — always verify independently.
        </InlineNotice>

        <div style={{ marginTop: 22, display: 'grid', gap: 13 }}>
          {results.slice(0, 5).map((match, i) => (
            <div key={match.careerId} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div>
                <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 8 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: '#eef2ff', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: '.72rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{match.career.name}</h3>
                  <ScoreBadge score={match.overallScore} />
                </div>
                <Tag tone="slate">{match.career.category}</Tag>
                <p style={{ margin: '10px 0 8px', color: 'var(--muted)', fontSize: '.83rem', lineHeight: 1.55 }}>
                  {match.career.shortDescription}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
                  {match.reasons.slice(0, 2).map((r) => (
                    <span key={r} style={{ fontSize: '.72rem', color: '#53677c', background: '#edf7f5', padding: '3px 8px', borderRadius: 99 }}>✓ {r}</span>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'flex-end', minWidth: 120 }}>
                {[
                  { label: 'Interest', v: match.interestScore },
                  { label: 'Skill', v: match.skillScore },
                  { label: 'Personality', v: match.personalityScore },
                ].map(({ label, v }) => (
                  <div key={label} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: '.72rem', color: 'var(--muted)', width: 160 }}>
                    <span style={{ width: 68, textAlign: 'right' }}>{label}</span>
                    <div className="progress-bar" style={{ flex: 1 }}><span style={{ width: `${v}%` }} /></div>
                    <span style={{ width: 30, fontWeight: 750, color: '#4b6079' }}>{v}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 22, flexWrap: 'wrap' }}>
          <Button onClick={() => navigate('/dashboard')}>Go to dashboard</Button>
          <Button variant="secondary" onClick={() => navigate('/compare')}>Compare careers</Button>
          <Button variant="ghost" size="sm" onClick={handleReset}>Retake assessment</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="assessment-shell">
      <div className="assessment-top">
        <div>
          <h1>Career assessment</h1>
          <p>Answer each statement honestly — there are no right or wrong answers.</p>
        </div>
        <div className="assessment-count">
          {answeredCount} / {ASSESSMENT_QUESTION_COUNT} answered
        </div>
      </div>

      {/* Progress bar */}
      <div className="assessment-progress">
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      {/* Domain tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {QUESTION_GROUPS.map((group) => {
          const groupAnswered = group.questions.filter((q) => answers[q.id] !== undefined).length
          const isActive = group.domain === currentGroup?.domain
          return (
            <button
              key={group.domain}
              className={`choice-chip ${isActive ? 'is-selected' : ''}`}
              style={{ fontSize: '.72rem' }}
              onClick={() => {
                const firstQ = FLAT_QUESTIONS.findIndex((q) => q.domain === group.domain)
                if (firstQ >= 0) setCurrentIndex(firstQ)
              }}
            >
              {group.label} {groupAnswered}/{group.questions.length}
            </button>
          )
        })}
      </div>

      {/* Question card */}
      {current && (
        <div className="question-card">
          <div className="question-card__domain">{DOMAIN_LABELS[current.domain]} · Q{currentIndex + 1} of {ASSESSMENT_QUESTION_COUNT}</div>
          <h2>{current.prompt}</h2>
          {current.helperText && (
            <p style={{ color: 'var(--muted)', fontSize: '.82rem', marginBottom: 20, marginTop: -16 }}>{current.helperText}</p>
          )}
          <div className="rating-options">
            {current.options.map((option) => (
              <button
                key={option.value}
                className={`rating-option ${selectedValue === option.value ? 'is-selected' : ''}`}
                onClick={() => handleSelect(option.value)}
              >
                <div className="rating-option__number">{option.value}</div>
                <span className="rating-option__label">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="assessment-actions">
        <Button
          variant="secondary"
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
        >
          ← Previous
        </Button>
        {currentIndex < FLAT_QUESTIONS.length - 1 ? (
          <Button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={selectedValue === undefined}
          >
            Next →
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!allAnswered}>
            Submit assessment
          </Button>
        )}
      </div>

      {!allAnswered && currentIndex === FLAT_QUESTIONS.length - 1 && (
        <p className="assessment-save" style={{ color: '#e35050' }}>
          Answer all {ASSESSMENT_QUESTION_COUNT} questions to submit. {ASSESSMENT_QUESTION_COUNT - answeredCount} remaining.
        </p>
      )}

      <p className="assessment-save">Your answers are saved automatically as you go.</p>
    </div>
  )
}
