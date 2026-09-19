import { BarChart2, BriefcaseBusiness, ShieldCheck, Users } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { RoleGate } from '../components/layout'
import { CAREERS } from '../data/careers'
import { Tag } from '../components/ui'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Admin sees demo accounts — we expose a curated list for the demo
const DEMO_ACCOUNTS = [
  { id: 'demo-devendra', name: 'Devendra', email: 'demo@pathwise.in', role: 'STUDENT', createdAt: '2026-08-22T09:30:00.000Z', assessments: 1, primaryCareer: 'Data Scientist' },
  { id: 'admin-1', name: 'Admin', email: 'admin@pathwise.in', role: 'ADMIN', createdAt: '2026-01-01T00:00:00.000Z', assessments: 0, primaryCareer: '—' },
]

const CATEGORY_COUNTS = CAREERS.reduce<Record<string, number>>((acc, c) => {
  acc[c.category] = (acc[c.category] ?? 0) + 1
  return acc
}, {})

export default function Admin() {
  useApp() // ensure context is loaded

  return (
    <RoleGate>
      <div>
        <div className="page-intro">
          <div>
            <h1 className="page-title">Administration</h1>
            <p className="page-subtitle">System overview and demo data management. This panel is for ADMIN role only.</p>
          </div>
          <Tag tone="violet"><ShieldCheck size={12} style={{ verticalAlign: 'middle', marginRight: 3 }} />Admin access</Tag>
        </div>

        {/* Metrics */}
        <div className="admin-metrics">
          <div className="metric-card">
            <div className="metric-card__top">
              <span className="metric-card__label">Total users</span>
              <div className="metric-card__icon"><Users size={15} /></div>
            </div>
            <div className="metric-card__value">{DEMO_ACCOUNTS.length}</div>
            <p className="metric-card__note">Demo accounts in system</p>
          </div>
          <div className="metric-card">
            <div className="metric-card__top">
              <span className="metric-card__label">Career profiles</span>
              <div className="metric-card__icon"><BriefcaseBusiness size={15} /></div>
            </div>
            <div className="metric-card__value">{CAREERS.length}</div>
            <p className="metric-card__note">Across {Object.keys(CATEGORY_COUNTS).length} categories</p>
          </div>
          <div className="metric-card">
            <div className="metric-card__top">
              <span className="metric-card__label">Assessments taken</span>
              <div className="metric-card__icon"><BarChart2 size={15} /></div>
            </div>
            <div className="metric-card__value">{DEMO_ACCOUNTS.reduce((s, a) => s + a.assessments, 0)}</div>
            <p className="metric-card__note">Demo submissions total</p>
          </div>
          <div className="metric-card">
            <div className="metric-card__top">
              <span className="metric-card__label">Admin accounts</span>
              <div className="metric-card__icon"><ShieldCheck size={15} /></div>
            </div>
            <div className="metric-card__value">{DEMO_ACCOUNTS.filter((a) => a.role === 'ADMIN').length}</div>
            <p className="metric-card__note">With elevated access</p>
          </div>
        </div>

        {/* Users table */}
        <h2 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>User accounts</h2>
        <div className="admin-table-wrap" style={{ marginBottom: 24 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Member since</th>
                <th>Assessments</th>
                <th>Primary career</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ACCOUNTS.map((account) => (
                <tr key={account.id}>
                  <td style={{ fontWeight: 750 }}>{account.name}</td>
                  <td>{account.email}</td>
                  <td>
                    <Tag tone={account.role === 'ADMIN' ? 'violet' : 'blue'}>{account.role}</Tag>
                  </td>
                  <td>{formatDate(account.createdAt)}</td>
                  <td>{account.assessments}</td>
                  <td>{account.primaryCareer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Career categories breakdown */}
        <h2 style={{ margin: '0 0 12px', fontSize: '1.05rem' }}>Career catalogue</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Career count</th>
                <th>% of catalogue</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(CATEGORY_COUNTS)
                .sort((a, b) => b[1] - a[1])
                .map(([category, count]) => (
                  <tr key={category}>
                    <td>{category}</td>
                    <td>{count}</td>
                    <td>{Math.round((count / CAREERS.length) * 100)}%</td>
                  </tr>
                ))}
              <tr style={{ fontWeight: 800, background: '#f8faff' }}>
                <td>Total</td>
                <td>{CAREERS.length}</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 20, padding: 14, border: '1px solid #e0e7ef', borderRadius: 12, background: '#f8f9ff' }}>
          <p style={{ margin: 0, fontSize: '.78rem', color: '#6a7e99', lineHeight: 1.6 }}>
            <strong>Demo note:</strong> This admin panel is fully client-side. All data shown here is illustrative demo data stored in localStorage. No server database is connected in this demo build.
          </p>
        </div>
      </div>
    </RoleGate>
  )
}
