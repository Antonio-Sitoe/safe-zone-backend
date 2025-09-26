import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'

export const corsPlugin = new Elysia().use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)
