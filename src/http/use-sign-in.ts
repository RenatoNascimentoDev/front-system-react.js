import { saveToken } from '@/lib/auth'

type SignInPayload = { email: string; password: string }

export async function signIn(data: SignInPayload) {
  const res = await fetch('http://localhost:3333/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    const message = errorBody?.message ?? 'Falha no login'
    throw new Error(message)
  }

  const json: { token: string } = await res.json()

  saveToken(json.token)

  return json
}
