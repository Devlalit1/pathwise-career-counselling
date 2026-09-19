import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts'
import { X } from 'lucide-react'
import { CAREERS } from '../data/careers'
import { useApp } from '../context/AppContext'
import { Button, EmptyState, InlineNotice, Tag } from '../components/ui'
import type { CareerMatch } from '../types'

const MAX_COMPARE = 3

export default function CompareCarers() {
  const { recommendations } = useApp()
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    // Pre-fill with top 2 recommendations if available
    return recommendations.slice(0, 2).map((r) => r.careerId)
  })

  const scoreMap = useMemo(() => {
    const map: Record<string, CareerMatch> = {}
    for (const r of recommendations) map[r.careerId] = r
    return map
  }, [recommendations])

  const selectedCareers = selectedIds.map((id) => CAREERS.find((c) => c.id === id)).filter(Boolean) as typeof CAREERS[0][]

  function addCareer(id: string) {
    if (selectedIds.includes(id) || selectedIds.length >= MAX_COMPARE) return
    setSelectedIds((prev) => [...prev, id])
  }

  function removeCareer(id: string) {
    setSelectedIds((prev) => prev.filter((i) => i !== id))
  }

  // Chart data — radar
  const SCORE_KEYS: Record<string, keyof CareerMatch> = {
    Interest: 'interestScore',
    Skill: 'skillScore',
    Personality: 'personalityScore',
    Academic: 'academicScore',
    Values: 'valueScore',
    'Work Prefs': 'workPreferenceScore',
  }
  const radarData = Object.keys(SCORE_KEYS).map((dim) => {
    const key = SCORE_KEYS[dim]
    const entry: Record<string, string | number> = { dimension: dim }
    for (const id of selectedIds) {
      const match = scoreMap[id]
      if (match) {
        const career = CAREERS.find((c) => c.id === id)
        entry[career?.name ?? id] = (match[key] as number) ?? 50
      }
    }
    return entry
  })

  // Chart data — bar
  const barData = selectedCareers.map((career) => {
    const match = scoreMap[career.id]
    return {
      name: career.name.length > 16 ? career.name.slice(0, 14) + '…' : career.name,
      'Overall': match?.overallScore ?? 0,
      'Interest': match?.interestScore ?? 0,
      'Skill': match?.skillScore ?? 0,
      'Personality': match?.personalityScore ?? 0,
    }
  })

  const COLORS = ['#243b8e', '#0f8f81', '#a96508']
  const RADAR_COLORS = ['#243b8e', '#0f8f81', '#a96508']

  return (
    <div>
      <div className="page-intro">
        <div>
          <h1 className="page-title">Compare careers</h1>
          <p className="page-subtitle">Select up to 3 careers to compare side-by-side. Match scores appear if you've completed the assessment.</p>
        </div>
      </div>

      {/* Picker */}
      <div className="compare-picker">
        {Array.from({ length: MAX_COMPARE }, (_, i) => {
          const id = selectedIds[i]
          const career = id ? CAREERS.find((c) => c.id === id) : null
          return (
            <div key={i} className="compare-slot">
              <label>Career {i + 1}</label>
              {career ? (
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ flex: 1, padding: '9px 11px', border: '1px solid #d0dbef', borderRadius: 9, fontSize: '.84rem', fontWeight: 750 }}>
                    {career.name}
                  </div>
                  <button className="icon-button" onClick={() => removeCareer(id!)} aria-label="Remove">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <select
                  className="select-control"
                  value=""
                  onChange={(e) => e.target.value && addCareer(e.target.value)}
                >
                  <option value="">Select a career…</option>
                  {CAREERS.filter((c) => !selectedIds.includes(c.id)).map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>

      {selectedCareers.length === 0 && (
        <EmptyState
          title="No careers selected"
          copy="Choose up to 3 careers from the dropdowns above to start comparing."
        />
      )}

      {selectedCareers.length > 0 && (
        <>
          {/* Charts */}
          {recommendations.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div className="card">
                <h3 style={{ marginBottom: 16, fontSize: '.95rem' }}>Match scores overview</h3>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#edf0f5" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend iconSize={10} />
                      {['Overall', 'Interest', 'Skill'].map((key, i) => (
                        <Bar key={key} dataKey={key} fill={COLORS[i]} radius={[3, 3, 0, 0]} />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card">
                <h3 style={{ marginBottom: 16, fontSize: '.95rem' }}>Dimension radar</h3>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#edf0f5" />
                      <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                      {selectedCareers.map((career, i) => (
                        <Radar
                          key={career.id}
                          name={career.name}
                          dataKey={career.name}
                          stroke={RADAR_COLORS[i]}
                          fill={RADAR_COLORS[i]}
                          fillOpacity={0.12}
                        />
                      ))}
                      <Legend iconSize={10} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          ) : (
            <InlineNotice tone="info">
              Complete the career assessment to see match scores in the charts above.{' '}
              <Link to="/assessment" className="text-link">Start assessment →</Link>
            </InlineNotice>
          )}

          {/* Comparison table */}
          <div className="comparison-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Attribute</th>
                  {selectedCareers.map((career) => <th key={career.id}>{career.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {recommendations.length > 0 && (
                  <tr>
                    <td>Match score</td>
                    {selectedCareers.map((career) => {
                      const match = scoreMap[career.id]
                      return <td key={career.id}>{match ? <span style={{ fontWeight: 800, color: 'var(--teal)' }}>{match.overallScore}%</span> : '—'}</td>
                    })}
                  </tr>
                )}
                <tr>
                  <td>Category</td>
                  {selectedCareers.map((c) => <td key={c.id}><Tag tone="blue">{c.category}</Tag></td>)}
                </tr>
                <tr>
                  <td>Difficulty</td>
                  {selectedCareers.map((c) => <td key={c.id}>{c.difficulty}</td>)}
                </tr>
                <tr>
                  <td>Demand</td>
                  {selectedCareers.map((c) => <td key={c.id}>{c.demand.level}</td>)}
                </tr>
                <tr>
                  <td>Salary (illustrative)</td>
                  {selectedCareers.map((c) => <td key={c.id}>{c.salary.range}</td>)}
                </tr>
                <tr>
                  <td>Remote potential</td>
                  {selectedCareers.map((c) => <td key={c.id}>{c.remoteWorkPotential}</td>)}
                </tr>
                <tr>
                  <td>Work-life balance</td>
                  {selectedCareers.map((c) => <td key={c.id}>{c.workLifeBalance}</td>)}
                </tr>
                <tr>
                  <td>Growth outlook</td>
                  {selectedCareers.map((c) => <td key={c.id}>{c.growthOutlook}</td>)}
                </tr>
                <tr>
                  <td>Technical skills</td>
                  {selectedCareers.map((c) => (
                    <td key={c.id}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.technicalSkills.slice(0, 4).map((s) => <Tag key={s} tone="slate">{s}</Tag>)}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Soft skills</td>
                  {selectedCareers.map((c) => (
                    <td key={c.id}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {c.softSkills.slice(0, 3).map((s) => <Tag key={s} tone="teal">{s}</Tag>)}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td>Education</td>
                  {selectedCareers.map((c) => <td key={c.id}>{c.education}</td>)}
                </tr>
                <tr>
                  <td>Govt. opportunities</td>
                  {selectedCareers.map((c) => <td key={c.id}>{c.governmentOpportunities || 'N/A'}</td>)}
                </tr>
                <tr>
                  <td>Skill gaps (yours)</td>
                  {selectedCareers.map((c) => {
                    const match = scoreMap[c.id]
                    return (
                      <td key={c.id}>
                        {match?.skillGaps.length ? (
                          match.skillGaps.slice(0, 3).map((g) => (
                            <div key={g.id} style={{ fontSize: '.72rem', color: '#e35050', marginBottom: 2 }}>
                              {g.name}
                            </div>
                          ))
                        ) : recommendations.length > 0 ? '✓ No major gaps' : '—'}
                      </td>
                    )
                  })}
                </tr>
                <tr>
                  <td>Actions</td>
                  {selectedCareers.map((c) => (
                    <td key={c.id}>
                      <Link to={`/careers/${c.slug}`}><Button size="sm">View details</Button></Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 10, color: 'var(--muted)', fontSize: '.72rem' }}>
            All salary and demand data is illustrative. Verify current information with employers and institutions.
          </p>
        </>
      )}
    </div>
  )
}
