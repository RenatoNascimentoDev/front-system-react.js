import { useQuery } from "@tanstack/react-query"
import type { GetRoomQuestionsResponse } from "./types/get-room-questions-response"
import { buildAuthHeader } from "@/lib/auth"

export function useRoomQuestions(roomId: string) {
    return useQuery({
    queryKey: ['get-questions', roomId],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/rooms/${roomId}/questions`, {
        headers: {
          ...buildAuthHeader()
        }
      })
      const result: GetRoomQuestionsResponse = await response.json()

      return result
    },
  })
}
