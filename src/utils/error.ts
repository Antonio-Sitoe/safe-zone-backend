import { HTTP_STATUS } from './constants';

/**
 * Classe personalizada para erros da aplicação
 */
export class AppError extends Error {
	public readonly statusCode: number;
	public readonly isOperational: boolean;

	constructor(
		message: string,
		statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
		isOperational: boolean = true,
	) {
		super(message);
		this.statusCode = statusCode;
		this.isOperational = isOperational;

		// Mantém o stack trace correto
		Error.captureStackTrace(this, this.constructor);
	}
}

/**
 * Cria um erro de validação
 */
export function createValidationError(message: string): AppError {
	return new AppError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
}

/**
 * Cria um erro de não encontrado
 */
export function createNotFoundError(
	message: string = 'Recurso não encontrado',
): AppError {
	return new AppError(message, HTTP_STATUS.NOT_FOUND);
}

/**
 * Cria um erro de não autorizado
 */
export function createUnauthorizedError(
	message: string = 'Não autorizado',
): AppError {
	return new AppError(message, HTTP_STATUS.UNAUTHORIZED);
}

/**
 * Cria um erro de acesso negado
 */
export function createForbiddenError(
	message: string = 'Acesso negado',
): AppError {
	return new AppError(message, HTTP_STATUS.FORBIDDEN);
}

/**
 * Cria um erro de conflito
 */
export function createConflictError(
	message: string = 'Conflito de dados',
): AppError {
	return new AppError(message, HTTP_STATUS.CONFLICT);
}

/**
 * Cria um erro de requisição inválida
 */
export function createBadRequestError(
	message: string = 'Requisição inválida',
): AppError {
	return new AppError(message, HTTP_STATUS.BAD_REQUEST);
}

/**
 * Verifica se um erro é operacional
 */
export function isOperationalError(error: Error): boolean {
	if (error instanceof AppError) {
		return error.isOperational;
	}
	return false;
}

/**
 * Trata erros não capturados
 */
export function handleUncaughtException(error: Error): void {
	console.error('Uncaught Exception:', error);
	process.exit(1);
}

/**
 * Trata rejeições não capturadas de promises
 */
export function handleUnhandledRejection(
	reason: any,
	promise: Promise<any>,
): void {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
}
