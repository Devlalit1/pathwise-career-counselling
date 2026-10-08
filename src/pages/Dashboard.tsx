import { ArrowRight, BookOpen, CheckCircle2, Compass, Star, Target, TrendingUp, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Button, EmptyState, ProgressRing, Skeleton } from '../components/ui'
import { useApp } from '../context/AppContext'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user, recommendations, assessmentProfile, roadmapProgress, savedCareerIds, assessmentHistory } = useApp()


  const isLoading = false // would be true during API fetch
  const hasAssessment = assessmentProfile !== null && recommendations.length > 0
  const topMatch = recommendations[0] ?? null
  const totalTasks = 8 // would come from roadmap data
  const doneTasks = Object.values(roadmapProgress).filter(Boolean).length

  // Chart data from recommendations
  const chartData = recommendations.slice(0, 8).map((r) => ({
    name: r.career.name.length > 14 ? r.career.name.slice(0, 13) + '…' : r.career.name,
    score: r.overallScore,
  }))

  const scoreBreakdown = topMatch
    ? [
        { label: 'Interests', value: topMatch.interestScore },
        { label: 'Skills', value: topMatch.skillScore },
        { label: 'Personality', value: topMatch.personalityScore },
        { label: 'Academic', value: topMatch.academicScore },
        { label: 'Values', value: topMatch.valueScore },
        { label: 'Work prefs', value: topMatch.workPreferenceScore },
      ]
    : []

  return (
    <div className="app-content animate-fade-in">
      {/* Welcome banner */}
      <div className="dashboard-welcome animate-slide-up">
        <div>
          <h1>
            {getGreeting()}, {user?.name?.split(' ')[0] ?? 'there'}! 👋
          </h1>
          <p>
            {hasAssessment
              ? `You have ${recommendations.length} career matches. Your top match is ${topMatch?.career.name} at ${topMatch?.overallScore}% fit.`
              : 'Complete the assessment to get your personalised career matches and a step-by-step roadmap.'}
          </p>
          {!hasAssessment && (
            <div style={{ marginTop: 14 }}>
              <Link to="/assessment">
                <Button variant="secondary" size="sm" style={{ color: '#fff', borderColor: 'rgba(255,255,255,.3)', background: 'rgba(255,255,255,.12)' }}>
                  Start assessment <ArrowRight size={14} />
                </Button>
              </Link>
            </div>
          )}
        </div>
        <div className="dashboard-welcome__status">
          <div style={{ fontSize: '.68rem', marginBottom: 3, opacity: .75 }}>Account status</div>
          <div style={{ fontWeight: 780, fontSize: '.8rem' }}>{hasAssessment ? '✓ Assessment complete' : '○ Assessment pending'}</div>
          <div style={{ fontSize: '.68rem', marginTop: 4, opacity: .7 }}>{savedCareerIds.length} saved · {assessmentHistory.length} assessment{assessmentHistory.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      {/* Metrics row */}
      <div className="dashboard-grid__wide animate-slide-up delay-100">
        {isLoading ? (
          <>
            <Skeleton className="skeleton--card" />
            <Skeleton className="skeleton--card" />
            <Skeleton className="skeleton--card" />
          </>
        ) : (
          <>
            <div className="metric-card">
              <div className="metric-card__top">
                <span className="metric-card__label">Top match score</span>
                <span className="metric-card__icon"><Star size={16} /></span>
              </div>
              <div className="metric-card__value">{topMatch ? `${topMatch.overallScore}%` : '—'}</div>
              <p className="metric-card__note">{topMatch ? topMatch.career.name : 'Complete assessment to see matches'}</p>
            </div>

            <div className="metric-card">
              <div className="metric-card__top">
                <span className="metric-card__label">Careers matched</span>
                <span className="metric-card__icon"><Compass size={16} /></span>
              </div>
              <div className="metric-card__value">{recommendations.length}</div>
              <p className="metric-card__note">{savedCareerIds.length} saved to my list</p>
            </div>

            <div className="metric-card">
              <div className="metric-card__top">
                <span className="metric-card__label">Plan progress</span>
                <span className="metric-card__icon"><Target size={16} /></span>
              </div>
              <div className="metric-card__value">{totalTasks ? `${doneTasks}/${totalTasks}` : '—'}</div>
              <p className="metric-card__note">roadmap tasks complete</p>
            </div>
          </>
        )}
      </div>

      {hasAssessment ? (
        <div className="dashboard-grid animate-slide-up delay-200">
          {/* Main column */}
          <div>
            {/* Top match hero */}
            {topMatch && (
              <div className="match-hero" style={{ marginBottom: 18 }}>
                <div className="match-hero__top">
                  <div>
                    <p className="eyebrow">Your #1 match</p>
                    <h2>{topMatch.career.name}</h2>
                    <p>{topMatch.career.shortDescription}</p>
                  </div>
                  <div className="match-hero__score">
                    {topMatch.overallScore}<span>% fit</span>
                  </div>
                </div>
                <ul className="match-reason-list">
                  {topMatch.reasons.slice(0, 3).map((r) => (
                    <li key={r}>
                      <CheckCircle2 size={14} /> {r}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 14, display: 'flex', gap: 9 }}>
                  <Link to={`/careers/${topMatch.career.slug}`}>
                    <Button variant="primary" size="sm">View career details</Button>
                  </Link>
                  <Link to="/plan">
                    <Button variant="secondary" size="sm">My roadmap</Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Match chart */}
            {chartData.length > 0 && (
              <div className="card" style={{ marginBottom: 18 }}>
                <div className="profile-card__header">
                  <h2>All career matches</h2>
                  <Link to="/dashboard" style={{ fontSize: '.8rem', color: 'var(--primary)', fontWeight: 760 }}>See all</Link>
                </div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} barSize={22} margin={{ top: 4, right: 4, bottom: 4, left: -18 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#edf0f5" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8290a3' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#8290a3' }} />
                      <Tooltip
                        formatter={(v) => [`${v}%`, 'Match score']}
                        contentStyle={{ fontSize: '.78rem', borderRadius: 8, border: '1px solid #e0e7f2' }}
                      />
                      <Bar dataKey="score" radius={[5, 5, 0, 0]}>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={i === 0 ? '#0f8f81' : i < 3 ? '#243b8e' : '#93aad8'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Skill gaps */}
            {topMatch && topMatch.skillGaps.length > 0 && (
              <div className="card">
                <div className="profile-card__header">
                  <h2>Top skill gaps for {topMatch.career.name}</h2>
                </div>
                {topMatch.skillGaps.slice(0, 4).map((gap) => (
                  <div key={gap.id} className="skill-gap-row">
                    <div className="skill-gap-row__top">
                      <span>{gap.name}</span>
                      <span>Level {gap.currentLevel}/5 → need {gap.requiredLevel}/5</span>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: `${(gap.currentLevel / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Progress ring */}
            <div className="card" style={{ marginBottom: 18, textAlign: 'center', padding: 24 }}>
              <p className="eyebrow" style={{ marginBottom: 14 }}>Roadmap progress</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                <div style={{ position: 'relative', display: 'inline-grid', placeItems: 'center' }}>
                  <ProgressRing pct={totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0} size={88} stroke={8} />
                  <span style={{ position: 'absolute', color: '#0a766b', fontWeight: 800, fontSize: '.95rem' }}>
                    {totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0}%
                  </span>
                </div>
              </div>
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '.8rem' }}>
                {doneTasks} of {totalTasks} tasks done
              </p>
              <div style={{ marginTop: 14 }}>
                <Link to="/plan">
                  <Button variant="soft" size="sm" style={{ width: '100%' }}>
                    <BookOpen size={14} /> Open my plan
                  </Button>
                </Link>
              </div>
            </div>

            {/* Score breakdown */}
            {topMatch && (
              <div className="card" style={{ marginBottom: 18 }}>
                <div className="profile-card__header">
                  <h2>Score breakdown</h2>
                  <span style={{ fontSize: '.74rem', color: 'var(--muted)' }}>Top match</span>
                </div>
                {scoreBreakdown.map((d) => (
                  <div key={d.label} className="skill-gap-row">
                    <div className="skill-gap-row__top">
                      <span>{d.label}</span>
                      <span>{d.value}%</span>
                    </div>
                    <div className="progress-bar">
                      <span style={{ width: `${d.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick links */}
            <div className="card">
              <div className="profile-card__header">
                <h2>Quick actions</h2>
              </div>
              <div style={{ display: 'grid', gap: 8 }}>
                {[
                  { to: '/assessment', label: 'Retake assessment', icon: Zap },
                  { to: '/careers', label: 'Browse all careers', icon: Compass },
                  { to: '/compare', label: 'Compare careers', icon: TrendingUp },
                  { to: '/goals', label: 'Set a goal', icon: Target },
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 9,
                      padding: '8px 10px',
                      borderRadius: 9,
                      color: '#42536a',
                      fontSize: '.83rem',
                      fontWeight: 720,
                      transition: 'background var(--transition-fast)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f5fb')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <Icon size={15} style={{ color: 'var(--primary)' }} />
                    {label}
                    <ArrowRight size={13} style={{ marginLeft: 'auto', opacity: .5 }} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up delay-200">
          <EmptyState
            icon={<Compass size={22} />}
            title="Your dashboard is ready"
            copy="Complete the 36-question assessment to get your personalised career matches, skill gap analysis, and a step-by-step roadmap."
            action={
              <Link to="/assessment">
                <Button variant="primary" size="md">
                  <Zap size={15} /> Start the assessment
                </Button>
              </Link>
            }
          />
        </div>
      )}
    </div>
  )
}
