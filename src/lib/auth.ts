const KEY = 'agent-auth-token'

const canUseStorage = typeof localStorage !== 'undefined'

export function saveToken(token: string) {
  if (!canUseStorage) return
  localStorage.setItem(KEY, token)
}

export function getToken() {
  if (!canUseStorage) return null
  return localStorage.getItem(KEY)
}

export function clearToken() {
  if (!canUseStorage) return
  localStorage.removeItem(KEY)
}

export function buildAuthHeader(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
