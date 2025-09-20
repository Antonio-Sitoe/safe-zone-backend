import { Elysia } from 'elysia'
import { env } from './env'
import { cors } from '@elysiajs/cors'

export const corsPlugin = new Elysia().use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: env.CORS_CREDENTIALS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
