'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { CalendarDays, Users, Briefcase, LayoutDashboard, LogOut } from 'lucide-react'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/agendamentos', label: 'Agendamentos', icon: CalendarDays },
  { href: '/clientes', label: 'Clientes', icon: Users },
  { href: '/servicos', label: 'Serviços', icon: Briefcase },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push('/sign-in')
    router.refresh()
  }

  return (
    <aside className="flex flex-col w-60 min-h-screen bg-[var(--color-surface)] border-r border-[var(--color-border)]">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-[var(--color-border)]">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-primary)]">
          <CalendarDays className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-[var(--color-foreground)]">Agendamento</span>
      </div>

      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium transition-colors',
                active
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-foreground)]'
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-[var(--radius)] text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-foreground)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </aside>
  )
}
