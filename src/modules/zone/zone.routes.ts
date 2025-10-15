import { Elysia } from 'elysia';
import { zoneController } from './zone.controller';
import {
	getAllResponse,
	updateZoneResponseSchema,
	ZoneBodySchema,
	UpdateZoneBodySchema,
	zoneParamsSchema,
	zoneTypeParamsSchema,
	ZoneResponseSchema,
	updateCoordinatesSchema,
} from './zone.schema';

export const zoneRoutes = new Elysia({ prefix: '/zone' })
	.post('/', (ctx) => zoneController.createZone(ctx as any), {
		body: ZoneBodySchema,
		response: ZoneResponseSchema,
		detail: {
			tags: ['Zone'],
			summary: 'Create zone',
			description: 'Create a new zone',
		},
		auth: true,
	})

	.get('/', () => zoneController.getAll(), {
		response: getAllResponse,
		detail: {
			tags: ['Zone'],
			summary: 'Get all zones',
			description: 'Get all zones',
		},
		auth: true,
	})

	.get('/type/:type', (ctx) => zoneController.getZoneByType(ctx as any), {
		params: zoneTypeParamsSchema,
		response: getAllResponse,
		detail: {
			tags: ['Zone'],
			summary: 'Get zones by type',
			description: 'Get zones by type (SAFE or DANGER)',
		},
		auth: true,
	})

	.get('/:id', (ctx) => zoneController.getZoneById(ctx as any), {
		params: zoneParamsSchema,
		response: ZoneResponseSchema,
		detail: {
			tags: ['Zone'],
			summary: 'Get zone by ID',
			description: 'Get a specific zone by ID',
		},
		auth: true,
	})

	.put('/:id', (ctx) => zoneController.updateZone(ctx as any), {
		params: zoneParamsSchema,
		body: UpdateZoneBodySchema,
		response: updateZoneResponseSchema,
		detail: {
			tags: ['Zone'],
			summary: 'Update zone',
			description: 'Update an existing zone',
		},
		auth: true,
	})

	.delete('/:id', (ctx) => zoneController.deleteZone(ctx as any), {
		params: zoneParamsSchema,
		response: ZoneResponseSchema,
		detail: {
			tags: ['Zone'],
			summary: 'Delete zone',
			description: 'Delete a zone from the system',
		},
		auth: true,
	})

	.patch(
		'/:id/coordinates',
		(ctx) => zoneController.updateZoneCoordinates(ctx as any),
		{
			params: zoneParamsSchema,
			body: updateCoordinatesSchema,
			response: getAllResponse,
			detail: {
				tags: ['Zone'],
				summary: 'Update zone coordinates',
				description: 'Update the coordinates of a zone',
			},
			auth: true,
		},
	);
