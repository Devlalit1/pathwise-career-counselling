import { useState } from 'react'
import { useApp } from '../context/AppContext'
import type { StudentProfile } from '../context/AppContext'
import { Button, Card, InlineNotice, Tag } from '../components/ui'
import type { EducationLevel } from '../types'

const EDUCATION_LEVELS: EducationLevel[] = [
  'Class 10', 'Class 11', 'Class 12', 'Diploma', 'Undergraduate', 'Graduate', 'Postgraduate', 'Career switcher',
]

const INTEREST_OPTIONS = [
  'Technology', 'Mathematics', 'Science', 'Arts & Design', 'Business', 'Finance',
  'Healthcare', 'Law', 'Research', 'Education', 'Environment', 'Government',
  'Media & Communication', 'Entrepreneurship', 'Sports & Fitness', 'Social Work',
]

const GOAL_OPTIONS = [
  'Land my first job', 'Change career paths', 'Pursue higher studies', 'Build a startup',
  'Get a government job', 'Work abroad', 'Freelance / consult', 'Build a portfolio',
  'Get a promotion', 'Find an internship', 'Explore options', 'Upskill in my field',
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Profile() {
  const { user, profile, updateProfile } = useApp()
  const [editing, setEditing] = useState(false)
  const [saved, setSaved] = useState(false)

  const [age, setAge] = useState(profile?.age ?? '')
  const [location, setLocation] = useState(profile?.location ?? '')
  const [language, setLanguage] = useState(profile?.language ?? 'English')
  const [level, setLevel] = useState<EducationLevel>((profile?.education.level ?? 'Undergraduate') as EducationLevel)
  const [stream, setStream] = useState(profile?.education.stream ?? '')
  const [degree, setDegree] = useState(profile?.education.degree ?? '')
  const [branch, setBranch] = useState(profile?.education.branch ?? '')
  const [grade, setGrade] = useState(profile?.education.grade ?? '')
  const [graduationYear, setGraduationYear] = useState(profile?.education.graduationYear ?? '')
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? [])
  const [goals, setGoals] = useState<string[]>(profile?.goals ?? [])

  function toggleChip<T extends string>(list: T[], item: T, setList: (v: T[]) => void) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  function handleSave() {
    const updated: Partial<StudentProfile> = {
      age,
      location,
      language,
      education: { level, stream, degree, branch, grade, graduationYear },
      interests,
      goals,
    }
    updateProfile(updated)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  function handleCancel() {
    // Reset to current profile values
    setAge(profile?.age ?? '')
    setLocation(profile?.location ?? '')
    setLanguage(profile?.language ?? 'English')
    setLevel((profile?.education.level ?? 'Undergraduate') as EducationLevel)
    setStream(profile?.education.stream ?? '')
    setDegree(profile?.education.degree ?? '')
    setBranch(profile?.education.branch ?? '')
    setGrade(profile?.education.grade ?? '')
    setGraduationYear(profile?.education.graduationYear ?? '')
    setInterests(profile?.interests ?? [])
    setGoals(profile?.goals ?? [])
    setEditing(false)
  }

  return (
    <div>
      <div className="page-intro">
        <div>
          <h1 className="page-title">Profile</h1>
          <p className="page-subtitle">View and update your personal information, education, and interests.</p>
        </div>
        <div className="page-actions">
          {!editing && <Button size="sm" onClick={() => setEditing(true)}>Edit profile</Button>}
          {editing && (
            <>
              <Button variant="secondary" size="sm" onClick={handleCancel}>Cancel</Button>
              <Button size="sm" onClick={handleSave}>Save changes</Button>
            </>
          )}
        </div>
      </div>

      {saved && <InlineNotice tone="success">Profile updated successfully.</InlineNotice>}

      <div className="profile-grid">
        <div>
          {/* Account info */}
          <Card style={{ marginBottom: 16 }}>
            <div className="profile-card__header">
              <h2>Account</h2>
              <Tag tone={user?.role === 'ADMIN' ? 'violet' : 'blue'}>{user?.role === 'ADMIN' ? 'Administrator' : 'Student'}</Tag>
            </div>
            <dl className="info-list">
              <div><dt>Name</dt><dd>{user?.name}</dd></div>
              <div><dt>Email</dt><dd>{user?.email}</dd></div>
              <div><dt>Role</dt><dd>{user?.role === 'ADMIN' ? 'Administrator' : 'Student'}</dd></div>
              <div><dt>Member since</dt><dd>{user?.createdAt ? formatDate(user.createdAt) : '—'}</dd></div>
            </dl>
          </Card>

          {/* Personal info */}
          <Card style={{ marginBottom: 16 }}>
            <div className="profile-card__header"><h2>Personal info</h2></div>
            {editing ? (
              <div className="form-grid">
                <div className="form-grid form-grid--two">
                  <div className="field">
                    <label>Age</label>
                    <input type="number" min="10" max="60" value={age} onChange={(e) => setAge(e.target.value)} />
                  </div>
                  <div className="field">
                    <label>Language</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                      {['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati', 'Other'].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label>Location</label>
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, State" />
                </div>
              </div>
            ) : (
              <dl className="info-list">
                <div><dt>Age</dt><dd>{profile?.age || '—'}</dd></div>
                <div><dt>Language</dt><dd>{profile?.language || '—'}</dd></div>
                <div><dt>Location</dt><dd>{profile?.location || '—'}</dd></div>
              </dl>
            )}
          </Card>

          {/* Education */}
          <Card>
            <div className="profile-card__header"><h2>Education</h2></div>
            {editing ? (
              <div className="form-grid">
                <div className="form-grid form-grid--two">
                  <div className="field">
                    <label>Education level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)}>
                      {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Stream</label>
                    <input type="text" value={stream} onChange={(e) => setStream(e.target.value)} placeholder="Science / Commerce / Arts" />
                  </div>
                </div>
                <div className="form-grid form-grid--two">
                  <div className="field">
                    <label>Degree</label>
                    <input type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="B.Tech, MBA…" />
                  </div>
                  <div className="field">
                    <label>Branch / specialisation</label>
                    <input type="text" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="Computer Science…" />
                  </div>
                </div>
                <div className="form-grid form-grid--two">
                  <div className="field">
                    <label>Grade / CGPA</label>
                    <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="8.2 CGPA" />
                  </div>
                  <div className="field">
                    <label>Graduation year</label>
                    <input type="number" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="2026" />
                  </div>
                </div>
              </div>
            ) : (
              <dl className="info-list">
                <div><dt>Level</dt><dd>{profile?.education.level || '—'}</dd></div>
                <div><dt>Stream</dt><dd>{profile?.education.stream || '—'}</dd></div>
                <div><dt>Degree</dt><dd>{profile?.education.degree || '—'}</dd></div>
                <div><dt>Branch</dt><dd>{profile?.education.branch || '—'}</dd></div>
                <div><dt>Grade</dt><dd>{profile?.education.grade || '—'}</dd></div>
                <div><dt>Graduation</dt><dd>{profile?.education.graduationYear || '—'}</dd></div>
              </dl>
            )}
          </Card>
        </div>

        <div>
          {/* Interests */}
          <Card style={{ marginBottom: 16 }}>
            <div className="profile-card__header"><h2>Interests</h2></div>
            {editing ? (
              <div className="choice-grid">
                {INTEREST_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`choice-chip ${interests.includes(opt) ? 'is-selected' : ''}`}
                    onClick={() => toggleChip(interests, opt, setInterests)}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="skill-cloud">
                {(profile?.interests ?? []).length > 0
                  ? (profile?.interests ?? []).map((i) => <Tag key={i} tone="blue">{i}</Tag>)
                  : <span style={{ color: 'var(--muted)', fontSize: '.83rem' }}>No interests added yet.</span>
                }
              </div>
            )}
          </Card>

          {/* Goals */}
          <Card>
            <div className="profile-card__header"><h2>Goals</h2></div>
            {editing ? (
              <div className="choice-grid">
                {GOAL_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`choice-chip ${goals.includes(opt) ? 'is-selected' : ''}`}
                    onClick={() => toggleChip(goals, opt, setGoals)}
                    type="button"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            ) : (
              <div className="skill-cloud">
                {(profile?.goals ?? []).length > 0
                  ? (profile?.goals ?? []).map((g) => <Tag key={g} tone="teal">{g}</Tag>)
                  : <span style={{ color: 'var(--muted)', fontSize: '.83rem' }}>No goals added yet.</span>
                }
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
