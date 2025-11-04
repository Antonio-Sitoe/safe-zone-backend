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
        const user = existingUser[0]

        if (!user.emailVerified) {
          logger.info('User exists but email not verified', {
            email: request.email,
            userId: user.id,
          })
          return {
            data: {
              user: {
                id: user.id,
                email: user.email,
                name: user.name,
                emailVerified: user.emailVerified,
                image: user.image || undefined,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString(),
              },
              session: {
                id: 'session-id',
                token: 'token',
                expiresAt: new Date().toISOString(),
              },
            },
            error: {
              message: 'Conta já existe mas email não foi verificado',
              code: 'EMAIL_NOT_VERIFIED',
            },
          }
        }

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
