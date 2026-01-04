import { useMutation } from '@tanstack/react-query'
import { buildAuthHeader } from '@/lib/auth'

type ChangePasswordPayload = {
  currentPassword: string
  newPassword: string
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordPayload) => {
      const res = await fetch('http://localhost:3333/users/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeader(),
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null)
        const message = errorBody?.message ?? 'Falha ao trocar senha'
        throw new Error(message)
      }

      return res.json() as Promise<{ message: string }>
    },
  })
}
