import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import z from 'zod/v4'
import { signUp } from '@/http/use-sign-up'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const passwordRulesMessage =
  'Senha deve ter 10 a 15 caracteres, incluir 1 maiúscula, 1 número e 1 símbolo.'

const registerSchema = z.object({
  name: z.string().min(3, { message: 'Nome deve ter no mínimo 3 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  password: z
    .string()
    .min(10, { message: passwordRulesMessage })
    .max(15, { message: passwordRulesMessage })
    .regex(/[A-Z]/, { message: passwordRulesMessage })
    .regex(/\d/, { message: passwordRulesMessage })
    .regex(/[^A-Za-z0-9]/, { message: passwordRulesMessage }),
})

type RegisterFormData = z.infer<typeof registerSchema>

function PasswordErrorPopup({ message }: { message: string }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-right-4">
      <div className="flex min-w-[280px] flex-col gap-1 rounded-lg border border-destructive/30 bg-card p-4 shadow-lg shadow-destructive/10">
        <p className="text-destructive font-semibold">Senha inválida</p>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

export function Register() {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  const passwordError = form.formState.errors.password?.message
  const isPasswordTouched = form.formState.touchedFields.password
  const showPasswordPopup =
    !!passwordError && (form.formState.isSubmitted || isPasswordTouched)

  async function handleRegister(values: RegisterFormData) {
    try {
      setErrorMessage(null)
      await signUp(values)
      navigate('/login')
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Erro ao criar conta. Tente novamente.'
      setErrorMessage(message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Criar conta</CardTitle>
          <CardDescription>Comece criando sua conta gratuita.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleRegister)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Seu nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input placeholder="••••••••" type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage ? (
                <p className="text-destructive text-sm">{errorMessage}</p>
              ) : null}

              <Button
                className="group relative w-full overflow-hidden border border-primary/30 transition-all duration-300 hover:-translate-y-[1px] hover:border-primary/70 hover:shadow-[0_0_0_2px_rgba(59,130,246,0.4),0_0_24px_rgba(59,130,246,0.4)]"
                type="submit"
              >
                <span className="pointer-events-none absolute inset-[-40%] bg-gradient-to-r from-primary/20 via-primary/35 to-primary/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-70" />
                <span className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/60 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]" />
                <span className="relative font-semibold tracking-wide drop-shadow-md">Criar conta</span>
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link className="text-primary hover:underline" to="/login">
              Entrar
            </Link>
          </p>
        </CardFooter>
      </Card>

      {showPasswordPopup && passwordError ? (
        <PasswordErrorPopup message={passwordError} />
      ) : null}
    </div>
  )
}
