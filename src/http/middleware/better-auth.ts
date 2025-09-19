import { auth } from '@/lib/auth'
import { HTTP_STATUS } from '@/utils/constants'
import { Elysia } from 'elysia'

export const betterAuthPlugin = new Elysia({ name: 'better-auth' })
  .mount(auth.handler)
  .macro({
    auth: {
      async resolve({ status, request: { headers } }) {
        const session = await auth.api.getSession({ headers })
        if (!session) {
          return status(HTTP_STATUS.UNAUTHORIZED, { message: 'Unauthorized' })
        }
        return session
      },
    },
  })
