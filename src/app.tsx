import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { getToken } from './lib/auth'
import { SidebarLayout } from './components/sidebar-layout'
import { CreateRoom } from './pages/create-room'
import { CreateProject } from './pages/create-project'
import { Login } from './pages/login'
import { Profile } from './pages/profile'
import { Projects } from './pages/projects'
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

function ProtectedLayout() {
  return (
    <RequireAuth>
      <SidebarLayout>
        <Outlet />
      </SidebarLayout>
    </RequireAuth>
  )
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<Register />} path="/register" />
          <Route element={<ProtectedLayout />}>
            <Route element={<CreateRoom />} index />
            <Route element={<Room />} path="/room/:roomId" />
            <Route element={<RecordRoomAudio />} path="/room/:roomId/audio" />
            <Route element={<Profile />} path="/profile" />
            <Route element={<Projects />} path="/projects" />
            <Route element={<CreateProject />} path="/projects/new" />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
