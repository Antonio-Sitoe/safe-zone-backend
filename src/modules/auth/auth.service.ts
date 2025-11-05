import { auth } from '@/lib/auth'
import { logger } from '@/utils/logger'
import { db } from '@/db/db'
import { users } from '@/db/schemas/users'
import { eq } from 'drizzle-orm'
import type {
  AuthResponse,
  AuthResult,
  LoginRequest,
  RegisterRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  User,
} from './auth.types'

export class AuthService {
  async signInEmail(request: LoginRequest): Promise<AuthResult<AuthResponse>> {
    try {
      this.validateLoginRequest(request)

      const result = await auth.api.signInEmail({
        body: { email: request.email, password: request.password },
      })

      if (!result) {
        return { error: { message: 'Erro na autenticação' } }
      }

      logger.auth('SignIn success', result.user?.id)
      return {
        data: {
          user: {
            ...result.user,
            image: result.user.image || undefined,
            createdAt: result.user.createdAt.toISOString(),
            updatedAt: result.user.updatedAt.toISOString(),
          },
          session: {
            id: 'session-id',
            token: result.token,
            expiresAt: new Date().toISOString(),
          },
        },
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('SignIn error', {
        email: request.email,
        error: errorMessage,
      })
      return { error: { message: errorMessage || 'Erro interno no servidor' } }
    }
  }

  async signUpEmail(
    request: RegisterRequest
  ): Promise<AuthResult<AuthResponse>> {
    try {
      this.validateRegisterRequest(request)

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, request.email))
        .limit(1)

      if (existingUser.length > 0) {
        return {
          error: {
            message: 'Email já está cadastrado',
            code: 'EMAIL_ALREADY_EXISTS',
          },
        }
      }

      const result = await auth.api.signUpEmail({
        body: {
          name: request.name,
          email: request.email,
          password: request.password,
        },
      })

      if (!result) {
        return { error: { message: 'Erro no registro' } }
      }

      logger.auth('SignUp success', result.user?.id)
      return {
        data: {
          user: {
            ...result.user,
            image: result.user.image || undefined,
            createdAt: result.user.createdAt.toISOString(),
            updatedAt: result.user.updatedAt.toISOString(),
          },
          session: {
            id: 'session-id',
            token: result.token || 'token',
            expiresAt: new Date().toISOString(),
          },
        },
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('SignUp error', {
        email: request.email,
        error: errorMessage,
      })
      return { error: { message: errorMessage || 'Erro interno no servidor' } }
    }
  }

  async signOut(sessionToken: string): Promise<AuthResult<null>> {
    try {
      if (!sessionToken) {
        return { error: { message: 'Token de sessão não fornecido' } }
      }

      await auth.api.signOut({
        headers: { Authorization: `Bearer ${sessionToken}` },
      })

      logger.auth('SignOut success')
      return { data: null }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('SignOut error', { error: errorMessage })
      return { error: { message: errorMessage || 'Erro interno no servidor' } }
    }
  }

  async updateUser(
    sessionToken: string,
    request: UpdateUserRequest
  ): Promise<AuthResult<User>> {
    try {
      if (!sessionToken) {
        return { error: { message: 'Token de sessão não fornecido' } }
      }

      if (!request.name && !request.image) {
        return { error: { message: 'Pelo menos um campo deve ser atualizado' } }
      }

      await auth.api.updateUser({
        body: request,
        headers: { Authorization: `Bearer ${sessionToken}` },
      })

      // Get updated session to return updated user
      const session = await auth.api.getSession({
        headers: { Authorization: `Bearer ${sessionToken}` },
      })

      if (!session?.user) {
        return { error: { message: 'Erro ao buscar usuário atualizado' } }
      }

      logger.auth('UpdateUser success', session.user.id)
      return {
        data: {
          ...session.user,
          image: session.user.image || undefined,
          createdAt: session.user.createdAt.toISOString(),
          updatedAt: session.user.updatedAt.toISOString(),
        },
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('UpdateUser error', { error: errorMessage })
      return { error: { message: errorMessage || 'Erro interno no servidor' } }
    }
  }

  async changePassword(
    sessionToken: string,
    request: ChangePasswordRequest
  ): Promise<AuthResult<null>> {
    try {
      if (!sessionToken) {
        return { error: { message: 'Token de sessão não fornecido' } }
      }

      this.validateChangePasswordRequest(request)

      await auth.api.changePassword({
        body: {
          currentPassword: request.currentPassword,
          newPassword: request.newPassword,
          revokeOtherSessions: request.revokeOtherSessions ?? false,
        },
        headers: { Authorization: `Bearer ${sessionToken}` },
      })

      logger.auth('ChangePassword success')
      return { data: null }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('ChangePassword error', { error: errorMessage })
      return { error: { message: errorMessage || 'Erro interno no servidor' } }
    }
  }

  private validateChangePasswordRequest(request: ChangePasswordRequest): void {
    if (!request.currentPassword || !request.newPassword) {
      throw new Error('Senha atual e nova senha são obrigatórias')
    }
    if (request.newPassword.length < 8) {
      throw new Error('Nova senha deve ter pelo menos 8 caracteres')
    }
    if (request.newPassword.length > 128) {
      throw new Error('Nova senha muito longa')
    }
  }

  private validateLoginRequest(request: LoginRequest): void {
    if (!request.email || !request.password) {
      throw new Error('Email e senha são obrigatórios')
    }
    if (!this.isValidEmail(request.email)) {
      throw new Error('Email inválido')
    }
    if (request.password.length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres')
    }
  }

  private validateRegisterRequest(request: RegisterRequest): void {
    if (!request.email || !request.password || !request.name) {
      throw new Error('Email, senha e nome são obrigatórios')
    }
    if (!this.isValidEmail(request.email)) {
      throw new Error('Email inválido')
    }
    if (request.password.length < 8) {
      throw new Error('Senha deve ter pelo menos 8 caracteres')
    }
    if (request.name.length < 2) {
      throw new Error('Nome deve ter pelo menos 2 caracteres')
    }
  }

  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  private isValidEmail(email: string): boolean {
    return AuthService.EMAIL_REGEX.test(email)
  }
}

export const authService = new AuthService()
