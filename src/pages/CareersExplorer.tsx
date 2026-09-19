import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, BriefcaseBusiness, Search } from 'lucide-react'
import { CAREERS } from '../data/careers'
import { useApp } from '../context/AppContext'
import { Button, ScoreBadge, Tag } from '../components/ui'
import type { CareerCategory, DemandLevel, DifficultyLevel } from '../types'

const CATEGORIES = [...new Set(CAREERS.map((c) => c.category))].sort() as CareerCategory[]
const DIFFICULTIES: DifficultyLevel[] = ['Foundation', 'Intermediate', 'Advanced']
const DEMANDS: DemandLevel[] = ['Emerging', 'Moderate', 'Strong']

export default function CareersExplorer() {
  const { isAuthenticated, savedCareerIds, toggleSavedCareer, recommendations } = useApp()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [demand, setDemand] = useState('')

  const scoreMap = useMemo(() => {
    const map: Record<string, number> = {}
    for (const r of recommendations) map[r.careerId] = r.overallScore
    return map
  }, [recommendations])

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return CAREERS.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !c.shortDescription.toLowerCase().includes(q) && !c.category.toLowerCase().includes(q)) return false
      if (category && c.category !== category) return false
      if (difficulty && c.difficulty !== difficulty) return false
      if (demand && c.demand.level !== demand) return false
      return true
    })
  }, [search, category, difficulty, demand])

  return (
    <div className="page-section page-section--tight">
      <div className="page-container">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Career library</p>
            <h2>Explore careers</h2>
            <p className="section-heading__copy">Browse {CAREERS.length}+ career pathways. Filter by area, difficulty, or demand to find your fit.</p>
          </div>
          {!isAuthenticated && (
            <div className="section-heading__action">
              <Link to="/register"><Button size="sm">Take assessment for matches</Button></Link>
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="catalogue-toolbar">
          <div className="search-field">
            <Search size={16} />
            <input
              type="search"
              placeholder="Search careers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search careers"
            />
          </div>
          <div className="field">
            <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by category">
              <option value="">All categories</option>
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="field">
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} aria-label="Filter by difficulty">
              <option value="">All difficulty levels</option>
              {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div className="field">
            <select value={demand} onChange={(e) => setDemand(e.target.value)} aria-label="Filter by demand">
              <option value="">All demand levels</option>
              {DEMANDS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <p className="catalogue-count">Showing {filtered.length} of {CAREERS.length} careers</p>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state__mark"><BriefcaseBusiness size={22} /></div>
            <h3>No careers found</h3>
            <p>Try adjusting your search or filters.</p>
            <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setCategory(''); setDifficulty(''); setDemand('') }}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="career-card-grid">
            {filtered.map((career) => {
              const isSaved = savedCareerIds.includes(career.id)
              const score = scoreMap[career.id]
              return (
                <div key={career.id} className="career-card">
                  <div className="career-card__top">
                    <div className="career-card__icon"><BriefcaseBusiness size={20} /></div>
                    {isAuthenticated && (
                      <button
                        className={`career-card__bookmark ${isSaved ? 'is-saved' : ''}`}
                        onClick={() => toggleSavedCareer(career.id)}
                        aria-label={isSaved ? 'Remove from saved' : 'Save career'}
                        title={isSaved ? 'Saved' : 'Save'}
                      >
                        <Bookmark size={15} fill={isSaved ? 'currentColor' : 'none'} />
                      </button>
                    )}
                  </div>

                  <Tag tone={career.category === 'Technology' ? 'blue' : career.category === 'Healthcare' ? 'teal' : career.category === 'Finance' ? 'amber' : 'slate'}>
                    {career.category}
                  </Tag>
                  <h3 style={{ marginTop: 10 }}>{career.name}</h3>
                  <p className="career-card__summary">{career.shortDescription}</p>

                  <div className="career-card__metrics">
                    <div className="career-card__metric">
                      <span>Salary</span>
                      <strong>{career.salary.range}</strong>
                    </div>
                    <div className="career-card__metric">
                      <span>Demand</span>
                      <strong>{career.demand.level}</strong>
                    </div>
                  </div>

                  <div className="career-card__skills">
                    {career.technicalSkills.slice(0, 3).map((skill) => (
                      <Tag key={skill} tone="slate">{skill}</Tag>
                    ))}
                  </div>

                  <div className="career-card__footer">
                    <Link to={`/careers/${career.slug}`}>View details →</Link>
                    {score !== undefined && <ScoreBadge score={score} />}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
