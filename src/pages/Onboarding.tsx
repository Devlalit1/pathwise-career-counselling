import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import type { StudentProfile } from '../context/AppContext'
import { Button, InlineNotice } from '../components/ui'
import type { EducationLevel } from '../types'

const STEP_LABELS = ['Personal info', 'Education', 'Interests & goals']

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

const EDUCATION_LEVELS: EducationLevel[] = [
  'Class 10', 'Class 11', 'Class 12', 'Diploma', 'Undergraduate', 'Graduate', 'Postgraduate', 'Career switcher',
]

const STREAMS = ['Science', 'Commerce', 'Arts / Humanities', 'Vocational', 'Not applicable']

const SKILL_LABELS: Record<string, string> = {
  analyticalThinking: 'Analytical thinking',
  mathematics: 'Mathematics',
  communication: 'Communication',
  leadership: 'Leadership',
  creativity: 'Creativity',
  problemSolving: 'Problem solving',
  research: 'Research',
  organization: 'Organisation',
  technicalAptitude: 'Technical aptitude',
}

export default function Onboarding() {
  const { profile, updateOnboarding } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  const [age, setAge] = useState(profile?.age ?? '')
  const [location, setLocation] = useState(profile?.location ?? '')
  const [language, setLanguage] = useState(profile?.language ?? 'English')
  const [level, setLevel] = useState<EducationLevel>((profile?.education.level as EducationLevel) ?? 'Undergraduate')
  const [stream, setStream] = useState(profile?.education.stream ?? '')
  const [degree, setDegree] = useState(profile?.education.degree ?? '')
  const [branch, setBranch] = useState(profile?.education.branch ?? '')
  const [grade, setGrade] = useState(profile?.education.grade ?? '')
  const [graduationYear, setGraduationYear] = useState(profile?.education.graduationYear ?? '')
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? [])
  const [skills, setSkills] = useState<Record<string, number>>(profile?.skills ?? {})
  const [goals, setGoals] = useState<string[]>(profile?.goals ?? [])

  function toggleChip<T extends string>(list: T[], item: T, setList: (v: T[]) => void) {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item])
  }

  function handleFinish() {
    const studentProfile: StudentProfile = {
      age,
      location,
      language,
      education: { level, stream, degree, branch, grade, graduationYear },
      interests,
      skills,
      workPreferences: profile?.workPreferences ?? {},
      goals,
    }
    updateOnboarding(studentProfile)
    navigate('/dashboard')
  }

  const canNext0 = age.trim() !== '' && location.trim() !== ''
  const canNext1 = level !== undefined

  return (
    <div className="app-content">
      <div className="flow-wrap">
        <div className="flow-header">
          <h1>Set up your profile</h1>
          <p>Help us personalise your experience. You can update this later in your profile settings.</p>
        </div>

        {/* Stepper */}
        <div className="stepper">
          {STEP_LABELS.map((label, i) => (
            <div key={label} className={`stepper__item ${i === step ? 'is-active' : i < step ? 'is-complete' : ''}`}>
              <div className="stepper__bar" />
              <span className="stepper__label">{label}</span>
            </div>
          ))}
        </div>

        {/* Step 0 — Personal info */}
        {step === 0 && (
          <div>
            <div className="card">
              <div className="form-grid">
                <div className="form-grid form-grid--two">
                  <div className="field">
                    <label htmlFor="age">Age</label>
                    <input id="age" type="number" min="10" max="60" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 20" />
                  </div>
                  <div className="field">
                    <label htmlFor="lang">Preferred language</label>
                    <select id="lang" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      {['English', 'Hindi', 'Marathi', 'Tamil', 'Telugu', 'Kannada', 'Bengali', 'Gujarati', 'Other'].map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="location">Location (city, state)</label>
                  <input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Pune, Maharashtra" />
                </div>
              </div>
            </div>
            <div className="flow-actions">
              <span />
              <Button onClick={() => setStep(1)} disabled={!canNext0}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 1 — Education */}
        {step === 1 && (
          <div>
            <div className="card">
              <div className="form-grid">
                <div className="form-grid form-grid--two">
                  <div className="field">
                    <label htmlFor="level">Education level</label>
                    <select id="level" value={level} onChange={(e) => setLevel(e.target.value as EducationLevel)}>
                      {EDUCATION_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="stream">Stream / field</label>
                    <select id="stream" value={stream} onChange={(e) => setStream(e.target.value)}>
                      <option value="">Select a stream</option>
                      {STREAMS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-grid form-grid--two">
                  <div className="field">
                    <label htmlFor="degree">Degree / qualification</label>
                    <input id="degree" type="text" value={degree} onChange={(e) => setDegree(e.target.value)} placeholder="e.g. B.Tech, MBA, B.Sc" />
                  </div>
                  <div className="field">
                    <label htmlFor="branch">Branch / specialisation</label>
                    <input id="branch" type="text" value={branch} onChange={(e) => setBranch(e.target.value)} placeholder="e.g. Computer Science" />
                  </div>
                </div>
                <div className="form-grid form-grid--two">
                  <div className="field">
                    <label htmlFor="grade">Grade / CGPA</label>
                    <input id="grade" type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g. 8.2 CGPA or 75%" />
                  </div>
                  <div className="field">
                    <label htmlFor="year">Graduation year (actual or expected)</label>
                    <input id="year" type="number" min="2000" max="2035" value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="e.g. 2026" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flow-actions">
              <Button variant="secondary" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)} disabled={!canNext1}>Continue</Button>
            </div>
          </div>
        )}

        {/* Step 2 — Interests & Goals */}
        {step === 2 && (
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Which areas interest you most?</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.83rem', marginBottom: 14 }}>Select all that apply.</p>
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
            </div>

            <div className="card" style={{ marginBottom: 16 }}>
              <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>Rate your current skill confidence</h3>
              <p style={{ color: 'var(--muted)', fontSize: '.83rem', marginBottom: 14 }}>1 = just starting, 5 = very confident</p>
              {Object.entries(SKILL_LABELS).map(([key, label]) => (
                <div key={key} className="range-row">
                  <label>{label}</label>
                  <div className="range-control">
                    <input
                      type="range"
                      min={1}
                      max={5}
                      step={1}
                      value={skills[key] ?? 3}
                      onChange={(e) => setSkills((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                    />
                    <span>{skills[key] ?? 3}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 12, fontSize: '1rem' }}>What are your current goals?</h3>
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
            </div>

            <InlineNotice tone="info" >
              You can update any of these details later from your Profile settings.
            </InlineNotice>

            <div className="flow-actions">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={handleFinish}>Complete setup →</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
