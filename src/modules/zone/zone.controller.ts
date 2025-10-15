import { Context } from 'elysia';
import type { AuthenticatedContext } from '@/@types/auth';
import { HTTP_STATUS } from '@/utils/constants';
import { logger } from '@/utils/logger';
import {
	errorResponse,
	notFoundResponse,
	successResponse,
} from '../../utils/response';
import type { IUpdateZoneBodyRequest, IZoneBodyRequest } from './zone.schema';
import { type ZoneService, zoneService } from './zone.service';
import { ZoneType } from './zone.types';

export class ZoneController {
	constructor(private readonly service: ZoneService = zoneService) {}
	async createZone(ctx: AuthenticatedContext) {
		try {
			const body = ctx.body as IZoneBodyRequest;
			const userId = ctx?.user?.id;
			const zoneData = { ...body, userId };
			const zone = await this.service.createZone(zoneData);
			ctx.set.status = 201;
			return successResponse(zone, 'Zona criada com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';

			if (error && typeof error === 'object' && 'statusCode' in error) {
				ctx.set.status = (error as { statusCode: number }).statusCode || 500;
				return errorResponse(errorMessage, errorMessage);
			}
			ctx.set.status = 500;
			return errorResponse('Erro interno do servidor', errorMessage);
		}
	}

	async getAll() {
		try {
			const result = await this.service.getAll();

			return successResponse(result, 'Zonas encontradas com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error getting all zones', {
				error: errorMessage,
			});

			if (error && typeof error === 'object' && 'statusCode' in error) {
				return errorResponse(errorMessage);
			}

			return errorResponse('Erro interno do servidor', errorMessage);
		}
	}

	async deleteZone(ctx: any) {
		try {
			const { id } = ctx.params;

			logger.info('Deleting location', { id });

			await this.service.deleteZone(id);

			return successResponse(null, 'Localização removida com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error deleting location', {
				error: errorMessage,
				id: ctx.params?.id,
			});

			if (
				error &&
				typeof error === 'object' &&
				'statusCode' in error &&
				(error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
			) {
				return notFoundResponse('Localização não encontrada');
			}

			if (error && typeof error === 'object' && 'statusCode' in error) {
				return errorResponse(errorMessage);
			}

			return errorResponse('Erro interno do servidor');
		}
	}

	async updateZone(ctx: Context) {
		try {
			const { id } = ctx.params;
			const body = ctx.body as IUpdateZoneBodyRequest;

			logger.info('Updating location', { id, updates: body });

			const location = await this.service.updateZone(id, body);

			return successResponse(location, 'Localização atualizada com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error updating location', {
				error: errorMessage,
				id: ctx.params?.id,
				body: ctx.body,
			});

			if (
				error &&
				typeof error === 'object' &&
				'statusCode' in error &&
				(error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
			) {
				return notFoundResponse('Localização não encontrada');
			}

			if (error && typeof error === 'object' && 'statusCode' in error) {
				return errorResponse(errorMessage);
			}

			return errorResponse('Erro interno do servidor');
		}
	}

	async getZoneById(ctx: Context) {
		try {
			const { id } = ctx.params as { id: string };

			logger.info('Getting location by ID', { id });

			const location = await this.service.getZoneById(id);

			return successResponse(location, 'Localização encontrada com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error getting location by ID', {
				error: errorMessage,
				id: ctx.params?.id,
			});

			if (
				error &&
				typeof error === 'object' &&
				'statusCode' in error &&
				(error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
			) {
				return notFoundResponse('Localização não encontrada');
			}

			if (error && typeof error === 'object' && 'statusCode' in error) {
				return errorResponse(errorMessage);
			}

			return errorResponse('Erro interno do servidor');
		}
	}

	async getZoneByType(ctx: Context) {
		try {
			const { type } = ctx.params as { type: ZoneType };
			logger.info('Getting zones by type', { type });

			const zones = await this.service.getZoneByType(type);

			return successResponse(zones, 'Zonas encontradas com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error getting zones by type', {
				error: errorMessage,
			});

			if (error && typeof error === 'object' && 'statusCode' in error) {
				ctx.set.status = (error as { statusCode: number }).statusCode || 500;
				return errorResponse(errorMessage, errorMessage);
			}

			ctx.set.status = 500;
			return errorResponse('Erro interno do servidor', errorMessage);
		}
	}

	async updateZoneCoordinates(ctx: Context) {
		try {
			const { id } = ctx.params as { id: string };
			const coordinates = ctx.body as { latitude: number; longitude: number };

			logger.info('Updating zone coordinates', { id, coordinates });

			const zones = await this.service.updateZoneCoordinates(id, coordinates);

			return successResponse(zones, 'Coordenadas atualizadas com sucesso');
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Erro desconhecido';
			logger.error('Error updating zone coordinates', {
				error: errorMessage,
				id: ctx.params?.id,
			});

			if (
				error &&
				typeof error === 'object' &&
				'statusCode' in error &&
				(error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
			) {
				ctx.set.status = 404;
				return notFoundResponse('Zona não encontrada');
			}

			if (error && typeof error === 'object' && 'statusCode' in error) {
				ctx.set.status = (error as { statusCode: number }).statusCode || 500;
				return errorResponse(errorMessage, errorMessage);
			}

			ctx.set.status = 500;
			return errorResponse('Erro interno do servidor', errorMessage);
		}
	}
}

export const zoneController = new ZoneController();
