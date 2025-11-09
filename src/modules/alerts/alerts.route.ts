import { Elysia } from 'elysia';
import { alertsController } from './alerts.controller';
import {
	SendAlertRequestSchema,
	AlertResponseSchema,
} from './alerts.schema';

export const alertsRoutes = new Elysia({ prefix: '/alerts' })
	.post('/', (ctx) => alertsController.sendAlert(ctx as any), {
		body: SendAlertRequestSchema,
		response: AlertResponseSchema,
		detail: {
			tags: ['Alerts'],
			summary: 'Enviar alerta',
			description:
				'Envia um alerta para uma lista de contatos do usuário autenticado',
		},
		auth: true,
	});
