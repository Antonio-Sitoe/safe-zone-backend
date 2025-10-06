import type { Context } from 'elysia';

export interface AuthenticatedContext extends Context {
	user: {
		id: string;
		email: string;
		name?: string;
		emailVerified?: boolean;
		createdAt: string;
		updatedAt: string;
	};
	session: {
		id: string;
		token: string;
		expiresAt: string;
	};
}
