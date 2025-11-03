import { HTTP_STATUS } from './constants';

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

		Error.captureStackTrace(this, this.constructor);
	}
}

export function createValidationError(message: string): AppError {
	return new AppError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
}

export function createNotFoundError(
	message: string = 'Recurso não encontrado',
): AppError {
	return new AppError(message, HTTP_STATUS.NOT_FOUND);
}

export function createUnauthorizedError(
	message: string = 'Não autorizado',
): AppError {
	return new AppError(message, HTTP_STATUS.UNAUTHORIZED);
}

export function createForbiddenError(
	message: string = 'Acesso negado',
): AppError {
	return new AppError(message, HTTP_STATUS.FORBIDDEN);
}

export function createConflictError(
	message: string = 'Conflito de dados',
): AppError {
	return new AppError(message, HTTP_STATUS.CONFLICT);
}

export function createBadRequestError(
	message: string = 'Requisição inválida',
): AppError {
	return new AppError(message, HTTP_STATUS.BAD_REQUEST);
}

export function isOperationalError(error: Error): boolean {
	if (error instanceof AppError) {
		return error.isOperational;
	}
	return false;
}

export function handleUncaughtException(error: Error): void {
	console.error('Uncaught Exception:', error);
	process.exit(1);
}

export function handleUnhandledRejection(
	reason: any,
	promise: Promise<any>,
): void {
	console.error('Unhandled Rejection at:', promise, 'reason:', reason);
	process.exit(1);
}
