type SignUpPayload = { name: string; email: string; password: string }
export async function signUp(data: SignUpPayload) {
  const res = await fetch('http://localhost:3333/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null)
    const message = errorBody?.message ?? 'Falha no cadastro'
    throw new Error(message)
  }
}
