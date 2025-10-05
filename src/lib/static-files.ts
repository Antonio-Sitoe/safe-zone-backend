import staticPlugin from '@elysiajs/static';
import { Elysia } from 'elysia';

export const staticFilesPlugin = new Elysia().use(
	staticPlugin({
		assets: 'public',
		prefix: '/static',
	}),
);
