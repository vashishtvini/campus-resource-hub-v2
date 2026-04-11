import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { setToken } from '../lib/auth'

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setToken(token)
      navigate('/browse', { replace: true })
    } else {
      navigate('/?error=auth_failed', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="callback-page">
      <div className="callback-spinner" />
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Signing you in…</p>
    </div>
  )
}
