import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function Profile() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Gerencie suas informações pessoais.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-primary/30">
              <AvatarImage alt="Avatar" src="" />
              <AvatarFallback>RN</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold leading-tight">Renato Nascimento</p>
              <p className="text-muted-foreground text-sm">renato@example.com</p>
            </div>
            <div className="ml-auto">
              <Button variant="outline">Trocar foto</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Plano</p>
              <p className="font-semibold">Free</p>
            </div>
            <div className="rounded-lg border bg-muted/20 p-4">
              <p className="text-sm text-muted-foreground">Notificações</p>
              <p className="font-semibold">Ativas</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
