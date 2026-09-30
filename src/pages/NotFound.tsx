import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="not-found-page animate-fade-in">
      <div>
        <div className="not-found__code">404</div>
        <h2 className="not-found__title">Page not found</h2>
        <p className="not-found__copy">
          The page you're looking for doesn't exist or may have moved.
          Let's get you back on track.
        </p>
        <div className="not-found__actions">
          <Button variant="primary" size="lg" onClick={() => window.history.back()}>
            ← Go back
          </Button>
          <Link to="/">
            <Button variant="secondary" size="lg">
              <Home size={16} /> Home
            </Button>
          </Link>
          <Link to="/careers">
            <Button variant="ghost" size="lg">
              <Search size={16} /> Explore careers
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
