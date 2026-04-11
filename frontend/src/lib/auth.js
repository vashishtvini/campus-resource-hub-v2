const TOKEN_KEY = 'crh_token'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
}

export function isAuthed() {
  return Boolean(getToken())
}

/** Decode JWT payload (no verification — just for display). */
export function getUser() {
  const token = getToken()
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.avatar,
    }
  } catch {
    return null
  }
}
