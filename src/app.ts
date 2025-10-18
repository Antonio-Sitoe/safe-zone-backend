import { Elysia } from 'elysia'
import { authRoutes } from '@/modules/auth'
import { health } from '@/modules/health'
import { zoneRoutes } from '@/modules/zone'
import { corsPlugin as cors } from './lib/cors'
import { env } from './lib/env'
import { openapiConfig as openapi } from './lib/openapi'
import { staticFilesPlugin as staticFiles } from './lib/static-files'
import { betterAuthPlugin } from './middleware/better-auth'
import { errorHandler } from './middleware/errorHandler'
import { communityRoutes } from './modules/community/community.routes'
import { logger } from './utils/logger'

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
      console.log(JSON.stringify(env, null, 2))
    }
  )
