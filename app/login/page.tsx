'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { loginUser, registerUser } from '@/shared/api/auth'
import { useAuthStore } from '@/shared/store'
import { clearAuthClientStorage } from '@/shared/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const [activeTab, setActiveTab] = useState('login')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  })
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  })

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/account')
    }
  }, [isAuthenticated, router])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await loginUser({
        email: loginForm.email.trim(),
        password: loginForm.password,
      })

      login(result.user)

      if (result.token) {
        localStorage.setItem('token', result.token)
      }

      router.push('/account')
    } catch (error) {
      clearAuthClientStorage()
      setError(
        error instanceof Error ? error.message : 'Не удалось выполнить вход'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await registerUser({
        name: registerForm.name.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim() || undefined,
        password: registerForm.password,
      })

      login(result.user)

      if (result.token) {
        localStorage.setItem('token', result.token)
      }

      router.push('/account')
    } catch (error) {
      clearAuthClientStorage()
      setError(
        error instanceof Error ? error.message : 'Не удалось создать аккаунт'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-8 pb-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-md">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Вход и регистрация
          </h1>

          <div className="bg-card border border-border rounded-2xl p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full bg-muted/50">
                <TabsTrigger value="login" className="flex-1">
                  Вход
                </TabsTrigger>
                <TabsTrigger value="register" className="flex-1">
                  Регистрация
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="mt-6">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="login-email">
                      Email
                    </label>
                    <input
                      id="login-email"
                      type="email"
                      required
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="login-password"
                    >
                      Пароль
                    </label>
                    <input
                      id="login-password"
                      type="password"
                      required
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Введите пароль"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-70"
                  >
                    {isSubmitting ? 'Входим...' : 'Войти'}
                  </button>
                </form>
              </TabsContent>

              <TabsContent value="register" className="mt-6">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="reg-name">
                      Имя
                    </label>
                    <input
                      id="reg-name"
                      type="text"
                      required
                      value={registerForm.name}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          name: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Иван Петров"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="reg-email">
                      Email
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          email: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="reg-phone">
                      Телефон
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      value={registerForm.phone}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          phone: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      className="text-sm font-medium"
                      htmlFor="reg-password"
                    >
                      Пароль
                    </label>
                    <input
                      id="reg-password"
                      type="password"
                      required
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((prev) => ({
                          ...prev,
                          password: event.target.value,
                        }))
                      }
                      className="h-11 w-full rounded-lg bg-input border border-border px-3 text-sm text-foreground placeholder:text-muted-foreground"
                      placeholder="Введите пароль"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-70"
                  >
                    {isSubmitting ? 'Создаём...' : 'Зарегистрироваться'}
                  </button>
                </form>
              </TabsContent>
            </Tabs>

            {error && (
              <p className="mt-4 text-sm text-destructive">{error}</p>
            )}
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Возвращаясь на сайт, вы соглашаетесь с условиями обработки данных.{' '}
            <Link href="/about" className="text-primary hover:underline">
              Подробнее
            </Link>
          </p>
        </div>
      </div>
    </main>
  )
}
