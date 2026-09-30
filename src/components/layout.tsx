import { useState } from 'react'
import {
  BarChart3,
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  ChevronRight,
  Compass,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircleHeart,
  Route,
  Settings,
  ShieldCheck,
  Target,
  X,
} from 'lucide-react'
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button, cn, Tag } from './ui'


export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Pathwise home">
      <span className="brand__mark"><Compass size={18} strokeWidth={2.5} /></span>
      <span className="brand__text">pathwise</span>
    </Link>
  )
}

const publicLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/careers', label: 'Explore careers' },
  { to: '/about', label: 'How it works' },
]

export function PublicHeader() {
  const { isAuthenticated } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <header className="public-header">
      <div className="public-header__inner">
        <Brand />
        <nav className="public-nav" aria-label="Primary navigation">
          {publicLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end}>{link.label}</NavLink>)}
        </nav>
        <div className="public-header__actions">
          {isAuthenticated ? (
            <Link to="/dashboard"><Button size="sm">My dashboard</Button></Link>
          ) : (
            <>
              <Link to="/login"><Button variant="secondary" size="sm">Sign in</Button></Link>
              <Link to="/register"><Button size="sm">Get started</Button></Link>
            </>
          )}
          <button className="icon-button mobile-menu-button" aria-label="Toggle navigation" onClick={() => setMenuOpen((value) => !value)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen ? (
        <nav className="mobile-public-nav" aria-label="Mobile navigation">
          {publicLinks.map((link) => <NavLink key={link.to} to={link.to} end={link.end} onClick={() => setMenuOpen(false)}>{link.label}</NavLink>)}
        </nav>
      ) : null}
    </header>
  )
}

export function PublicFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div>
          <Brand />
          <p style={{ marginTop: 13, maxWidth: 315 }}>Thoughtful career guidance built around your responses, not a one-size-fits-all answer.</p>
        </div>
        <div><h4>Explore</h4><Link to="/careers">Career explorer</Link><Link to="/about">How it works</Link><Link to="/register">Career assessment</Link></div>
        <div><h4>For learners</h4><Link to="/dashboard">My dashboard</Link><Link to="/compare">Compare careers</Link><Link to="/counsellor">Career counsellor</Link></div>
        <div><h4>Our approach</h4><Link to="/about">About Pathwise</Link><a href="#principles">Guidance principles</a><a href="#faq">FAQ</a></div>
      </div>
      <div className="site-footer__bottom">© 2026 Pathwise. Career guidance, not a guarantee of outcomes.</div>
    </footer>
  )
}

export function PublicLayout() {
  return <div className="site-shell"><PublicHeader /><Outlet /><PublicFooter /></div>
}

export function RequireAuth({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, isOnboarded } = useApp()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!isOnboarded && location.pathname !== '/onboarding') return <Navigate to="/onboarding" replace />
  return children ? <>{children}</> : <Outlet />
}

export function RequireAdmin({ children }: { children?: React.ReactNode }) {
  const { user } = useApp()
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />
  return children ? <>{children}</> : <Outlet />
}

const navigation = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/assessment', label: 'Career assessment', icon: BookOpenCheck },
  { to: '/careers', label: 'Explore careers', icon: BriefcaseBusiness },
  { to: '/compare', label: 'Compare careers', icon: BarChart3 },
  { to: '/my-plan', label: 'My career plan', icon: Route },
  { to: '/counsellor', label: 'Career counsellor', icon: MessageCircleHeart },
  { to: '/goals', label: 'My goals', icon: Target },
]

function titleForPath(pathname: string) {
  const current = navigation.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
  if (pathname === '/profile') return 'Profile'
  if (pathname === '/assessment-history') return 'Assessment history'
  if (pathname === '/settings') return 'Settings'
  if (pathname.startsWith('/admin')) return 'Administration'
  if (pathname === '/onboarding') return 'Your profile'
  return current?.label ?? 'Pathwise'
}


function Avatar({ name, small = false }: { name: string; small?: boolean }) {
  const initials = name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
  return <span className="avatar" style={small ? { width: 29, height: 29, fontSize: '.65rem' } : undefined}>{initials}</span>
}

export function AppShell() {
  const { user, logout } = useApp()
  const location = useLocation()
  const activeTitle = titleForPath(location.pathname)
  const adminNav = user?.role === 'ADMIN' ? [{ to: '/admin', label: 'Admin dashboard', icon: ShieldCheck }] : []
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="app-sidebar__brand"><Brand /></div>
        <div className="sidebar-group">
          <p className="sidebar-group__label">Your guidance</p>
          {navigation.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => cn('sidebar-link', isActive && 'active')}>
              <Icon size={17} /><span className="sidebar-link__grow">{label}</span>
            </NavLink>
          ))}
        </div>
        {adminNav.length ? <div className="sidebar-group"><p className="sidebar-group__label">Administration</p>{adminNav.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => cn('sidebar-link', isActive && 'active')}><Icon size={17} /><span>{label}</span></NavLink>)}</div> : null}
        <div className="sidebar-footer">
          <Link className="profile-shortcut" to="/profile"><Avatar name={user?.name ?? 'Learner'} small /><span><span className="profile-shortcut__name">{user?.name ?? 'Learner'}</span><span className="profile-shortcut__role">{user?.role === 'ADMIN' ? 'Administrator' : 'Student profile'}</span></span></Link>
          <button className="sidebar-link" style={{ width: '100%', border: 0, background: 'transparent' }} onClick={logout}><LogOut size={17} /><span>Sign out</span></button>
        </div>
      </aside>
      <main className="app-main">
        <div className="mobile-app-header"><Brand /><Link to="/profile"><Avatar name={user?.name ?? 'Learner'} small /></Link></div>
        <header className="app-topbar">
          <div className="breadcrumbs"><span>Pathwise</span><ChevronRight size={14} /><strong>{activeTitle}</strong></div>
          <div className="topbar-actions"><button className="icon-button" aria-label="Notifications"><Bell size={18} /><span className="notification-dot" /></button><Link to="/profile"><Avatar name={user?.name ?? 'Learner'} small /></Link></div>
        </header>
        <div className="app-content"><Outlet /></div>
      </main>
      <nav className="mobile-nav" aria-label="Mobile app navigation">
        {navigation.slice(0, 5).map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={18} /><span>{label.replace('Career ', '').replace('Explore ', '')}</span></NavLink>)}
      </nav>
    </div>
  )
}

export function RoleGate({ children }: { children: React.ReactNode }) {
  const { user } = useApp()
  if (user?.role === 'ADMIN') return <>{children}</>
  return <div className="empty-state"><ShieldCheck size={24} /><h3>Administrator access only</h3><p>This section is protected by role-based access control. Use the included admin demo account to view it.</p><Tag tone="violet">admin@pathwise.in · Admin123!</Tag></div>
}
