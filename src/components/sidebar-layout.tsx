import {
  BarChart3,
  Folder,
  FolderPlus,
  Home,
  LogOut,
  User,
  Wand2,
} from 'lucide-react'
import { useLocation, NavLink, useNavigate } from 'react-router-dom'
import { clearToken, getToken } from '@/lib/auth'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const navLinks = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/profile', label: 'Perfil', icon: User },
  { to: '/projects/new', label: 'Criar projeto', icon: FolderPlus },
  { to: '/projects', label: 'Projetos', icon: Folder },
]

type BreadcrumbItem = {
  label: string
  to: string
  isCurrent?: boolean
}

function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  const labelMap: Record<string, string> = {
    room: 'Sala',
    audio: 'Áudio',
    profile: 'Perfil',
    projects: 'Projetos',
    new: 'Novo projeto',
  }

  const crumbs: BreadcrumbItem[] = [{ label: 'Início', to: '/' }]

  segments.forEach((segment, index) => {
    const path = `/${segments.slice(0, index + 1).join('/')}`
    const label = labelMap[segment] ?? (segment.length > 10 ? `${segment.slice(0, 10)}…` : segment)
    crumbs.push({
      label,
      to: path,
      isCurrent: index === segments.length - 1,
    })
  })

  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-muted-foreground">
      {crumbs.map((crumb, index) => (
        <div className="flex items-center gap-2" key={crumb.to}>
          {index > 0 ? <span className="text-muted-foreground/70">/</span> : null}
          {crumb.isCurrent ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <NavLink className="hover:text-foreground" to={crumb.to}>
              {crumb.label}
            </NavLink>
          )}
        </div>
      ))}
    </nav>
  )
}

function SidebarNav() {
  const navigate = useNavigate()

  function handleLogout() {
    clearToken()
    navigate('/login')
  }

  const userInitials = 'RN'

  return (
    <aside className="flex h-screen w-64 flex-col gap-4 border-r bg-card px-4 py-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Wand2 className="size-5" />
          </div>
          <div>
            <p className="font-semibold leading-tight">Agent System</p>
            <p className="text-muted-foreground text-xs">Workspace</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Navegação
        </p>
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.25)]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )
              }
            >
              <Icon className="size-4" />
              <span>{link.label}</span>
            </NavLink>
          )
        })}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-3 rounded-lg border bg-muted/30 px-3 py-3">
          <Avatar className="border border-primary/20">
            <AvatarImage alt="Avatar" src="" />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium leading-tight">Renato Nascimento</span>
            <span className="text-muted-foreground text-xs">renato@example.com</span>
          </div>
        </div>
        <button
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-6 py-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="size-5 text-muted-foreground" />
            <Breadcrumbs />
          </div>
          {getToken() ? (
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Conectado
            </span>
          ) : null}
        </header>
        <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
      </div>
    </div>
  )
}
