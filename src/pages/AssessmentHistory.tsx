import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button, EmptyState, ScoreBadge, Tag } from '../components/ui'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AssessmentHistory() {
  const { assessmentHistory } = useApp()

  return (
    <div>
      <div className="page-intro">
        <div>
          <h1 className="page-title">Assessment history</h1>
          <p className="page-subtitle">A record of all your past career assessment submissions.</p>
        </div>
        <div className="page-actions">
          <Link to="/assessment"><Button size="sm">Take new assessment</Button></Link>
        </div>
      </div>

      {assessmentHistory.length === 0 ? (
        <EmptyState
          title="No assessments yet"
          copy="Complete the career assessment to start building your history and tracking how your profile evolves over time."
          action={<Link to="/assessment"><Button size="sm">Start assessment</Button></Link>}
        />
      ) : (
        <div className="history-list">
          {assessmentHistory.map((record, index) => {
            const topMatch = record.recommendations[0]
            const isCurrent = index === 0
            return (
              <div key={record.id} className="history-item">
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                    <h3 style={{ margin: 0 }}>
                      Assessment #{assessmentHistory.length - index}
                    </h3>
                    {isCurrent && <Tag tone="teal">Current</Tag>}
                  </div>
                  <p style={{ marginBottom: 8 }}>Completed on {formatDate(record.completedAt)}</p>
                  {topMatch && (
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '.75rem', color: 'var(--muted)' }}>Top match:</span>
                      <strong style={{ fontSize: '.82rem' }}>{topMatch.career.name}</strong>
                      <ScoreBadge score={topMatch.overallScore} />
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                  {/* Dimension scores summary */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {record.recommendations.slice(0, 3).map((match) => (
                      <div key={match.careerId} style={{ textAlign: 'right' }}>
                        <Tag tone="slate">{match.career.name.length > 18 ? match.career.name.slice(0, 16) + '…' : match.career.name}</Tag>
                      </div>
                    ))}
                  </div>

                  {/* Profile dimensions summary */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, auto)', gap: '3px 12px' }}>
                    {Object.entries({
                      Interest: Object.keys(record.profile.interests).length,
                      Skill: Object.keys(record.profile.skills).length,
                      Personality: Object.keys(record.profile.personality).length,
                    }).map(([dim, count]) => (
                      <span key={dim} style={{ fontSize: '.68rem', color: 'var(--muted)' }}>
                        {dim}: {count} responses
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {assessmentHistory.length > 0 && (
        <div style={{ marginTop: 22, padding: 15, border: '1px solid #e0e7ef', borderRadius: 12, background: '#f8faff' }}>
          <p style={{ margin: 0, color: '#6a7e99', fontSize: '.78rem', lineHeight: 1.6 }}>
            <strong>How to read this:</strong> Each submission is based on your answers at that point in time. Retaking the assessment after gaining new skills or changing your preferences may produce different results. All scores are for guidance only.
          </p>
        </div>
      )}
    </div>
  )
}
