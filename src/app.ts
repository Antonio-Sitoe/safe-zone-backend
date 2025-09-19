import { cors } from '@elysiajs/cors'

import { env } from './lib/env'
import { Elysia } from 'elysia'
import { health } from '@/http/routes/health'
import { logger } from './utils/logger'
import { errorHandler } from './http/middleware/errorHandler'
import { staticPlugin } from '@elysiajs/static'
import { openapiConfig as openapi } from './lib/openapi'
import { betterAuthPlugin } from './http/middleware/better-auth'

const app = new Elysia()
  .use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: env.CORS_CREDENTIALS,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  )
  .use(
    staticPlugin({
      assets: 'public',
      prefix: '/static',
    })
  )
  .use(betterAuthPlugin)
  .use(openapi)
  .use(health)
  .use(errorHandler)
  .listen({
    port: env.PORT,
    hostname: env.HOST,
  })

logger.info(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
logger.info(
  `📚 Documentação disponível em: http://${app.server?.hostname}:${app.server?.port}/openapi`
)
