import { getClientes } from '@/app/actions/agendamentos'
import { ClientesClient } from './clientes-client'

export default async function ClientesPage() {
  const clientes = await getClientes()
  return <ClientesClient clientes={clientes} />
}
