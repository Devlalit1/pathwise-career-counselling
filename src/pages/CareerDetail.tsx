import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Bookmark, BriefcaseBusiness, GraduationCap, MapPin } from 'lucide-react'
import { CAREERS } from '../data/careers'
import { useApp } from '../context/AppContext'
import { Button, InlineNotice, ScoreBadge, Tag } from '../components/ui'

const KIND_LABEL: Record<string, string> = {
  learn: 'Learn',
  practice: 'Practice',
  project: 'Project',
  credential: 'Credential',
  prepare: 'Prepare',
}

const KIND_TONE: Record<string, 'slate' | 'blue' | 'teal' | 'amber' | 'violet'> = {
  learn: 'blue',
  practice: 'teal',
  project: 'amber',
  credential: 'violet',
  prepare: 'slate',
}

export default function CareerDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { isAuthenticated, savedCareerIds, toggleSavedCareer, setPrimaryCareer, primaryCareerId, recommendations } = useApp()

  const career = CAREERS.find((c) => c.slug === slug)

  if (!career) {
    return (
      <div className="page-section">
        <div className="page-container">
          <div className="empty-state">
            <h3>Career not found</h3>
            <p>This career pathway doesn't exist or the link may be broken.</p>
            <Link to="/careers"><Button size="sm">Browse all careers</Button></Link>
          </div>
        </div>
      </div>
    )
  }

  const isSaved = savedCareerIds.includes(career.id)
  const isPrimary = primaryCareerId === career.id
  const match = recommendations.find((r) => r.careerId === career.id)
  const relatedCareers = CAREERS.filter((c) => career.relatedCareerIds.includes(c.id)).slice(0, 3)

  return (
    <div className="page-section page-section--tight">
      <div className="page-container">
        {/* Back */}
        <button className="button button--ghost button--sm" style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={15} /> Back
        </button>

        {/* Hero */}
        <div className="career-detail-hero">
          <div className="career-detail-hero__top">
            <div className="career-detail-hero__identity">
              <div className="career-card__icon" style={{ width: 50, height: 50, borderRadius: 15 }}>
                <BriefcaseBusiness size={24} />
              </div>
              <div>
                <Tag tone="blue">{career.category}</Tag>
                <h1 style={{ margin: '7px 0 7px', fontSize: 'clamp(1.7rem, 3vw, 2.4rem)' }}>{career.name}</h1>
                <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Tag tone={career.difficulty === 'Foundation' ? 'teal' : career.difficulty === 'Intermediate' ? 'amber' : 'rose'}>
                    {career.difficulty}
                  </Tag>
                  <Tag tone={career.demand.level === 'Strong' ? 'teal' : career.demand.level === 'Moderate' ? 'amber' : 'slate'}>
                    {career.demand.level} demand
                  </Tag>
                  {match && <ScoreBadge score={match.overallScore} />}
                </div>
              </div>
            </div>
            <div className="career-detail-hero__actions">
              {isAuthenticated && (
                <>
                  <button
                    className={`button button--secondary button--sm career-card__bookmark ${isSaved ? 'is-saved' : ''}`}
                    style={{ minWidth: 'auto' }}
                    onClick={() => toggleSavedCareer(career.id)}
                  >
                    <Bookmark size={14} fill={isSaved ? 'currentColor' : 'none'} />
                    {isSaved ? 'Saved' : 'Save'}
                  </button>
                  {!isPrimary && (
                    <Button size="sm" onClick={() => setPrimaryCareer(career.id)}>
                      Set as my primary career
                    </Button>
                  )}
                  {isPrimary && (
                    <Tag tone="teal">★ Primary career</Tag>
                  )}
                </>
              )}
              {!isAuthenticated && (
                <Link to="/register"><Button size="sm">Get your match score</Button></Link>
              )}
            </div>
          </div>
          <p className="career-detail-hero__summary">{career.overview}</p>
        </div>

        {/* Demo disclaimer */}
        <InlineNotice tone="warning">
          {career.salary.disclaimer}
        </InlineNotice>

        {/* Main grid */}
        <div className="career-detail-grid" style={{ marginTop: 20 }}>
          {/* Left column */}
          <div>
            {/* What you do */}
            <div className="detail-section">
              <h2>What you'll do</h2>
              <ul className="detail-list">
                {career.whatYouDo.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            {/* Why choose */}
            <div className="detail-section">
              <h2>Why choose this path</h2>
              <ul className="detail-list">
                {career.whyChoose.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>

            {/* Skills */}
            <div className="detail-section">
              <h2>Skills you'll build</h2>
              <h3>Technical skills</h3>
              <div className="skill-cloud">
                {career.technicalSkills.map((s) => <Tag key={s} tone="blue">{s}</Tag>)}
              </div>
              <h3>Soft skills</h3>
              <div className="skill-cloud">
                {career.softSkills.map((s) => <Tag key={s} tone="teal">{s}</Tag>)}
              </div>
            </div>

            {/* Roadmap */}
            <div className="detail-section">
              <h2>Learning roadmap</h2>
              <div className="roadmap-timeline">
                {career.roadmap.map((phase) => (
                  <div key={phase.id} className="roadmap-phase">
                    <div className="roadmap-phase__dot" />
                    <h3>{phase.title}</h3>
                    <p>{phase.description}</p>
                    {phase.items.map((item) => (
                      <div key={item.id} className="roadmap-task">
                        <Tag tone={KIND_TONE[item.kind] ?? 'slate'}>{KIND_LABEL[item.kind] ?? item.kind}</Tag>
                        <div>
                          <strong>{item.title}</strong>
                          {item.description && <span>{item.description}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Career progression */}
            {career.progression.length > 0 && (
              <div className="detail-section">
                <h2>Career progression</h2>
                {career.progression.map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 8, background: '#eef2ff', color: 'var(--primary)', display: 'grid', placeItems: 'center', fontSize: '.72rem', fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                    <div>
                      <strong style={{ fontSize: '.88rem' }}>{step.title}</strong>
                      <p style={{ margin: '3px 0 0', color: 'var(--muted)', fontSize: '.82rem', lineHeight: 1.55 }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Match breakdown (if logged in) */}
            {match && (
              <div className="detail-section">
                <h2>Your match breakdown</h2>
                {[
                  { label: 'Interest fit', score: match.interestScore },
                  { label: 'Skill fit', score: match.skillScore },
                  { label: 'Personality fit', score: match.personalityScore },
                  { label: 'Academic fit', score: match.academicScore },
                  { label: 'Values fit', score: match.valueScore },
                  { label: 'Work preference fit', score: match.workPreferenceScore },
                ].map(({ label, score }) => (
                  <div key={label} className="skill-gap-row">
                    <div className="skill-gap-row__top">
                      <span>{label}</span>
                      <span>{score}%</span>
                    </div>
                    <div className="progress-bar"><span style={{ width: `${score}%` }} /></div>
                  </div>
                ))}
                {match.skillGaps.length > 0 && (
                  <>
                    <h3 style={{ marginTop: 18 }}>Skill gaps to close</h3>
                    {match.skillGaps.map((gap) => (
                      <div key={gap.id} className="skill-gap-row">
                        <div className="skill-gap-row__top">
                          <span>{gap.name}</span>
                          <span style={{ color: '#e35050' }}>{gap.currentLevel} → {gap.requiredLevel}</span>
                        </div>
                        <div className="progress-bar"><span style={{ width: `${gap.currentLevel}%`, background: '#e35050' }} /></div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right column – facts sidebar */}
          <div>
            <div className="detail-facts" style={{ marginBottom: 16 }}>
              <h3>Key facts</h3>
              <div className="detail-fact">
                <span>Salary range</span>
                <strong>{career.salary.range}</strong>
              </div>
              <div className="detail-fact">
                <span>Demand</span>
                <strong>{career.demand.level}</strong>
              </div>
              <div className="detail-fact">
                <span>Difficulty</span>
                <strong>{career.difficulty}</strong>
              </div>
              <div className="detail-fact">
                <span>Remote potential</span>
                <strong>{career.remoteWorkPotential}</strong>
              </div>
              <div className="detail-fact">
                <span>Work-life balance</span>
                <strong>{career.workLifeBalance}</strong>
              </div>
              <div className="detail-fact">
                <span>Growth outlook</span>
                <strong>{career.growthOutlook}</strong>
              </div>
              {career.governmentOpportunities && (
                <div className="detail-fact">
                  <span>Govt. opportunities</span>
                  <strong>{career.governmentOpportunities}</strong>
                </div>
              )}
              <p className="demo-disclaimer">{career.salary.disclaimer}</p>
            </div>

            {/* Education */}
            <div className="detail-facts" style={{ marginBottom: 16 }}>
              <h3><GraduationCap size={15} style={{ verticalAlign: 'middle', marginRight: 5 }} />Education</h3>
              <div className="detail-fact">
                <span>Typical path</span>
                <strong>{career.education}</strong>
              </div>
              {career.entranceExams.length > 0 && (
                <div className="detail-fact">
                  <span>Entrance exams</span>
                  <strong>{career.entranceExams.join(', ')}</strong>
                </div>
              )}
              {career.certifications.length > 0 && (
                <div className="detail-fact">
                  <span>Certifications</span>
                  <div className="skill-cloud" style={{ marginTop: 5 }}>
                    {career.certifications.map((cert) => <Tag key={cert} tone="violet">{cert}</Tag>)}
                  </div>
                </div>
              )}
              {career.courses.length > 0 && (
                <div className="detail-fact">
                  <span>Suggested courses</span>
                  <ul className="detail-list" style={{ paddingLeft: 14, marginTop: 5 }}>
                    {career.courses.map((course) => <li key={course} style={{ fontSize: '.77rem' }}>{course}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Related careers */}
            {relatedCareers.length > 0 && (
              <div className="detail-facts">
                <h3>Related careers</h3>
                {relatedCareers.map((rel) => (
                  <div key={rel.id} className="detail-fact">
                    <Link to={`/careers/${rel.slug}`} style={{ display: 'flex', gap: 9, alignItems: 'center', color: 'var(--primary)', fontSize: '.84rem', fontWeight: 750 }}>
                      <MapPin size={13} /> {rel.name}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
