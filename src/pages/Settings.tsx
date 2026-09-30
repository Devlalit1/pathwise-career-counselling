import { useState } from 'react'
import {
  Bell,
  Database,
  Download,
  KeyRound,
  LogOut,
  Shield,
  Trash2,
  User,
} from 'lucide-react'
import { Button, Modal, useToast } from '../components/ui'
import { useApp } from '../context/AppContext'

type Section = 'account' | 'password' | 'notifications' | 'data' | 'danger'

const NAV: { id: Section; label: string; icon: typeof User }[] = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'password', label: 'Password', icon: KeyRound },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'data', label: 'Data & Privacy', icon: Database },
  { id: 'danger', label: 'Danger zone', icon: Shield },
]

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" />
      <span className="toggle-thumb" />
    </label>
  )
}

export default function Settings() {
  const { user, profile, updateProfile, logout } = useApp()
  const { show } = useToast()
  const [active, setActive] = useState<Section>('account')
  const [deleteModal, setDeleteModal] = useState(false)

  // account form
  const [name, setName] = useState(user?.name ?? '')
  const [savingAccount, setSavingAccount] = useState(false)

  // password form
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [savingPw, setSavingPw] = useState(false)

  // notification prefs (localStorage)
  const [notifs, setNotifs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pathwise-notifs') ?? '{"email":true,"digest":false,"tips":true}') as Record<string, boolean>
    } catch {
      return { email: true, digest: false, tips: true }
    }
  })

  function saveNotif(key: string, val: boolean) {
    const next = { ...notifs, [key]: val }
    setNotifs(next)
    localStorage.setItem('pathwise-notifs', JSON.stringify(next))
    show({ kind: 'success', title: 'Preferences saved' })
  }

  async function saveAccount() {
    if (!name.trim()) return
    setSavingAccount(true)
    await new Promise((r) => setTimeout(r, 600))
    updateProfile({ ...profile! })
    setSavingAccount(false)
    show({ kind: 'success', title: 'Account updated', message: 'Your display name has been saved.' })
  }

  async function changePassword() {
    if (!currentPw || !newPw || !confirmPw) {
      show({ kind: 'error', title: 'All fields required' })
      return
    }
    if (newPw.length < 8) {
      show({ kind: 'error', title: 'Password too short', message: 'Minimum 8 characters.' })
      return
    }
    if (newPw !== confirmPw) {
      show({ kind: 'error', title: 'Passwords do not match' })
      return
    }
    setSavingPw(true)
    await new Promise((r) => setTimeout(r, 800))
    setSavingPw(false)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    show({ kind: 'success', title: 'Password changed', message: 'You can now sign in with your new password.' })
  }

  function exportData() {
    const blob = new Blob(
      [JSON.stringify({ user, profile }, null, 2)],
      { type: 'application/json' },
    )
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'pathwise-my-data.json'
    a.click()
    URL.revokeObjectURL(url)
    show({ kind: 'success', title: 'Export ready', message: 'Check your Downloads folder.' })
  }

  function clearHistory() {
    localStorage.removeItem('pathwise-demo-state-v1')
    show({ kind: 'warning', title: 'History cleared', message: 'Reload the page to see changes.' })
  }

  function handleDelete() {
    logout()
    show({ kind: 'info', title: 'Account deleted', message: 'Your data has been cleared.' })
  }

  return (
    <div className="app-content animate-fade-in">
      <div className="page-intro" style={{ marginBottom: 28 }}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account, password, and preferences.</p>
        </div>
      </div>

      <div className="settings-layout">
        {/* Nav */}
        <nav className="settings-nav" aria-label="Settings navigation">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`settings-nav-item${active === id ? ' is-active' : ''}`}
              onClick={() => setActive(id)}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        {/* Panels */}
        <div>
          {/* Account */}
          {active === 'account' && (
            <div className="settings-panel animate-slide-up">
              <h2>Account information</h2>
              <p>Update your display name. Your email cannot be changed in this demo.</p>
              <div className="form-grid" style={{ maxWidth: 440 }}>
                <div className="field">
                  <label>Full name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="field">
                  <label>Email address</label>
                  <input value={user?.email ?? ''} readOnly style={{ opacity: .6, cursor: 'not-allowed' }} />
                  <small>Email cannot be changed in the demo version.</small>
                </div>
                <div className="field">
                  <label>Role</label>
                  <input value={user?.role ?? ''} readOnly style={{ opacity: .6, cursor: 'not-allowed', textTransform: 'capitalize' }} />
                </div>
                <div style={{ paddingTop: 4 }}>
                  <Button variant="primary" size="md" onClick={saveAccount} loading={savingAccount} disabled={!name.trim()}>
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Password */}
          {active === 'password' && (
            <div className="settings-panel animate-slide-up">
              <h2>Change password</h2>
              <p>Enter your current password, then choose a new one.</p>
              <div className="form-grid" style={{ maxWidth: 440 }}>
                <div className="field">
                  <label>Current password</label>
                  <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="field">
                  <label>New password</label>
                  <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" />
                </div>
                <div className="field">
                  <label>Confirm new password</label>
                  <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} placeholder="••••••••" />
                </div>
                <div style={{ paddingTop: 4 }}>
                  <Button variant="primary" size="md" onClick={changePassword} loading={savingPw}>
                    <KeyRound size={15} /> Update password
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {active === 'notifications' && (
            <div className="settings-panel animate-slide-up">
              <h2>Notification preferences</h2>
              <p>Control which updates you'd like to receive.</p>
              <div>
                {[
                  { key: 'email', label: 'Assessment results', hint: 'Receive a summary after completing an assessment.' },
                  { key: 'digest', label: 'Weekly digest', hint: 'A weekly email with new career insights and resources.' },
                  { key: 'tips', label: 'Career tips', hint: 'Occasional tips to help you move forward on your roadmap.' },
                ].map(({ key, label, hint }) => (
                  <div key={key} className="toggle-row">
                    <div>
                      <label>{label}</label>
                      <small>{hint}</small>
                    </div>
                    <Toggle checked={!!notifs[key]} onChange={(v) => saveNotif(key, v)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Data */}
          {active === 'data' && (
            <div className="settings-panel animate-slide-up">
              <h2>Data & Privacy</h2>
              <p>Export or delete your Pathwise data.</p>
              <div style={{ display: 'grid', gap: 14 }}>
                <div className="card card--flat" style={{ padding: 18 }}>
                  <h3 style={{ marginBottom: 6, fontSize: '.95rem' }}>Export my data</h3>
                  <p style={{ marginBottom: 14, color: '#64748b', fontSize: '.85rem', lineHeight: 1.55 }}>
                    Download a JSON file containing your profile, assessment answers, and career matches.
                  </p>
                  <Button variant="secondary" size="sm" onClick={exportData}>
                    <Download size={14} /> Download JSON
                  </Button>
                </div>
                <div className="card card--flat" style={{ padding: 18 }}>
                  <h3 style={{ marginBottom: 6, fontSize: '.95rem' }}>Clear assessment history</h3>
                  <p style={{ marginBottom: 14, color: '#64748b', fontSize: '.85rem', lineHeight: 1.55 }}>
                    Remove all saved assessment responses and career matches from this device.
                  </p>
                  <Button variant="ghost" size="sm" onClick={clearHistory}>
                    <Trash2 size={14} /> Clear history
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Danger zone */}
          {active === 'danger' && (
            <div className="settings-panel animate-slide-up">
              <h2>Danger zone</h2>
              <p>Irreversible actions. Please proceed carefully.</p>
              <div className="danger-zone">
                <h3>Delete account</h3>
                <p>
                  This will permanently remove your profile, assessment history, saved careers, and all associated data.
                  This action cannot be undone.
                </p>
                <Button variant="danger" size="md" onClick={() => setDeleteModal(true)}>
                  <Trash2 size={15} /> Delete my account
                </Button>
              </div>
              <div style={{ marginTop: 16 }}>
                <Button variant="ghost" size="md" onClick={logout}>
                  <LogOut size={15} /> Sign out
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Modal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        title="Delete account"
        size="sm"
      >
        <p style={{ color: '#64748b', marginBottom: 20, lineHeight: 1.6, fontSize: '.9rem' }}>
          Are you sure? All your data will be permanently deleted. This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <Button variant="secondary" size="md" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={handleDelete}>
            Yes, delete everything
          </Button>
        </div>
      </Modal>
    </div>
  )
}
