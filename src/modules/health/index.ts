import { Elysia } from 'elysia';
import { z } from 'zod';

export const health = new Elysia().get(
	'/',
	() => ({
		message: 'Safe Zone API',
		version: '1.0.0',
		documentation: '/swagger',
		health: '/health',
	}),
	{
		response: {
			200: z.object({
				message: z.string(),
				version: z.string(),
				documentation: z.string(),
				health: z.string(),
			}),
		},
		detail: {
			tags: ['System'],
			summary: 'Informações da API',
			description: 'Retorna informações básicas sobre a API',
		},
	},
);
