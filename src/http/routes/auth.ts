import { Elysia } from 'elysia'
import { Type } from '@sinclair/typebox'
import { HTTP_STATUS } from '../../utils/constants'
import { logger } from '../../utils/logger'
import { errorResponse, successResponse } from '../../utils/response'
import {
  LoginRequestSchema,
  RegisterRequestSchema,
  AuthResponseSchema,
  ApiResponseSchema,
} from '../../utils/schemas'

export const authRoutes = new Elysia({ prefix: '/auth' })
  // Rota de login
  .post(
    '/login',
    ({ body, set }) => {
      try {
        logger.auth('Login attempt', { email: body.email })

        // TODO: Implementar lógica de autenticação real
        // Por enquanto, retorna um mock
        const mockUser = {
          id: '1',
          email: body.email,
          name: 'Usuário Teste',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const mockToken = 'mock-jwt-token'

        logger.auth('Login successful', { userId: mockUser.id })

        set.status = HTTP_STATUS.OK
        return successResponse(
          {
            user: mockUser,
            token: mockToken,
          },
          'Login realizado com sucesso'
        )
      } catch (error: any) {
        logger.error('Login error', { error: error.message })
        set.status = HTTP_STATUS.BAD_REQUEST
        return errorResponse(
          'Erro no login',
          HTTP_STATUS.BAD_REQUEST,
          error.message
        )
      }
    },
    {
      body: LoginRequestSchema,
      response: {
        200: ApiResponseSchema(AuthResponseSchema),
        400: ApiResponseSchema(Type.Null()),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Login de usuário',
        description: 'Autentica um usuário e retorna um token de acesso',
      },
    }
  )

  // Rota de registro
  .post(
    '/register',
    ({ body, set }) => {
      try {
        logger.auth('Register attempt', { email: body.email })

        // TODO: Implementar lógica de registro real
        // Por enquanto, retorna um mock
        const mockUser = {
          id: '1',
          email: body.email,
          name: body.name,
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        const mockToken = 'mock-jwt-token'

        logger.auth('Register successful', { userId: mockUser.id })

        set.status = HTTP_STATUS.CREATED
        return successResponse(
          {
            user: mockUser,
            token: mockToken,
          },
          'Usuário criado com sucesso'
        )
      } catch (error: any) {
        logger.error('Register error', { error: error.message })
        set.status = HTTP_STATUS.BAD_REQUEST
        return errorResponse(
          'Erro no registro',
          HTTP_STATUS.BAD_REQUEST,
          error.message
        )
      }
    },
    {
      body: RegisterRequestSchema,
      response: {
        201: ApiResponseSchema(AuthResponseSchema),
        400: ApiResponseSchema(Type.Null()),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Registro de usuário',
        description: 'Cria uma nova conta de usuário',
      },
    }
  )

  // Rota de logout
  .post(
    '/logout',
    ({ set }) => {
      logger.auth('Logout')
      set.status = HTTP_STATUS.OK
      return successResponse(null, 'Logout realizado com sucesso')
    },
    {
      response: {
        200: ApiResponseSchema(Type.Null()),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Logout de usuário',
        description: 'Encerra a sessão do usuário',
      },
    }
  )

  // Rota para verificar status da autenticação
  .get(
    '/me',
    ({ set }) => {
      // TODO: Implementar verificação real do token
      set.status = HTTP_STATUS.OK
      return successResponse(
        {
          authenticated: true,
          message: 'Token válido',
        },
        'Status de autenticação verificado'
      )
    },
    {
      response: {
        200: ApiResponseSchema(
          Type.Object({
            authenticated: Type.Boolean(),
            message: Type.String(),
          })
        ),
      },
      detail: {
        tags: ['Auth'],
        summary: 'Verificar autenticação',
        description: 'Verifica se o token de autenticação é válido',
      },
    }
  )
