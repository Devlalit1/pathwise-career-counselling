import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { Brand } from '../components/layout'
import { Button, InlineNotice } from '../components/ui'

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.ok) {
      navigate(from, { replace: true })
    } else {
      setError(result.message ?? 'Login failed.')
    }
  }

  function fillDemo(role: 'student' | 'admin') {
    setEmail(role === 'admin' ? 'admin@pathwise.in' : 'demo@pathwise.in')
    setPassword(role === 'admin' ? 'Admin123!' : 'Pathwise123!')
    setError('')
  }

  return (
    <div className="auth-page">
      <div className="auth-aside">
        <Brand />
        <div className="auth-aside__content">
          <h1>Welcome back</h1>
          <p>Sign in to view your career matches, track your roadmap progress, and continue building your plan.</p>
          <div className="auth-aside__quote">
            <strong style={{ display: 'block', marginBottom: 7, fontSize: '.83rem' }}>Demo access</strong>
            <p style={{ margin: 0, fontSize: '.82rem', color: '#c7d2ff', lineHeight: 1.55 }}>
              Use the demo credentials on the right to explore the full experience — no sign-up required.
            </p>
          </div>
        </div>
      </div>

      <div className="auth-panel">
        <div className="auth-form-wrap">
          <Compass size={28} style={{ color: 'var(--primary)', marginBottom: 12 }} />
          <h2>Sign in to Pathwise</h2>
          <p>Enter your email and password below.</p>

          {error && <InlineNotice tone="warning" >{error}</InlineNotice>}

          <form className="form-grid" onSubmit={handleSubmit} style={{ marginTop: 22 }}>
            <div className="field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
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
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
              />
            </div>
            <Button type="submit" loading={loading} style={{ marginTop: 4 }}>Sign in</Button>
          </form>

          <div className="demo-access">
            <strong>Try the demo:</strong><br />
            <button className="button button--ghost button--sm" style={{ marginTop: 7, marginRight: 8 }} onClick={() => fillDemo('student')}>
              Student demo
            </button>
            <button className="button button--ghost button--sm" style={{ marginTop: 7 }} onClick={() => fillDemo('admin')}>
              Admin demo
            </button>
            <p style={{ margin: '10px 0 0', color: '#5a7aad', fontSize: '.72rem' }}>
              Student: demo@pathwise.in · Pathwise123!<br />
              Admin: admin@pathwise.in · Admin123!
            </p>
          </div>

          <p className="auth-form__footer">
            Don't have an account? <Link to="/register" className="text-link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
