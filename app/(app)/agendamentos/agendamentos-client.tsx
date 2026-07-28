'use client'

import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Plus, Trash2, CalendarDays } from 'lucide-react'
import { createAgendamento, updateAgendamentoStatus, deleteAgendamento } from '@/app/actions/agendamentos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
type AgendamentoRow = Awaited<ReturnType<typeof import('@/app/actions/agendamentos').getAgendamentos>>[number]
type ClienteRow = Awaited<ReturnType<typeof import('@/app/actions/agendamentos').getClientes>>[number]
type ServicoRow = Awaited<ReturnType<typeof import('@/app/actions/agendamentos').getServicos>>[number]

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

interface Props {
  agendamentos: AgendamentoRow[]
  clientes: ClienteRow[]
  servicos: ServicoRow[]
}

export function AgendamentosClient({ agendamentos, clientes, servicos }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [clienteId, setClienteId] = useState('')
  const [servicoId, setServicoId] = useState('')
  const [dataHora, setDataHora] = useState('')
  const [observacoes, setObservacoes] = useState('')

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!clienteId || !servicoId || !dataHora) return
    startTransition(async () => {
      await createAgendamento({
        clienteId: Number(clienteId),
        servicoId: Number(servicoId),
        dataHora: new Date(dataHora),
        observacoes: observacoes || undefined,
      })
      setOpen(false)
      setClienteId('')
      setServicoId('')
      setDataHora('')
      setObservacoes('')
    })
  }

  function handleStatus(id: number, status: string) {
    startTransition(() => updateAgendamentoStatus(id, status))
  }

  function handleDelete(id: number) {
    startTransition(() => deleteAgendamento(id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Agendamentos</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">{agendamentos.length} no total</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" />
              Novo agendamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo agendamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label>Cliente</Label>
                <Select value={clienteId} onValueChange={setClienteId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Serviço</Label>
                <Select value={servicoId} onValueChange={setServicoId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o serviço" />
                  </SelectTrigger>
                  <SelectContent>
                    {servicos.map(s => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.nome} — {s.duracao}min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Data e hora</Label>
                <Input
                  type="datetime-local"
                  value={dataHora}
                  onChange={e => setDataHora(e.target.value)}
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Observações (opcional)</Label>
                <Textarea
                  placeholder="Alguma nota sobre este agendamento..."
                  value={observacoes}
                  onChange={e => setObservacoes(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending || !clienteId || !servicoId || !dataHora}>
                  {isPending ? 'Salvando...' : 'Criar agendamento'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl">
        {agendamentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-[var(--color-muted)]">
            <CalendarDays className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Nenhum agendamento cadastrado.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--color-border)]">
            {agendamentos.map(a => (
              <div key={a.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-[var(--color-foreground)]">{a.clienteNome}</span>
                  <span className="text-xs text-[var(--color-muted)]">
                    {a.servicoNome} · {a.servicoDuracao} min ·{' '}
                    {format(new Date(a.dataHora), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={a.status} onValueChange={v => handleStatus(a.id, v)}>
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(statusLabels).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => handleDelete(a.id)}
                    disabled={isPending}
                    className="text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
