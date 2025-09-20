import { Elysia } from 'elysia'
import { HTTP_STATUS } from '../utils/constants'
import { AppError } from '../utils/error'
import { logger } from '../utils/logger'
import { errorResponse } from '../utils/response'

export const errorHandler = new Elysia().onError(({ error, set, code }) => {
  const errorMessage = error instanceof Error ? error.message : String(error)
  const errorStack = error instanceof Error ? error.stack : undefined

  logger.error('Error occurred', {
    error: errorMessage,
    stack: errorStack,
    code,
  })

  if (error instanceof AppError) {
    set.status = error.statusCode
    return errorResponse(error.message, error.statusCode.toString())
  }

  if (code === 'VALIDATION') {
    set.status = HTTP_STATUS.UNPROCESSABLE_ENTITY
    return errorResponse('Erro de validação', errorMessage)
  }

  if (code === 'PARSE') {
    set.status = HTTP_STATUS.BAD_REQUEST
    return errorResponse('Erro ao processar JSON', 'PARSE_ERROR')
  }

  if (code === 'NOT_FOUND') {
    set.status = HTTP_STATUS.NOT_FOUND
    return errorResponse('Rota não encontrada', 'NOT_FOUND')
  }

  set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR

  const isDevelopment = process.env.NODE_ENV === 'development'
  const message = isDevelopment ? errorMessage : 'Erro interno do servidor'
  const errorDetails = isDevelopment ? errorStack : undefined

  return errorResponse(message, errorDetails || 'INTERNAL_SERVER_ERROR')
})
