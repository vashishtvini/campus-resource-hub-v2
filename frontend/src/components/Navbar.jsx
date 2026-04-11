import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Search, Upload, LogOut, BookOpen } from 'lucide-react'
import { getUser, clearToken, isAuthed } from '../lib/auth'

export function Navbar() {
  const navigate = useNavigate()
  const user = getUser()
  const authed = isAuthed()

  function handleLogout() {
    clearToken()
    navigate('/', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to={authed ? '/browse' : '/'} className="navbar-logo">
          <div className="navbar-logo-icon">📚</div>
          <span>Campus Hub</span>
        </Link>

        {/* Nav Links */}
        <div className="navbar-links">
          <NavLink
            to="/browse"
            id="nav-browse"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            <Search size={15} />
            Browse
          </NavLink>
          {authed && (
            <NavLink
              to="/upload"
              id="nav-upload"
              className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
            >
              <Upload size={15} />
              Upload
            </NavLink>
          )}
        </div>

        {/* Auth Actions */}
        <div className="navbar-actions">
          {authed && user ? (
            <>
              <div className="user-badge" id="user-badge">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="user-avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="user-avatar-fallback">
                    {user.name?.[0]?.toUpperCase() || '?'}
                  </div>
                )}
                <span className="user-name">{user.name?.split(' ')[0]}</span>
              </div>
              <button
                id="btn-logout"
                className="btn btn-outline btn-sm"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut size={13} />
                Sign out
              </button>
            </>
          ) : (
            <Link to="/" className="btn btn-primary btn-sm" id="btn-signin">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
