import { env } from './lib/env'
import { Elysia } from 'elysia'
import { health } from '@/modules/health'
import { authRoutes } from '@/modules/auth'
import { logger } from './utils/logger'
import { errorHandler } from './middleware/errorHandler'
import { openapiConfig as openapi } from './lib/openapi'
import { betterAuthPlugin } from './middleware/better-auth'
import { corsPlugin as cors } from './lib/cors'
import { staticFilesPlugin as staticFiles } from './lib/static-files'

const app = new Elysia()
  .use(cors)
  .use(staticFiles)
  .use(betterAuthPlugin)
  .use(openapi)
  .use(health)
  .use(authRoutes)
  .use(errorHandler)
  .listen(
    {
      port: env.PORT,
      hostname: env.HOST,
    },
    (app) => {
      logger.info(`🦊 Elysia is running at ${app.hostname}:${app.port}`)
      logger.info(
        `📚 Documentação disponível em: http://${app?.hostname}:${app?.port}/openapi`
      )
    }
  )
