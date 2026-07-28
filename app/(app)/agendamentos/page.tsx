import { getAgendamentos, getClientes, getServicos } from '@/app/actions/agendamentos'
import { AgendamentosClient } from './agendamentos-client'

export default async function AgendamentosPage() {
  const [agendamentos, clientes, servicos] = await Promise.all([
    getAgendamentos(),
    getClientes(),
    getServicos(),
  ])

  return <AgendamentosClient agendamentos={agendamentos} clientes={clientes} servicos={servicos} />
}
