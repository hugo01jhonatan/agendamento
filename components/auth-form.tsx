'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarDays } from 'lucide-react'

interface Props {
  mode: 'sign-in' | 'sign-up'
}

export function AuthForm({ mode }: Props) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'sign-up') {
        const res = await authClient.signUp.email({ email, password, name })
        if (res.error) throw new Error(res.error.message)
      } else {
        const res = await authClient.signIn.email({ email, password })
        if (res.error) throw new Error(res.error.message)
      }
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--color-primary)]">
            <CalendarDays className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Agendamento</h1>
          <p className="text-sm text-[var(--color-muted)]">
            {mode === 'sign-in' ? 'Entre na sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'sign-up' && (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-[var(--radius)] px-3 py-2">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? 'Aguarde...' : mode === 'sign-in' ? 'Entrar' : 'Criar conta'}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
            {mode === 'sign-in' ? (
              <>
                Ainda não tem conta?{' '}
                <a href="/sign-up" className="text-[var(--color-primary)] hover:underline">
                  Cadastre-se
                </a>
              </>
            ) : (
              <>
                Já tem uma conta?{' '}
                <a href="/sign-in" className="text-[var(--color-primary)] hover:underline">
                  Entrar
                </a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
