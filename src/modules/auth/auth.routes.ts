import { Elysia } from 'elysia'
import { authController } from './auth.controller'
import {
  LoginRequestSchema,
  SignInResponseSchema,
  RegisterRequestSchema,
  SignOutResponseSchema,
  SignUpResponseSchema,
  UpdateUserRequestSchema,
  UpdateUserResponseSchema,
  ChangePasswordRequestSchema,
  ChangePasswordResponseSchema,
  DeactivateAccountResponseSchema,
} from './auth.schemas'

export const authRoutes = new Elysia({ prefix: '/auth' })

  .post('/sign-in/email', authController.signInEmail.bind(authController), {
    body: LoginRequestSchema,
    response: SignInResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Login de usuário',
      description: 'Realiza o login do usuário',
    },
  })

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

  .put('/user', authController.updateUser.bind(authController), {
    body: UpdateUserRequestSchema,
    response: UpdateUserResponseSchema,
    detail: {
      tags: ['Auth'],
      summary: 'Atualizar usuário',
      description: 'Atualiza informações do usuário (nome, imagem)',
    },
    auth: true,
  })

  .post(
    '/change-password',
    authController.changePassword.bind(authController),
    {
      body: ChangePasswordRequestSchema,
      response: ChangePasswordResponseSchema,
      detail: {
        tags: ['Auth'],
        summary: 'Alterar senha',
        description: 'Altera a senha do usuário',
      },
      auth: true,
    }
  )

  .post(
    '/deactivate-account',
    authController.deactivateAccount.bind(authController),
    {
      response: DeactivateAccountResponseSchema,
      detail: {
        tags: ['Auth'],
        summary: 'Desativar conta',
        description: 'Desativa a conta do usuário e revoga todas as sessões',
      },
      auth: true,
    }
  )
