import { useEffect, useRef, useState } from 'react'
import { Flag, Plus, Target, Trash2 } from 'lucide-react'
import { Button, EmptyState, Modal, Tabs, useToast } from '../components/ui'
import { useApp } from '../context/AppContext'

type GoalStatus = 'not-started' | 'in-progress' | 'completed' | 'paused'

interface Goal {
  id: string
  title: string
  description?: string
  careerName?: string
  targetDate?: string
  status: GoalStatus
  createdAt: string
}

const STATUS_LABELS: Record<GoalStatus, string> = {
  'not-started': 'Not started',
  'in-progress': 'In progress',
  completed: 'Completed',
  paused: 'Paused',
}

const DOT_CLASS: Record<GoalStatus, string> = {
  'not-started': '',
  'in-progress': 'is-active',
  completed: 'is-done',
  paused: 'is-paused',
}

const STATUS_CYCLE: Record<GoalStatus, GoalStatus> = {
  'not-started': 'in-progress',
  'in-progress': 'completed',
  completed: 'paused',
  paused: 'not-started',
}

function loadGoals(): Goal[] {
  try {
    return JSON.parse(localStorage.getItem('pathwise-goals') ?? '[]') as Goal[]
  } catch {
    return []
  }
}

export default function Goals() {
  const { recommendations } = useApp()
  const { show } = useToast()
  const [goals, setGoals] = useState<Goal[]>(loadGoals)
  const [tab, setTab] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editGoal, setEditGoal] = useState<Goal | null>(null)

  // form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [careerName, setCareerName] = useState('')
  const [targetDate, setTargetDate] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    localStorage.setItem('pathwise-goals', JSON.stringify(goals))
  }, [goals])

  useEffect(() => {
    if (modalOpen) {
      setTimeout(() => titleRef.current?.focus(), 50)
    }
  }, [modalOpen])

  function openAdd() {
    setEditGoal(null)
    setTitle('')
    setDescription('')
    setCareerName('')
    setTargetDate('')
    setModalOpen(true)
  }

  function openEdit(g: Goal) {
    setEditGoal(g)
    setTitle(g.title)
    setDescription(g.description ?? '')
    setCareerName(g.careerName ?? '')
    setTargetDate(g.targetDate ?? '')
    setModalOpen(true)
  }

  function saveGoal() {
    if (!title.trim()) return
    if (editGoal) {
      setGoals((prev) =>
        prev.map((g) =>
          g.id === editGoal.id
            ? { ...g, title: title.trim(), description: description.trim(), careerName, targetDate }
            : g,
        ),
      )
      show({ kind: 'success', title: 'Goal updated' })
    } else {
      const newGoal: Goal = {
        id: Date.now().toString(36),
        title: title.trim(),
        description: description.trim() || undefined,
        careerName: careerName || undefined,
        targetDate: targetDate || undefined,
        status: 'not-started',
        createdAt: new Date().toISOString(),
      }
      setGoals((prev) => [newGoal, ...prev])
      show({ kind: 'success', title: 'Goal added', message: title.trim() })
    }
    setModalOpen(false)
  }

  function deleteGoal(id: string) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
    show({ kind: 'info', title: 'Goal removed' })
  }

  function cycleStatus(id: string) {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, status: STATUS_CYCLE[g.status] } : g,
      ),
    )
  }

  const topCareers = recommendations.slice(0, 5).map((r) => r.career.name)

  const filtered =
    tab === 'all'
      ? goals
      : tab === 'active'
        ? goals.filter((g) => g.status === 'in-progress' || g.status === 'not-started')
        : goals.filter((g) => g.status === 'completed')

  const counts = {
    all: goals.length,
    active: goals.filter((g) => g.status === 'in-progress' || g.status === 'not-started').length,
    completed: goals.filter((g) => g.status === 'completed').length,
  }

  return (
    <div className="app-content animate-fade-in">
      <div className="page-intro">
        <div>
          <h1 className="page-title">My Goals</h1>
          <p className="page-subtitle">Track your career milestones and stay motivated.</p>
        </div>
        <div className="page-actions">
          <Button variant="primary" size="md" onClick={openAdd}>
            <Plus size={16} /> Add goal
          </Button>
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <Tabs
          value={tab}
          onChange={setTab}
          options={[
            { value: 'all', label: `All (${counts.all})` },
            { value: 'active', label: `Active (${counts.active})` },
            { value: 'completed', label: `Completed (${counts.completed})` },
          ]}
          className="animate-slide-up"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Target size={22} />}
          title={tab === 'completed' ? 'No completed goals yet' : 'No goals yet'}
          copy={
            tab === 'completed'
              ? 'Complete some goals to see them here.'
              : 'Add your first goal to start tracking your career progress.'
          }
          action={
            tab === 'all' ? (
              <Button variant="primary" size="sm" onClick={openAdd}>
                <Plus size={14} /> Add your first goal
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="goals-grid animate-slide-up">
          {filtered.map((g, i) => (
            <div key={g.id} className="goal-card" style={{ animationDelay: `${i * 0.05}s` }}>
              <button
                className={`goal-status-dot ${DOT_CLASS[g.status]}`}
                onClick={() => cycleStatus(g.id)}
                title={`Status: ${STATUS_LABELS[g.status]} — click to advance`}
                style={{ border: 0, cursor: 'pointer', padding: 0, background: 'none' }}
              />
              <div>
                <div className="goal-card__title">{g.title}</div>
                <div className="goal-card__meta">
                  {STATUS_LABELS[g.status]}
                  {g.careerName ? ` · ${g.careerName}` : ''}
                  {g.targetDate ? ` · By ${new Date(g.targetDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : ''}
                </div>
                {g.description && (
                  <p style={{ margin: '5px 0 0', fontSize: '.78rem', color: '#64748b', lineHeight: 1.5 }}>
                    {g.description}
                  </p>
                )}
              </div>
              <div className="goal-card__actions">
                <button className="icon-button" title="Edit" onClick={() => openEdit(g)}>
                  <Flag size={15} />
                </button>
                <button className="icon-button" title="Delete" onClick={() => deleteGoal(g.id)}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}

          <button className="goal-add-btn" onClick={openAdd}>
            <Plus size={16} /> Add another goal
          </button>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editGoal ? 'Edit goal' : 'Add a new goal'}
      >
        <div className="form-grid" style={{ gap: 14 }}>
          <div className="field">
            <label>Goal title *</label>
            <input
              ref={titleRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete a machine learning course"
              onKeyDown={(e) => e.key === 'Enter' && saveGoal()}
            />
          </div>
          <div className="field">
            <label>Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any notes or context..."
              rows={2}
            />
          </div>
          <div className="form-grid--two form-grid">
            <div className="field">
              <label>Linked career (optional)</label>
              <select value={careerName} onChange={(e) => setCareerName(e.target.value)}>
                <option value="">— None —</option>
                {topCareers.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Target date (optional)</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
            <Button variant="secondary" size="md" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={saveGoal} disabled={!title.trim()}>
              {editGoal ? 'Save changes' : 'Add goal'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
