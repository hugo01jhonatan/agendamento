import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  serial,
} from 'drizzle-orm/pg-core'

// ── Better Auth tables ────────────────────────────────────────────────────────

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull(),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull(),
  updatedAt: timestamp('updatedAt').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt'),
  updatedAt: timestamp('updatedAt'),
})

// ── App tables ────────────────────────────────────────────────────────────────

export const cliente = pgTable('cliente', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  nome: text('nome').notNull(),
  email: text('email'),
  telefone: text('telefone'),
  observacoes: text('observacoes'),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
})

export const servico = pgTable('servico', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  nome: text('nome').notNull(),
  duracao: integer('duracao').notNull().default(60), // minutos
  preco: integer('preco').notNull().default(0),      // centavos
  descricao: text('descricao'),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
})

export const agendamento = pgTable('agendamento', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  clienteId: integer('cliente_id').notNull(),
  servicoId: integer('servico_id').notNull(),
  dataHora: timestamp('data_hora').notNull(),
  status: text('status').notNull().default('pendente'), // pendente | confirmado | cancelado | concluido
  observacoes: text('observacoes'),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
})

export type Cliente = typeof cliente.$inferSelect
export type NewCliente = typeof cliente.$inferInsert
export type Servico = typeof servico.$inferSelect
export type NewServico = typeof servico.$inferInsert
export type Agendamento = typeof agendamento.$inferSelect
export type NewAgendamento = typeof agendamento.$inferInsert

// Re-export aliases used in client components
export type Client = Cliente
export type Appointment = Agendamento
