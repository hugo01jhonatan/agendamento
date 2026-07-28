'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { agendamento, cliente, servico } from '@/lib/db/schema'
import { and, desc, eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Não autorizado')
  return session.user.id
}

// ── Clientes ──────────────────────────────────────────────────────────────────

export async function getClientes() {
  const userId = await getUserId()
  return db.select().from(cliente).where(eq(cliente.userId, userId)).orderBy(desc(cliente.criadoEm))
}

export async function createCliente(data: { nome: string; email?: string; telefone?: string; observacoes?: string }) {
  const userId = await getUserId()
  await db.insert(cliente).values({ ...data, userId })
  revalidatePath('/clientes')
}

export async function deleteCliente(id: number) {
  const userId = await getUserId()
  await db.delete(cliente).where(and(eq(cliente.id, id), eq(cliente.userId, userId)))
  revalidatePath('/clientes')
}

// ── Serviços ──────────────────────────────────────────────────────────────────

export async function getServicos() {
  const userId = await getUserId()
  return db.select().from(servico).where(eq(servico.userId, userId)).orderBy(desc(servico.criadoEm))
}

export async function createServico(data: { nome: string; duracao: number; preco: number; descricao?: string }) {
  const userId = await getUserId()
  await db.insert(servico).values({ ...data, userId })
  revalidatePath('/servicos')
}

export async function deleteServico(id: number) {
  const userId = await getUserId()
  await db.delete(servico).where(and(eq(servico.id, id), eq(servico.userId, userId)))
  revalidatePath('/servicos')
}

// ── Agendamentos ──────────────────────────────────────────────────────────────

export async function getAgendamentos() {
  const userId = await getUserId()
  return db
    .select({
      id: agendamento.id,
      dataHora: agendamento.dataHora,
      status: agendamento.status,
      observacoes: agendamento.observacoes,
      criadoEm: agendamento.criadoEm,
      clienteNome: cliente.nome,
      clienteTelefone: cliente.telefone,
      servicoNome: servico.nome,
      servicoDuracao: servico.duracao,
      servicoPreco: servico.preco,
    })
    .from(agendamento)
    .leftJoin(cliente, eq(agendamento.clienteId, cliente.id))
    .leftJoin(servico, eq(agendamento.servicoId, servico.id))
    .where(eq(agendamento.userId, userId))
    .orderBy(desc(agendamento.dataHora))
}

export async function createAgendamento(data: {
  clienteId: number
  servicoId: number
  dataHora: Date
  observacoes?: string
}) {
  const userId = await getUserId()
  await db.insert(agendamento).values({ ...data, userId, status: 'pendente' })
  revalidatePath('/')
  revalidatePath('/agendamentos')
}

export async function updateAgendamentoStatus(id: number, status: string) {
  const userId = await getUserId()
  await db
    .update(agendamento)
    .set({ status })
    .where(and(eq(agendamento.id, id), eq(agendamento.userId, userId)))
  revalidatePath('/')
  revalidatePath('/agendamentos')
}

export async function deleteAgendamento(id: number) {
  const userId = await getUserId()
  await db.delete(agendamento).where(and(eq(agendamento.id, id), eq(agendamento.userId, userId)))
  revalidatePath('/')
  revalidatePath('/agendamentos')
}

export async function getDashboardStats() {
  const userId = await getUserId()
  const agendamentos = await db
    .select()
    .from(agendamento)
    .where(eq(agendamento.userId, userId))

  const clientes = await db
    .select()
    .from(cliente)
    .where(eq(cliente.userId, userId))

  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const amanha = new Date(hoje)
  amanha.setDate(amanha.getDate() + 1)

  const agendamentosHoje = agendamentos.filter(a => {
    const d = new Date(a.dataHora)
    return d >= hoje && d < amanha
  })

  const pendentes = agendamentos.filter(a => a.status === 'pendente').length
  const confirmados = agendamentos.filter(a => a.status === 'confirmado').length

  return {
    totalClientes: clientes.length,
    totalAgendamentos: agendamentos.length,
    agendamentosHoje: agendamentosHoje.length,
    pendentes,
    confirmados,
  }
}
