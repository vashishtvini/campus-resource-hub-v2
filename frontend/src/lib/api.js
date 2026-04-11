const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001'

export async function apiFetch(path, opts = {}) {
  const token = localStorage.getItem('crh_token')
  const headers = { ...(opts.headers || {}) }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || res.statusText)
  }
  return res.json()
}

export async function apiJson(path, { body, ...opts } = {}) {
  return apiFetch(path, {
    ...opts,
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    body: body ? JSON.stringify(body) : undefined,
  })
}
