import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  Route,
  Target,
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Button, Card, EmptyState, ScoreBadge, SectionHeading, Tag } from '../components/ui'
import { CAREERS } from '../data/careers'
import { ASSESSMENT_QUESTION_COUNT } from '../data/questions'

function ProgressRing({ percent }: { percent: number }) {
  return (
    <div
      className="progress-ring"
      style={{ '--progress': `${percent}%` } as React.CSSProperties}
    >
      <strong>{percent}%</strong>
    </div>
  )
}

export default function Dashboard() {
  const {
    user,
    recommendations,
    assessmentProfile,
    primaryCareerId,
    savedCareerIds,
    roadmapProgress,
    answers,
    assessmentHistory,
  } = useApp()

  const primaryCareer = CAREERS.find((c) => c.id === primaryCareerId)
  const primaryMatch = recommendations.find((r) => r.careerId === primaryCareerId)
  const savedCareers = CAREERS.filter((c) => savedCareerIds.includes(c.id))

  // Roadmap progress for primary career
  const allRoadmapItems = primaryCareer?.roadmap.flatMap((p) => p.items) ?? []
  const completedCount = allRoadmapItems.filter((item) => roadmapProgress[item.id]).length
  const roadmapPercent = allRoadmapItems.length > 0 ? Math.round((completedCount / allRoadmapItems.length) * 100) : 0

  // Assessment progress
  const answeredCount = Object.keys(answers).length
  const assessmentPercent = Math.round((answeredCount / ASSESSMENT_QUESTION_COUNT) * 100)
  const hasAssessment = assessmentProfile !== null

  const firstName = user?.name.split(' ')[0] ?? 'there'

  return (
    <div>
      {/* Welcome banner */}
      <div className="dashboard-welcome">
        <div>
          <h1>Welcome back, {firstName} 👋</h1>
          <p>
            {hasAssessment
              ? `You have ${recommendations.length} career matches. Your top match is ${recommendations[0]?.career.name ?? 'being calculated'}.`
              : 'Complete the career assessment to unlock personalised matches and your roadmap.'}
          </p>
        </div>
        <div className="dashboard-welcome__status">
          <div style={{ fontSize: '.65rem', opacity: .7 }}>Assessment</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 850, marginTop: 3 }}>
            {hasAssessment ? '✓ Complete' : `${assessmentPercent}%`}
          </div>
          <div style={{ fontSize: '.65rem', opacity: .7, marginTop: 2 }}>{assessmentHistory.length} submitted</div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="dashboard-grid__wide">
        <div className="metric-card">
          <div className="metric-card__top">
            <span className="metric-card__label">Top match score</span>
            <div className="metric-card__icon"><Target size={15} /></div>
          </div>
          <div className="metric-card__value">
            {recommendations[0] ? `${recommendations[0].overallScore}%` : '—'}
          </div>
          <p className="metric-card__note">
            {recommendations[0] ? recommendations[0].career.name : 'Take the assessment to see matches'}
          </p>
        </div>
        <div className="metric-card">
          <div className="metric-card__top">
            <span className="metric-card__label">Roadmap progress</span>
            <div className="metric-card__icon"><Route size={15} /></div>
          </div>
          <div className="metric-card__value">{primaryCareer ? `${roadmapPercent}%` : '—'}</div>
          <p className="metric-card__note">
            {primaryCareer ? `${completedCount} / ${allRoadmapItems.length} tasks done` : 'Set a primary career to see your roadmap'}
          </p>
        </div>
        <div className="metric-card">
          <div className="metric-card__top">
            <span className="metric-card__label">Saved careers</span>
            <div className="metric-card__icon"><BriefcaseBusiness size={15} /></div>
          </div>
          <div className="metric-card__value">{savedCareerIds.length}</div>
          <p className="metric-card__note">
            {savedCareerIds.length > 0 ? savedCareers[0]?.name : 'Bookmark careers to compare later'}
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Left — Top matches */}
        <div>
          <SectionHeading
            eyebrow="Your recommendations"
            title="Top career matches"
            action={<Link to="/assessment"><Button variant="soft" size="sm">{hasAssessment ? 'Retake assessment' : 'Start assessment'}</Button></Link>}
          />

          {!hasAssessment ? (
            <EmptyState
              title="Take the career assessment"
              copy="Answer 36 reflective questions and get personalised career matches with skill-gap analysis and roadmaps."
              action={<Link to="/assessment"><Button size="sm">Start assessment</Button></Link>}
            />
          ) : (
            <div className="ranked-list">
              {recommendations.map((match, i) => (
                <div key={match.careerId} className="ranked-list__item">
                  <div className="ranked-list__rank">{i + 1}</div>
                  <div>
                    <span className="ranked-list__name">{match.career.name}</span>
                    <span className="ranked-list__category">{match.career.category}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                    <ScoreBadge score={match.overallScore} />
                    <Link to={`/careers/${match.career.slug}`} style={{ color: 'var(--primary)', fontSize: '.72rem', fontWeight: 750 }}>
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Primary career match hero */}
          {primaryMatch && (
            <div className="match-hero" style={{ marginTop: 20 }}>
              <div className="match-hero__top">
                <div>
                  <Tag tone="teal">Primary career</Tag>
                  <h2 style={{ margin: '5px 0 6px', fontSize: '1.34rem' }}>{primaryMatch.career.name}</h2>
                  <p style={{ margin: '0 0 16px', color: '#53677c', fontSize: '.84rem', lineHeight: 1.55 }}>
                    {primaryMatch.career.shortDescription}
                  </p>
                </div>
                <div className="match-hero__score">
                  {primaryMatch.overallScore}<span>%</span>
                </div>
              </div>
              <ul className="match-reason-list">
                {primaryMatch.reasons.slice(0, 3).map((r) => (
                  <li key={r}><CheckCircle2 size={14} /> {r}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', gap: 9, marginTop: 16, flexWrap: 'wrap' }}>
                <Link to={`/careers/${primaryMatch.career.slug}`}><Button size="sm">View full profile</Button></Link>
                <Link to="/my-plan"><Button variant="soft" size="sm"><Route size={13} /> View roadmap</Button></Link>
                <Link to="/compare"><Button variant="secondary" size="sm"><BarChart3 size={13} /> Compare</Button></Link>
              </div>
            </div>
          )}
        </div>

        {/* Right — Roadmap + Skill gaps */}
        <div>
          {/* Roadmap preview */}
          {primaryCareer ? (
            <Card style={{ marginBottom: 16 }}>
              <div className="profile-card__header">
                <h2>Roadmap progress</h2>
                <Link to="/my-plan"><Button variant="ghost" size="sm">View full plan</Button></Link>
              </div>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
                <ProgressRing percent={roadmapPercent} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '.9rem' }}>{primaryCareer.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '.75rem', marginTop: 3 }}>{completedCount} of {allRoadmapItems.length} tasks completed</div>
                </div>
              </div>
              <ul className="roadmap-preview">
                {allRoadmapItems.slice(0, 5).map((item) => {
                  const done = roadmapProgress[item.id]
                  return (
                    <li key={item.id} className="roadmap-preview__item">
                      <div className={`task-check ${done ? 'is-done' : ''}`}>
                        {done && <CheckCircle2 size={13} />}
                      </div>
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.kind}</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Card>
          ) : (
            <Card style={{ marginBottom: 16 }}>
              <EmptyState
                title="No primary career set"
                copy="Set a primary career to see your personalised roadmap here."
                action={<Link to="/careers"><Button size="sm">Explore careers</Button></Link>}
              />
            </Card>
          )}

          {/* Skill gaps */}
          {primaryMatch && primaryMatch.skillGaps.length > 0 && (
            <Card>
              <div className="profile-card__header">
                <h2>Top skill gaps</h2>
                <Link to={`/careers/${primaryMatch.career.slug}`}><Button variant="ghost" size="sm">Details</Button></Link>
              </div>
              {primaryMatch.skillGaps.slice(0, 4).map((gap) => (
                <div key={gap.id} className="skill-gap-row">
                  <div className="skill-gap-row__top">
                    <span>{gap.name}</span>
                    <span>{gap.currentLevel} / {gap.requiredLevel}</span>
                  </div>
                  <div className="progress-bar">
                    <span style={{ width: `${gap.currentLevel}%`, background: gap.gap > 20 ? '#e35050' : '#e3a020' }} />
                  </div>
                </div>
              ))}
            </Card>
          )}

          {/* Quick links */}
          <Card style={{ marginTop: 16 }}>
            <h3 style={{ marginBottom: 12, fontSize: '.95rem' }}>Quick actions</h3>
            {[
              { to: '/assessment', icon: BookOpenCheck, label: hasAssessment ? 'Retake assessment' : 'Start assessment', desc: '36 questions · ~10 min' },
              { to: '/compare', icon: BarChart3, label: 'Compare careers', desc: 'Side-by-side comparison' },
              { to: '/counsellor', icon: ArrowRight, label: 'Career counsellor', desc: 'Ask questions, get guidance' },
            ].map(({ to, icon: Icon, label, desc }) => (
              <Link key={to} to={to} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 0', borderTop: '1px solid #edf0f5', color: 'inherit' }}>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: '#eef2ff', color: 'var(--primary)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                  <Icon size={15} />
                </div>
                <div>
                  <div style={{ fontSize: '.84rem', fontWeight: 760 }}>{label}</div>
                  <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>{desc}</div>
                </div>
                <ArrowRight size={14} style={{ marginLeft: 'auto', color: 'var(--muted)' }} />
              </Link>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}
