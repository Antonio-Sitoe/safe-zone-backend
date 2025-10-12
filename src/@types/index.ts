export interface ApiResponse<T = any> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}

export interface AppError extends Error {
	statusCode: number;
	isOperational: boolean;
}

export interface ValidationError {
	field: string;
	message: string;
	value?: any;
}
export interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}
export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}
