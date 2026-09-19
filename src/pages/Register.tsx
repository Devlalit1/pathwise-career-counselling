import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Brand } from '../components/layout'
import { Button, InlineNotice } from '../components/ui'
import type { EducationLevel } from '../types'

const EDUCATION_LEVELS: EducationLevel[] = [
  'Class 10',
  'Class 11',
  'Class 12',
  'Diploma',
  'Undergraduate',
  'Graduate',
  'Postgraduate',
  'Career switcher',
]

export default function Register() {
  const { register } = useApp()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('Undergraduate')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    const result = await register({ name: name.trim(), email: email.trim(), password, educationLevel })
    setLoading(false)
    if (result.ok) {
      navigate('/onboarding')
    } else {
      setError(result.message ?? 'Registration failed.')
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-aside">
        <Brand />
        <div className="auth-aside__content">
          <h1>Start your career journey</h1>
          <p>Create your free Pathwise account and take a 36-question assessment that maps your interests, skills, personality, and values to real career pathways.</p>
          <div className="auth-aside__quote">
            "I finally understand why certain careers suit me — not just that they do." <br />
            <strong style={{ display: 'block', marginTop: 9, fontSize: '.78rem', color: '#a5b4d1' }}>Demo learner testimonial</strong>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <Compass size={28} style={{ color: 'var(--primary)', marginBottom: 12 }} />
          <h2>Create your account</h2>
          <p>Free forever. No credit card required.</p>

          {error && <InlineNotice tone="warning">{error}</InlineNotice>}

          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 22 }}>
            <div className="field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
              />
            </div>
            <div className="field">
              <label htmlFor="education">Current education level</label>
              <select
                id="education"
                value={educationLevel}
                onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
              >
                {EDUCATION_LEVELS.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
              <small>This helps us personalise your career matches and roadmap.</small>
            </div>
            <div className="checkbox-row">
              <input type="checkbox" required id="terms" />
              <label htmlFor="terms">
                I understand that Pathwise provides career guidance, not guaranteed outcomes. Results are for exploration and should be verified against current institutional and employer requirements.
              </label>
            </div>
            <Button type="submit" loading={loading}>Create account</Button>
          </form>

          <p className="auth-form__footer">
            Already have an account? <Link to="/login" className="text-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
