import { useQuery } from '@tanstack/react-query'
import { buildAuthHeader } from '@/lib/auth'

type CurrentUserResponse = {
  user: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
  }
}

export function useCurrentUser() {
  return useQuery<CurrentUserResponse>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3333/me', {
        headers: {
          ...buildAuthHeader(),
        },
      })

      if (!res.ok) {
        throw new Error('Não foi possível carregar o usuário')
      }

      return res.json()
    },
  })
}
