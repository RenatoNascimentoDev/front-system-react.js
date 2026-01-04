import { useMutation, useQueryClient } from '@tanstack/react-query'
import { buildAuthHeader } from '@/lib/auth'

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('avatar', file)

      const res = await fetch('http://localhost:3333/users/avatar', {
        method: 'POST',
        headers: {
          ...buildAuthHeader(),
        },
        body: formData,
      })

      if (!res.ok) {
        const errorBody = await res.json().catch(() => null)
        const message = errorBody?.message ?? 'Falha ao enviar avatar'
        throw new Error(message)
      }

      const data: { avatarUrl: string } = await res.json()
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
  })
}
