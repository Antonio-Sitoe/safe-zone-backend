import { openapi } from '@elysiajs/openapi';
import { Elysia } from 'elysia';
import { OpenAPI } from './auth';

export const openapiConfig = new Elysia().use(
	openapi({
		documentation: {
			components: await OpenAPI.components,
			paths: await OpenAPI.getPaths(),
			info: {
				title: 'Safe Zone API',
				version: '1.0.0',
			},
		},
	}),
);
