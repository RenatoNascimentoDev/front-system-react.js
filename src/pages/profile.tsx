import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/http/use-current-user'
import { useUploadAvatar } from '@/http/use-upload-avatar'

export function Profile() {
  const { data, isLoading } = useCurrentUser()
  const { mutateAsync: uploadAvatar, isPending, error } = useUploadAvatar()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const name = data?.user.name ?? 'Usuário'
  const email = data?.user.email ?? '—'
  const currentAvatar = data?.user.avatarUrl ?? ''
  const avatar = previewUrl ?? currentAvatar
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || 'US'

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setIsDialogOpen(true)
  }

  function handlePickFile() {
    fileInputRef.current?.click()
  }

  function handleCloseDialog() {
    setIsDialogOpen(false)
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  async function handleConfirmUpload() {
    if (!selectedFile) return
    setSuccessMessage(null)
    await uploadAvatar(selectedFile)
    setSuccessMessage('Avatar atualizado com sucesso!')
    handleCloseDialog()
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Gerencie suas informações pessoais.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Avatar className="h-16 w-16 border border-primary/30">
              <AvatarImage alt="Avatar" src={avatar} />
              {!avatar ? <AvatarFallback>{initials}</AvatarFallback> : null}
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="font-semibold leading-tight">
                {isLoading ? 'Carregando...' : name}
              </p>
              <p className="text-muted-foreground text-sm">{isLoading ? '—' : email}</p>
            </div>
            <div className="md:ml-auto">
              <input
                accept="image/png,image/jpeg,image/jpg,image/webp"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                type="file"
              />
              <Button
                className="w-full md:w-auto"
                disabled={isPending}
                onClick={handlePickFile}
                variant="outline"
              >
                {isPending ? 'Enviando...' : 'Trocar foto'}
              </Button>
            </div>
          </div>

          {error ? (
            <p className="text-destructive text-sm">{error.message}</p>
          ) : null}
          {successMessage ? (
            <p className="text-emerald-500 text-sm">{successMessage}</p>
          ) : null}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

      {isDialogOpen ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border bg-card shadow-xl">
            <div className="border-b px-4 py-3">
              <p className="font-semibold">Confirmar nova foto</p>
              <p className="text-muted-foreground text-sm">Veja como sua foto ficará antes de salvar.</p>
            </div>
            <div className="flex flex-col items-center gap-4 px-6 py-6">
              <div className="h-28 w-28 overflow-hidden rounded-full border border-primary/30 shadow-inner">
                {previewUrl ? (
                  <img alt="Pré-visualização do avatar" className="h-full w-full object-cover" src={previewUrl} />
                ) : null}
              </div>
              <div className="flex w-full flex-col gap-2">
                <Button
                  className="w-full"
                  disabled={isPending}
                  onClick={handleConfirmUpload}
                >
                  {isPending ? 'Salvando...' : 'Confirmar'}
                </Button>
                <Button className="w-full" onClick={handleCloseDialog} variant="outline">
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
