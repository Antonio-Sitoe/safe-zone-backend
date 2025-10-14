import { env } from './lib/env'
import { Elysia } from 'elysia'
import { health } from '@/modules/health'
import { logger } from './utils/logger'
import { authRoutes } from '@/modules/auth'
import { zoneRoutes } from '@/modules/zone'
import { errorHandler } from './middleware/errorHandler'
import { communityRoutes } from './modules/community/community.routes'
import { betterAuthPlugin } from './middleware/better-auth'
import { corsPlugin as cors } from './lib/cors'
import { openapiConfig as openapi } from './lib/openapi'
import { staticFilesPlugin as staticFiles } from './lib/static-files'

export const app = new Elysia()
  .use(cors)
  .use(staticFiles)
  .use(openapi)
  .use(health)
  .use(authRoutes)
  .use(betterAuthPlugin)
  .use(zoneRoutes)
  .use(communityRoutes)
  .use(errorHandler)
  .listen(
    {
      port: env.PORT,
      hostname: env.HOST,
    },
    (app) => {
      logger.info(
        `🦊 Elysia is running at ${app.hostname}:${app.port} ${app.id}`
      )
      logger.info(
        `📚 Documentação disponível em: http://${app?.hostname}:${app?.port}/openapi`
      )
    }
  )
