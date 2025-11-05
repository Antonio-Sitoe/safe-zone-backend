import type { Context } from 'elysia'
import { HTTP_STATUS } from '@/utils/constants'
import { logger } from '@/utils/logger'
import { errorResponse, successResponse } from '@/utils/response'
import { authService } from './auth.service'
import type {
  RegisterRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
} from './auth.types'

export class AuthController {
  constructor(private readonly service = authService) {}

  async signUpEmail(ctx: Pick<Context, 'body' | 'set'>) {
    try {
      const body = ctx.body as RegisterRequest
      const result = await this.service.signUpEmail(body)
      logger.info('result', { result })

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

  async updateUser(ctx: Pick<Context, 'body' | 'headers' | 'set'>) {
    try {
      const sessionToken = ctx.headers.authorization?.replace('Bearer ', '')

      if (!sessionToken) {
        ctx.set.status = HTTP_STATUS.UNAUTHORIZED
        return errorResponse('Token de sessão não fornecido')
      }

      const body = ctx.body as UpdateUserRequest
      const result = await this.service.updateUser(sessionToken, body)

      if (result.error) {
        ctx.set.status = HTTP_STATUS.BAD_REQUEST
        return errorResponse('Erro ao atualizar usuário', result.error.message)
      }

      ctx.set.status = HTTP_STATUS.OK
      return successResponse(result.data, 'Usuário atualizado com sucesso')
    } catch {
      ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR
      return errorResponse('Erro interno no servidor')
    }
  }

  async changePassword(ctx: Pick<Context, 'body' | 'headers' | 'set'>) {
    try {
      const sessionToken = ctx.headers.authorization?.replace('Bearer ', '')

      if (!sessionToken) {
        ctx.set.status = HTTP_STATUS.UNAUTHORIZED
        return errorResponse('Token de sessão não fornecido')
      }

      const body = ctx.body as ChangePasswordRequest
      const result = await this.service.changePassword(sessionToken, body)

      if (result.error) {
        ctx.set.status = HTTP_STATUS.BAD_REQUEST
        return errorResponse('Erro ao alterar senha', result.error.message)
      }

      ctx.set.status = HTTP_STATUS.OK
      return successResponse(null, 'Senha alterada com sucesso')
    } catch {
      ctx.set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR
      return errorResponse('Erro interno no servidor')
    }
  }
}

export const authController = new AuthController()
