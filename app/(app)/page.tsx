import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { getDashboardStats, getAgendamentos } from '@/app/actions/agendamentos'
import { CalendarDays, Users, Clock, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const statusColors: Record<string, string> = {
  pendente: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]',
  confirmado: 'bg-[var(--color-success)]/20 text-[var(--color-success)]',
  cancelado: 'bg-[var(--color-danger)]/20 text-[var(--color-danger)]',
  concluido: 'bg-[var(--color-accent)]/20 text-[var(--color-accent)]',
}

const statusLabels: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
  concluido: 'Concluído',
}

export default async function DashboardPage() {
  const [session, stats, agendamentos] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getDashboardStats(),
    getAgendamentos(),
  ])

  const proximos = agendamentos.slice(0, 5)

  const cards = [
    { label: 'Agendamentos hoje', value: stats.agendamentosHoje, icon: CalendarDays, color: 'text-[var(--color-primary)]', bg: 'bg-[var(--color-primary)]/10' },
    { label: 'Total de clientes', value: stats.totalClientes, icon: Users, color: 'text-[var(--color-accent)]', bg: 'bg-[var(--color-accent)]/10' },
    { label: 'Pendentes', value: stats.pendentes, icon: Clock, color: 'text-[var(--color-warning)]', bg: 'bg-[var(--color-warning)]/10' },
    { label: 'Confirmados', value: stats.confirmados, icon: CheckCircle, color: 'text-[var(--color-success)]', bg: 'bg-[var(--color-success)]/10' },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--color-foreground)]">
          Olá, {session?.user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-[var(--color-muted)] mt-1">
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-[var(--color-muted)]">{label}</span>
              <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-[var(--color-foreground)]">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
          <h2 className="font-semibold text-[var(--color-foreground)]">Próximos agendamentos</h2>
          <a href="/agendamentos" className="text-sm text-[var(--color-primary)] hover:underline">
            Ver todos
          </a>
        </div>

        {proximos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--color-muted)]">
            <CalendarDays className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Nenhum agendamento ainda.</p>
            <a href="/agendamentos" className="mt-2 text-sm text-[var(--color-primary)] hover:underline">
              Criar agendamento
            </a>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {proximos.map(a => (
              <div key={a.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[var(--color-foreground)]">{a.clienteNome}</span>
                  <span className="text-xs text-[var(--color-muted)]">{a.servicoNome} · {a.servicoDuracao} min</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[var(--color-muted)]">
                    {format(new Date(a.dataHora), "dd/MM HH:mm")}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[a.status] ?? 'bg-[var(--color-surface-raised)] text-[var(--color-muted)]'}`}>
                    {statusLabels[a.status] ?? a.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
