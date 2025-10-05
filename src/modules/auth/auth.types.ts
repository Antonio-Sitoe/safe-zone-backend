export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterRequest {
	email: string;
	password: string;
	name: string;
}

export interface User {
	id: string;
	email: string;
	name: string;
	emailVerified: boolean;
	image?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Session {
	id: string;
	token: string;
	expiresAt: string;
}

export interface AuthResponse {
	user: User;
	session: Session;
}

export interface ApiResponse<T = unknown> {
	success: boolean;
	message: string;
	data?: T;
	error?: string;
}

export interface AuthResult<T = unknown> {
	data?: T;
	error?: {
		message: string;
		code?: string;
	};
}

export interface AuthContext {
	user?: User;
	session?: Session;
	isAuthenticated: boolean;
}

export interface ValidationError {
	field: string;
	message: string;
	value?: unknown;
}

export interface AuthConfig {
	jwtSecret: string;
	sessionExpiry: number;
	otpExpiry: number;
	passwordMinLength: number;
	passwordMaxLength: number;
}

export interface AuthEvent {
	type: "sign_in" | "sign_up" | "sign_out" | "otp_sent" | "otp_verified";
	userId?: string;
	email?: string;
	timestamp: Date;
	metadata?: Record<string, unknown>;
}
