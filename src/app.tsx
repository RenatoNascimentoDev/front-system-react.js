import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { getToken } from './lib/auth'
import { CreateRoom } from './pages/create-room'
import { Login } from './pages/login'
import { RecordRoomAudio } from './pages/record-room-audio'
import { Register } from './pages/register'
import { Room } from './pages/room'

const queryClient = new QueryClient()

function RequireAuth({ children }: { children: JSX.Element }) {
  const token = getToken()

  if (!token) {
    return <Navigate replace to="/login" />
  }

  return children
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<RequireAuth><CreateRoom /></RequireAuth>} index />
          <Route element={<RequireAuth><Room /></RequireAuth>} path="/room/:roomId" />
          <Route element={<RequireAuth><RecordRoomAudio /></RequireAuth>} path="/room/:roomId/audio" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
