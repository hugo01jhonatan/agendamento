import { getServicos } from '@/app/actions/agendamentos'
import { ServicosClient } from './servicos-client'

export default async function ServicosPage() {
  const servicos = await getServicos()
  return <ServicosClient servicos={servicos} />
}
