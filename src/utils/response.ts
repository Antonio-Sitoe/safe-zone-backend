import { z } from 'zod'
import type { ApiResponse } from '@/@types'

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  })

export function successResponse<T>(
  data: T,
  message: string = 'Operação realizada com sucesso'
): ApiResponse<T> {
  return {
    success: true,
    message,
    data,
  }
}

export function errorResponse(message: string, error?: string): ApiResponse {
  return {
    success: false,
    message,
    error,
  }
}

export function validationErrorResponse(
  message: string = 'Erro de validação',
  errors: unknown[] = []
): ApiResponse {
  return {
    success: false,
    message,
    error: 'VALIDATION_ERROR',
    data: { errors },
  }
}

export function notFoundResponse(
  message: string = 'Recurso não encontrado'
): ApiResponse {
  return {
    success: false,
    message,
    error: 'NOT_FOUND',
  }
}

export function unauthorizedResponse(
  message: string = 'Não autorizado'
): ApiResponse {
  return {
    success: false,
    message,
    error: 'UNAUTHORIZED',
  }
}

export function forbiddenResponse(
  message: string = 'Acesso negado'
): ApiResponse {
  return {
    success: false,
    message,
    error: 'FORBIDDEN',
  }
}
