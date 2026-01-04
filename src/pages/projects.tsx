import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { FolderOpen, Plus } from 'lucide-react'

const mockProjects = [
  { id: '1', name: 'Projeto Alpha', status: 'Em andamento' },
  { id: '2', name: 'Projeto Beta', status: 'Concluído' },
]

export function Projects() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projetos</h1>
          <p className="text-muted-foreground text-sm">
            Gerencie e acesse seus projetos existentes.
          </p>
        </div>
        <Link to="/projects/new">
          <Button className="gap-2">
            <Plus className="size-4" />
            Novo projeto
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockProjects.map((project) => (
          <Card key={project.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">{project.name}</CardTitle>
                <CardDescription>{project.status}</CardDescription>
              </div>
              <FolderOpen className="size-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-center justify-end gap-2">
              <Button variant="outline" size="sm">
                Abrir
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
