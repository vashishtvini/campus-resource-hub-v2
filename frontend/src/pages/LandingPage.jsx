import { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { BookOpen, Upload, Search, Star, ArrowRight, Zap, Users, Shield } from 'lucide-react'
import { isAuthed } from '../lib/auth'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001'

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

const FEATURES = [
  {
    icon: <Search size={22} />,
    title: 'Smart Search',
    desc: 'Full-text search across titles and subjects. Find exactly what you need, instantly.',
    color: 'var(--primary)',
    bg: 'rgba(124,58,237,0.12)',
  },
  {
    icon: <Upload size={22} />,
    title: 'Easy Upload',
    desc: 'Drag and drop your files. Share notes, PYQs and assignments in seconds.',
    color: 'var(--secondary)',
    bg: 'rgba(6,182,212,0.12)',
  },
  {
    icon: <Star size={22} />,
    title: 'Community Votes',
    desc: 'Upvote quality resources so the best content rises to the top for everyone.',
    color: 'var(--accent)',
    bg: 'rgba(245,158,11,0.12)',
  },
  {
    icon: <Shield size={22} />,
    title: 'Secure Google Login',
    desc: 'One click sign-in with your Google account — no passwords, always secure.',
    color: 'var(--success)',
    bg: 'rgba(16,185,129,0.12)',
  },
  {
    icon: <BookOpen size={22} />,
    title: 'Filter by Semester',
    desc: 'Narrow results to your semester, subject, and resource type instantly.',
    color: 'var(--primary-light)',
    bg: 'rgba(167,139,250,0.12)',
  },
  {
    icon: <Users size={22} />,
    title: 'Built for Campus',
    desc: 'Purpose-built for university students sharing the academic journey together.',
    color: 'var(--secondary-light)',
    bg: 'rgba(103,232,249,0.12)',
  },
]

export function LandingPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthed()) navigate('/browse', { replace: true })
  }, [navigate])

  function handleGoogleLogin() {
    window.location.href = `${API_BASE}/api/auth/google`
  }

  return (
    <div className="landing">
      {/* Animated background */}
      <div className="landing-bg">
        <div className="orb orb-primary" style={{ width: 650, height: 650, top: -180, left: -120 }} />
        <div className="orb orb-secondary" style={{ width: 520, height: 520, top: 220, right: -120 }} />
        <div className="orb orb-accent" style={{ width: 420, height: 420, bottom: 120, left: '28%' }} />
      </div>
      <div className="landing-grid" />

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-eyebrow animate-fadeInUp" style={{ animationDelay: '0s' }}>
          <Zap size={13} />
          Open-source campus knowledge base
        </div>

        <h1 className="hero-title animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
          Study smarter with<br />
          <span className="gradient-text">shared knowledge</span>
        </h1>

        <p className="hero-subtitle animate-fadeInUp" style={{ animationDelay: '0.18s' }}>
          Access notes, PYQs, and assignments uploaded by your peers.<br />
          Contribute, vote, and help your campus community thrive.
        </p>

        <div className="hero-actions animate-fadeInUp" style={{ animationDelay: '0.26s' }}>
          <button
            id="btn-google-login"
            className="btn-google"
            onClick={handleGoogleLogin}
            aria-label="Continue with Google"
          >
            <GoogleIcon />
            Continue with Google
          </button>
          <Link to="/browse" className="btn btn-outline btn-lg" id="btn-browse-guest">
            Browse as Guest
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="hero-stats animate-fadeInUp" style={{ animationDelay: '0.34s' }}>
          {[
            { label: 'Resources', value: '500+' },
            { label: 'Subjects',  value: '80+'  },
            { label: 'Students',  value: '1K+'  },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div className="hero-stat-value">{value}</div>
              <div className="hero-stat-label">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features container">
        <h2 className="features-title animate-fadeInUp">Everything you need to ace your semester</h2>
        <div className="features-grid">
          {FEATURES.map(({ icon, title, desc, color, bg }, i) => (
            <div
              key={title}
              className="feature-card card card-hover animate-fadeInUp"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <div className="feature-icon" style={{ background: bg, color }}>
                {icon}
              </div>
              <h3 className="feature-title">{title}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta container">
        <div className="cta-card card animate-fadeInUp">
          <div className="orb orb-primary" style={{ width: 400, height: 400, top: -160, right: -80, opacity: 0.55 }} />
          <div className="orb orb-secondary" style={{ width: 300, height: 300, bottom: -100, left: -60, opacity: 0.45 }} />
          <h2 className="cta-title">Ready to start learning smarter?</h2>
          <p className="cta-subtitle">Join thousands of students sharing knowledge every day — it's completely free.</p>
          <button
            id="btn-google-login-cta"
            className="btn-google"
            onClick={handleGoogleLogin}
            aria-label="Sign in with Google"
          >
            <GoogleIcon />
            Sign in with Google — it's free
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="landing-footer">
        <div className="landing-footer-logo">
          <div className="navbar-logo-icon" style={{ width: 28, height: 28, fontSize: 14 }}>📚</div>
          <span>Campus Resource Hub</span>
        </div>
        <span style={{ color: 'var(--text-faint)', fontSize: '0.85rem' }}>
          Built with ❤️ for students
        </span>
      </footer>
    </div>
  )
}
