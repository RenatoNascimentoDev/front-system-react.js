import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/http/use-current-user'
import { useUploadAvatar } from '@/http/use-upload-avatar'
import { useChangePassword } from '@/http/use-change-password'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import z from 'zod/v4'
import { Eye, EyeOff } from 'lucide-react'

const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5MB

export function Profile() {
  const { data, isLoading } = useCurrentUser()
  const { mutateAsync: uploadAvatar, isPending, error } = useUploadAvatar()
  const { mutateAsync: changePassword, isPending: isChangingPassword, error: changeError } =
    useChangePassword()
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAvatarPreviewOpen, setIsAvatarPreviewOpen] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

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

  const passwordRulesMessage =
    'Senha deve ter 10 a 15 caracteres, incluir 1 maiúscula, 1 número e 1 símbolo.'

  const passwordSchema = z
    .string()
    .min(10, { message: passwordRulesMessage })
    .max(15, { message: passwordRulesMessage })
    .regex(/[A-Z]/, { message: passwordRulesMessage })
    .regex(/\d/, { message: passwordRulesMessage })
    .regex(/[^A-Za-z0-9]/, { message: passwordRulesMessage })

  const changePasswordSchema = z
    .object({
      currentPassword: z.string().min(1, { message: 'Informe a senha atual' }),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(1, { message: 'Confirme a nova senha' }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    })

  type ChangePasswordData = z.infer<typeof changePasswordSchema>

  const passwordForm = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > MAX_AVATAR_BYTES) {
      setLocalError('A foto deve ter no máximo 5MB.')
      event.target.value = ''
      return
    }

    setLocalError(null)
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
    setLocalError(null)
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

  function handleOpenAvatarPreview() {
    if (!avatar) return
    setIsAvatarPreviewOpen(true)
  }

  function handleCloseAvatarPreview() {
    setIsAvatarPreviewOpen(false)
  }

  async function onSubmitPassword(values: ChangePasswordData) {
    setSuccessMessage(null)
    await changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    })
    setSuccessMessage('Senha atualizada com sucesso!')
    passwordForm.reset()
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Gerencie suas informações pessoais.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <button
              aria-label="Ver foto de perfil"
              className="w-fit rounded-full transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
              disabled={!avatar}
              onClick={handleOpenAvatarPreview}
              type="button"
            >
              <Avatar className="h-16 w-16 border border-primary/30">
                <AvatarImage alt="Avatar" src={avatar} />
                {!avatar ? <AvatarFallback>{initials}</AvatarFallback> : null}
              </Avatar>
            </button>
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
          {localError ? (
            <p className="text-destructive text-sm">{localError}</p>
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

      <Card>
        <CardHeader>
          <CardTitle>Alterar senha</CardTitle>
          <CardDescription>Defina uma nova senha com regras de segurança.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form className="space-y-4" onSubmit={passwordForm.handleSubmit(onSubmitPassword)}>
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha atual</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••"
                          type={showCurrent ? 'text' : 'password'}
                          {...field}
                        />
                        <button
                          aria-label="Mostrar ou ocultar senha atual"
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                          onClick={(e) => {
                            e.preventDefault()
                            setShowCurrent((prev) => !prev)
                          }}
                          type="button"
                        >
                          {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="••••••••••"
                          type={showNew ? 'text' : 'password'}
                          {...field}
                        />
                        <button
                          aria-label="Mostrar ou ocultar nova senha"
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                          onClick={(e) => {
                            e.preventDefault()
                            setShowNew((prev) => !prev)
                          }}
                          type="button"
                        >
                          {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar nova senha</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Repita a nova senha"
                          type={showConfirm ? 'text' : 'password'}
                          {...field}
                        />
                        <button
                          aria-label="Mostrar ou ocultar confirmação de senha"
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                          onClick={(e) => {
                            e.preventDefault()
                            setShowConfirm((prev) => !prev)
                          }}
                          type="button"
                        >
                          {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {changeError ? (
                <p className="text-destructive text-sm">{changeError.message}</p>
              ) : null}

              <Button className="w-full md:w-auto" disabled={isChangingPassword} type="submit">
                {isChangingPassword ? 'Salvando...' : 'Salvar nova senha'}
              </Button>
            </form>
          </Form>
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

      {isAvatarPreviewOpen ? (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 px-4"
          onClick={handleCloseAvatarPreview}
          role="button"
          tabIndex={-1}
        >
          <div className="relative">
            <img
              alt="Avatar ampliado"
              className="h-64 w-64 rounded-3xl object-cover shadow-2xl ring-2 ring-primary/40"
              src={avatar}
            />
            <Button
              aria-label="Fechar pré-visualização"
              className="absolute right-2 top-2"
              onClick={(e) => {
                e.stopPropagation()
                handleCloseAvatarPreview()
              }}
              size="sm"
              variant="secondary"
            >
              Fechar
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
