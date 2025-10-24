import { Elysia } from 'elysia'
import { authController } from './auth.controller'
import {
  RegisterRequestSchema,
  SignOutResponseSchema,
  SignUpResponseSchema,
} from './auth.schemas'

export const authRoutes = new Elysia({ prefix: '/auth' })

  .post('/sign-up/email', authController.signUpEmail.bind(authController), {
    body: RegisterRequestSchema,
    response: SignUpResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Registro de usuário',
      description: 'Cria uma nova conta de usuário',
    },
  })

  .post('/sign-out', authController.signOut.bind(authController), {
    response: SignOutResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Logout de usuário',
      description: 'Encerra a sessão do usuário',
    },
  })
