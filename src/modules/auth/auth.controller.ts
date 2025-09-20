import { HTTP_STATUS } from '@/utils/constants'
import { errorResponse, successResponse } from '@/utils/response'
import { authService } from './auth.service'

import type { Context } from 'elysia'
import type { LoginRequest, RegisterRequest } from './auth.types'

export class AuthController {
  constructor(private readonly service = authService) {}

  async signInEmail(ctx: Pick<Context, 'body' | 'set'>) {
    try {
      const body = ctx.body as LoginRequest
      const result = await this.service.signInEmail(body)

      if (result.error) {
        ctx.set.status = HTTP_STATUS.BAD_REQUEST
        return errorResponse('Erro no login', result.error.message)
      }

      ctx.set.status = HTTP_STATUS.OK
      return successResponse(result.data, 'Login realizado com sucesso')
    } catch {
      ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR
      return errorResponse('Erro interno no servidor')
    }
  }

  async signUpEmail(ctx: Pick<Context, 'body' | 'set'>) {
    try {
      const body = ctx.body as RegisterRequest
      const result = await this.service.signUpEmail(body)

      if (result.error) {
        ctx.set.status = HTTP_STATUS.BAD_REQUEST
        return errorResponse('Erro no registro', result.error.message)
      }

      ctx.set.status = HTTP_STATUS.CREATED
      return successResponse(result.data, 'Usuário criado com sucesso')
    } catch {
      ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR
      return errorResponse('Erro interno no servidor')
    }
  }

  async signOut(ctx: Pick<Context, 'headers' | 'set'>) {
    try {
      const sessionToken = ctx.headers.authorization?.replace('Bearer ', '')

      if (!sessionToken) {
        ctx.set.status = HTTP_STATUS.BAD_REQUEST
        return errorResponse('Token de sessão não fornecido')
      }

      const result = await this.service.signOut(sessionToken)

      if (result.error) {
        ctx.set.status = HTTP_STATUS.BAD_REQUEST
        return errorResponse('Erro no logout', result.error.message)
      }

      ctx.set.status = HTTP_STATUS.OK
      return successResponse(null, 'Logout realizado com sucesso')
    } catch {
      ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR
      return errorResponse('Erro interno no servidor')
    }
  }
}

export const authController = new AuthController()
