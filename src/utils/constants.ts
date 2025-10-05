/**
 * Constantes HTTP
 */
export const HTTP_STATUS = {
	OK: 200,
	CREATED: 201,
	NO_CONTENT: 204,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Categorias de localização
 */
export const LOCATION_CATEGORIES = {
	SAFE: 'safe',
	UNSAFE: 'unsafe',
	NEUTRAL: 'neutral',
	EMERGENCY: 'emergency',
} as const;

/**
 * Roles de usuário
 */
export const USER_ROLES = {
	ADMIN: 'admin',
	USER: 'user',
	MODERATOR: 'moderator',
} as const;

/**
 * Regras de validação
 */
export const VALIDATION_RULES = {
	NAME_MIN_LENGTH: 2,
	NAME_MAX_LENGTH: 100,
	DESCRIPTION_MAX_LENGTH: 500,
	ADDRESS_MIN_LENGTH: 5,
	ADDRESS_MAX_LENGTH: 200,
	RATING_MIN: 1,
	RATING_MAX: 5,
	SEARCH_RADIUS_MIN: 0.1,
	SEARCH_RADIUS_MAX: 100,
	PAGINATION_LIMIT_MIN: 1,
	PAGINATION_LIMIT_MAX: 100,
	EMAIL_MAX_LENGTH: 255,
	PASSWORD_MIN_LENGTH: 8,
	PASSWORD_MAX_LENGTH: 128,
} as const;
