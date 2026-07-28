'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Users, Phone, Mail } from 'lucide-react'
import { createCliente, deleteCliente } from '@/app/actions/agendamentos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

type ClienteRow = Awaited<ReturnType<typeof import('@/app/actions/agendamentos').getClientes>>[number]

interface Props {
  clientes: ClienteRow[]
}

export function ClientesClient({ clientes }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [observacoes, setObservacoes] = useState('')

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return
    startTransition(async () => {
      await createCliente({ nome, email: email || undefined, telefone: telefone || undefined, observacoes: observacoes || undefined })
      setOpen(false)
      setNome('')
      setEmail('')
      setTelefone('')
      setObservacoes('')
    })
  }

  function handleDelete(id: number) {
    startTransition(() => deleteCliente(id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Clientes</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">{clientes.length} cadastrado{clientes.length !== 1 ? 's' : ''}</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" />
              Novo cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo cliente</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nome">Nome *</Label>
                <Input id="nome" placeholder="Nome completo" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" placeholder="email@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="telefone">Telefone</Label>
                <Input id="telefone" placeholder="(00) 90000-0000" value={telefone} onChange={e => setTelefone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="obs">Observações</Label>
                <Textarea id="obs" placeholder="Notas sobre o cliente..." value={observacoes} onChange={e => setObservacoes(e.target.value)} />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button type="submit" disabled={isPending || !nome.trim()}>
                  {isPending ? 'Salvando...' : 'Cadastrar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {clientes.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-muted)]">
            <Users className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Nenhum cliente cadastrado.</p>
          </div>
        ) : (
          clientes.map(c => (
            <div key={c.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] font-semibold text-sm">
                  {c.nome.charAt(0).toUpperCase()}
                </div>
                <button
                  onClick={() => handleDelete(c.id)}
                  disabled={isPending}
                  className="text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-[var(--color-foreground)] mb-1">{c.nome}</h3>
              {c.email && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] mb-1">
                  <Mail className="w-3 h-3" />
                  {c.email}
                </div>
              )}
              {c.telefone && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--color-muted)]">
                  <Phone className="w-3 h-3" />
                  {c.telefone}
                </div>
              )}
              {c.observacoes && (
                <p className="text-xs text-[var(--color-muted)] mt-2 border-t border-[var(--color-border)] pt-2 line-clamp-2">
                  {c.observacoes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
