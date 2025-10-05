import { env } from '@/lib/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from '@/db/schemas'
import postgres from 'postgres'

const connection = postgres(env.DATABASE_URL, {
  prepare: false,
})

export const db = drizzle(connection, {
  schema,
  casing: 'snake_case',
})
