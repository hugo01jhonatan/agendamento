'use client'

import { useState, useTransition } from 'react'
import { Plus, Trash2, Briefcase, Clock, DollarSign } from 'lucide-react'
import { createServico, deleteServico } from '@/app/actions/agendamentos'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

type ServicoRow = Awaited<ReturnType<typeof import('@/app/actions/agendamentos').getServicos>>[number]

interface Props {
  servicos: ServicoRow[]
}

function formatPreco(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ServicosClient({ servicos }: Props) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [nome, setNome] = useState('')
  const [duracao, setDuracao] = useState('60')
  const [preco, setPreco] = useState('')
  const [descricao, setDescricao] = useState('')

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim()) return
    const precoEmCentavos = Math.round(parseFloat(preco.replace(',', '.') || '0') * 100)
    startTransition(async () => {
      await createServico({
        nome,
        duracao: Number(duracao),
        preco: precoEmCentavos,
        descricao: descricao || undefined,
      })
      setOpen(false)
      setNome('')
      setDuracao('60')
      setPreco('')
      setDescricao('')
    })
  }

  function handleDelete(id: number) {
    startTransition(() => deleteServico(id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-foreground)]">Serviços</h1>
          <p className="text-sm text-[var(--color-muted)] mt-1">{servicos.length} cadastrado{servicos.length !== 1 ? 's' : ''}</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4" />
              Novo serviço
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo serviço</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="nome">Nome *</Label>
                <Input id="nome" placeholder="Ex: Corte de cabelo" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="duracao">Duração (min) *</Label>
                  <Input id="duracao" type="number" min="5" step="5" value={duracao} onChange={e => setDuracao(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input id="preco" type="text" placeholder="0,00" value={preco} onChange={e => setPreco(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="desc">Descrição</Label>
                <Textarea id="desc" placeholder="Descreva o serviço..." value={descricao} onChange={e => setDescricao(e.target.value)} />
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
        {servicos.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-muted)]">
            <Briefcase className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">Nenhum serviço cadastrado.</p>
          </div>
        ) : (
          servicos.map(s => (
            <div key={s.id} className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--color-accent)]/15">
                  <Briefcase className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <button
                  onClick={() => handleDelete(s.id)}
                  disabled={isPending}
                  className="text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-[var(--color-foreground)] mb-2">{s.nome}</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs text-[var(--color-muted)]">
                  <Clock className="w-3 h-3" />
                  {s.duracao} min
                </div>
                {s.preco > 0 && (
                  <div className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                    <DollarSign className="w-3 h-3" />
                    {formatPreco(s.preco)}
                  </div>
                )}
              </div>
              {s.descricao && (
                <p className="text-xs text-[var(--color-muted)] mt-2 border-t border-[var(--color-border)] pt-2 line-clamp-2">
                  {s.descricao}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
