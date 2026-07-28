import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Agendamento — Gerencie seus horários',
  description: 'Sistema de agendamento para gerenciar clientes, serviços e horários.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="bg-[var(--color-background)]">
      <body className={`${inter.className} font-sans antialiased`}>{children}</body>
    </html>
  )
}
