import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';

export const corsPlugin = new Elysia().use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);
