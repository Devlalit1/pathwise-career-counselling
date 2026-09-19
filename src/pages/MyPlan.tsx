import { Link } from 'react-router-dom'
import { CheckCircle2, Circle } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { CAREERS } from '../data/careers'
import { Button, EmptyState, InlineNotice, Tag } from '../components/ui'

const KIND_TONE: Record<string, 'slate' | 'blue' | 'teal' | 'amber' | 'violet'> = {
  learn: 'blue',
  practice: 'teal',
  project: 'amber',
  credential: 'violet',
  prepare: 'slate',
}

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

export default function MyPlan() {
  const { primaryCareerId, setPrimaryCareer, savedCareerIds, recommendations, roadmapProgress, toggleRoadmapItem } = useApp()

  const primaryCareer = CAREERS.find((c) => c.id === primaryCareerId)
  const primaryMatch = recommendations.find((r) => r.careerId === primaryCareerId)
  const savedCareers = CAREERS.filter((c) => savedCareerIds.includes(c.id))

  const allItems = primaryCareer?.roadmap.flatMap((p) => p.items) ?? []
  const completedCount = allItems.filter((item) => roadmapProgress[item.id]).length
  const percent = allItems.length > 0 ? Math.round((completedCount / allItems.length) * 100) : 0

  if (!primaryCareer) {
    return (
      <div>
        <h1 className="page-title">My career plan</h1>
        <p className="page-subtitle">Set a primary career to see your personalised roadmap and track your progress.</p>
        <EmptyState
          title="No primary career selected"
          copy="Save and set a primary career from the career explorer or your dashboard to build your roadmap here."
          action={<Link to="/careers"><Button size="sm">Explore careers</Button></Link>}
        />
        {savedCareers.length > 0 && (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ marginBottom: 12, fontSize: '.95rem' }}>Your saved careers</h3>
            <div style={{ display: 'grid', gap: 9 }}>
              {savedCareers.map((career) => (
                <div key={career.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 15px', border: '1px solid #e0e7f1', borderRadius: 12, background: '#fff' }}>
                  <div>
                    <strong style={{ fontSize: '.88rem' }}>{career.name}</strong>
                    <span style={{ display: 'block', color: 'var(--muted)', fontSize: '.73rem' }}>{career.category}</span>
                  </div>
                  <Button size="sm" onClick={() => setPrimaryCareer(career.id)}>Set as primary</Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      {/* Plan hero */}
      <div className="plan-hero">
        <div className="plan-hero__career">
          <ProgressRing percent={percent} />
          <div>
            <Tag tone="teal">Primary career</Tag>
            <h2 style={{ margin: '4px 0', fontSize: '1.22rem' }}>{primaryCareer.name}</h2>
            <p style={{ margin: 0, color: 'var(--muted)', fontSize: '.8rem' }}>
              {completedCount} of {allItems.length} roadmap tasks completed
              {primaryMatch && ` · ${primaryMatch.overallScore}% match`}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
          {savedCareers.length > 1 && (
            <div className="field" style={{ minWidth: 220 }}>
              <select
                className="select-control"
                value={primaryCareerId ?? ''}
                onChange={(e) => e.target.value && setPrimaryCareer(e.target.value)}
                aria-label="Switch primary career"
              >
                {savedCareers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          )}
          <Link to={`/careers/${primaryCareer.slug}`}>
            <Button variant="secondary" size="sm">View career profile</Button>
          </Link>
        </div>
      </div>

      {/* Skill gaps notice */}
      {primaryMatch && primaryMatch.skillGaps.length > 0 && (
        <InlineNotice tone="info">
          Your top skill gaps for this path: <strong>{primaryMatch.skillGaps.slice(0, 3).map((g) => g.name).join(', ')}</strong>. Work through the roadmap tasks to close them.
        </InlineNotice>
      )}

      {/* Roadmap */}
      <div className="roadmap-timeline" style={{ marginTop: 22 }}>
        {primaryCareer.roadmap.map((phase) => {
          const phaseItems = phase.items
          const phaseCompleted = phaseItems.filter((item) => roadmapProgress[item.id]).length
          const phasePercent = phaseItems.length > 0 ? Math.round((phaseCompleted / phaseItems.length) * 100) : 0
          return (
            <div key={phase.id} className="roadmap-phase">
              <div className="roadmap-phase__dot" />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 3 }}>
                <h3 style={{ margin: 0, fontSize: '.95rem' }}>{phase.title}</h3>
                <span style={{ color: phasePercent === 100 ? 'var(--teal)' : 'var(--muted)', fontSize: '.72rem', fontWeight: 750, flexShrink: 0 }}>
                  {phaseCompleted}/{phaseItems.length} done
                </span>
              </div>
              <p style={{ margin: '0 0 10px', color: 'var(--muted)', fontSize: '.78rem' }}>{phase.description}</p>
              {phaseItems.map((item) => {
                const done = roadmapProgress[item.id] ?? false
                return (
                  <button
                    key={item.id}
                    className={`roadmap-task ${done ? 'is-done' : ''}`}
                    style={{ width: '100%', border: '1px solid #ebeff3', borderRadius: 9, cursor: 'pointer', textAlign: 'left' }}
                    onClick={() => toggleRoadmapItem(item.id)}
                    aria-label={`${done ? 'Unmark' : 'Mark'} "${item.title}" as ${done ? 'incomplete' : 'complete'}`}
                  >
                    {done
                      ? <CheckCircle2 size={18} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                      : <Circle size={18} style={{ color: '#b4c1d3', flexShrink: 0 }} />}
                    <div>
                      <strong>{item.title}</strong>
                      {item.description && <span>{item.description}</span>}
                    </div>
                    <Tag tone={KIND_TONE[item.kind] ?? 'slate'} style={{ marginLeft: 'auto', flexShrink: 0 }}>
                      {item.kind}
                    </Tag>
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>

      {/* Certifications & exams */}
      {(primaryCareer.certifications.length > 0 || primaryCareer.entranceExams.length > 0) && (
        <div className="card" style={{ marginTop: 22 }}>
          <h3 style={{ marginBottom: 14, fontSize: '.95rem' }}>Certifications & entrance exams</h3>
          {primaryCareer.certifications.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '.78rem', fontWeight: 750 }}>CERTIFICATIONS</p>
              <div className="skill-cloud">
                {primaryCareer.certifications.map((cert) => <Tag key={cert} tone="violet">{cert}</Tag>)}
              </div>
            </div>
          )}
          {primaryCareer.entranceExams.length > 0 && (
            <div>
              <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: '.78rem', fontWeight: 750 }}>ENTRANCE EXAMS</p>
              <div className="skill-cloud">
                {primaryCareer.entranceExams.map((exam) => <Tag key={exam} tone="amber">{exam}</Tag>)}
              </div>
            </div>
          )}
          <InlineNotice tone="warning">
            Requirements change frequently. Verify current exam patterns, eligibility, and certification validity with official sources.
          </InlineNotice>
        </div>
      )}
    </div>
  )
}
