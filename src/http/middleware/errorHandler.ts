import { Elysia } from 'elysia'
import { HTTP_STATUS } from '../../utils/constants'
import { AppError, isOperationalError } from '../../utils/error'
import { logger } from '../../utils/logger'
import { errorResponse } from '../../utils/response'

/**
 * Middleware para tratamento global de erros
 */
export const errorHandler = new Elysia().onError(({ error, set, code }) => {
  logger.error('Error occurred', { error: error.message, stack: error.stack })

  // Se for um AppError, usa as propriedades definidas
  if (error instanceof AppError) {
    set.status = error.statusCode
    return errorResponse(error.message, error.statusCode)
  }

  // Se for um erro de validação do Elysia
  if (code === 'VALIDATION') {
    set.status = HTTP_STATUS.UNPROCESSABLE_ENTITY
    return errorResponse(
      'Erro de validação',
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      error.message
    )
  }

  // Se for um erro de parse JSON
  if (code === 'PARSE') {
    set.status = HTTP_STATUS.BAD_REQUEST
    return errorResponse('Erro ao processar JSON', HTTP_STATUS.BAD_REQUEST)
  }

  // Se for um erro de rota não encontrada
  if (code === 'NOT_FOUND') {
    set.status = HTTP_STATUS.NOT_FOUND
    return errorResponse('Rota não encontrada', HTTP_STATUS.NOT_FOUND)
  }

  // Para outros erros, retorna erro interno do servidor
  set.status = HTTP_STATUS.INTERNAL_SERVER_ERROR

  // Em produção, não expõe detalhes do erro
  const isDevelopment = process.env.NODE_ENV === 'development'
  const message = isDevelopment ? error.message : 'Erro interno do servidor'
  const errorDetails = isDevelopment ? error.stack : undefined

  return errorResponse(message, HTTP_STATUS.INTERNAL_SERVER_ERROR, errorDetails)
})
