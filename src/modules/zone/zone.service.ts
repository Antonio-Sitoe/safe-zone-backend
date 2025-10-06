import {
	findZonesNearby,
	findZonesNearbyWithFilters,
	updateZoneCoordinates,
	findZonesInBoundingBox,
	getZoneStatsNearby,
	zoneRepository as defaultZoneRepository,
} from './zone.repository';
import type { Zone } from '@/db/schemas/zone';
import type { ZoneRepository } from './zone.repository';
import type {
	IZoneBodyRequest,
	IZoneWithUserIdBodyRequest,
} from './zone.schema';
import { logger } from '@/utils/logger';
import { AppError } from '@/utils/error';
import { HTTP_STATUS } from '@/utils/constants';
import { type Coordinates, createPointFromCoords } from './zone.geography';
import {
	type ZoneFeatureDetailsService,
	zoneFeatureDetailsService,
} from '../zone-feature-details/zone.feature.details.service';

export class ZoneService {
	constructor(
		private readonly zoneRepository: ZoneRepository = defaultZoneRepository,
		private readonly zoneDetailsService: ZoneFeatureDetailsService = zoneFeatureDetailsService,
	) {}

	async createZone(data: IZoneWithUserIdBodyRequest): Promise<Zone> {
		const zone = await this.zoneRepository.create(data);
		if (zone) {
			await this.zoneDetailsService.create(
				zone.id,
				data.type,
				data.featureDetails,
			);
		}
		return zone;
	}

	/**
	 * Busca zona por ID
	 */
	async getZoneById(id: string): Promise<Zone> {
		try {
			logger.info('Getting zone by ID', { id });

			const zone = await this.zoneRepository.getById(id);
			if (!zone) {
				throw new AppError('Zona não encontrada', HTTP_STATUS.NOT_FOUND);
			}

			return zone;
		} catch (error) {
			logger.error('Error getting zone by ID', {
				error: (error as Error).message,
				id,
			});
			throw error;
		}
	}

	/**
	 * Busca zonas próximas a uma coordenada
	 */
	async findZonesNearby(
		center: Coordinates,
		radius: number = 1000,
		limit: number = 10,
	): Promise<Zone[]> {
		try {
			logger.info('Finding zones nearby', { center, radius, limit });

			const zones = await findZonesNearby(center, radius, limit);
			return zones;
		} catch (error) {
			logger.error('Error finding zones nearby', {
				error: (error as Error).message,
				center,
				radius,
				limit,
			});
			throw error;
		}
	}

	/**
	 * Busca zonas próximas com filtros adicionais
	 */
	async findZonesNearbyWithFilters(
		center: Coordinates,
		radius: number = 1000,
		filters: {
			userId?: string;
			startDate?: string;
			endDate?: string;
			location?: string;
		} = {},
		limit: number = 10,
	): Promise<Zone[]> {
		try {
			logger.info('Finding zones nearby with filters', {
				center,
				radius,
				filters,
				limit,
			});

			const zones = await findZonesNearbyWithFilters(
				center,
				radius,
				filters,
				limit,
			);
			return zones;
		} catch (error) {
			logger.error('Error finding zones nearby with filters', {
				error: (error as Error).message,
				center,
				radius,
				filters,
				limit,
			});
			throw error;
		}
	}

	/**
	 * Atualiza uma zona
	 */
	async updateZone(
		id: string,
		updates: Partial<IZoneBodyRequest>,
	): Promise<Zone> {
		try {
			logger.info('Updating zone', { id, updates });

			// Verificar se a zona existe
			const existing = await this.zoneRepository.getById(id);
			if (!existing) {
				throw new AppError('Zona não encontrada', HTTP_STATUS.NOT_FOUND);
			}

			// Validações de negócio se houver mudanças de coordenadas
			if (updates.coordinates) {
				// Verificar proximidade (exceto com a própria zona)
				const nearbyZone = await this.findNearbyZone(
					updates.coordinates,
					100,
					id,
				);
				if (nearbyZone) {
					throw new AppError(
						'Já existe uma zona muito próxima desta posição',
						HTTP_STATUS.CONFLICT,
					);
				}
			}

			// Preparar dados para atualização
			const updateData = {
				...existing,
				...updates,
				// Garantir que coordinates seja string se fornecida como objeto
				coordinates: updates.coordinates
					? typeof updates.coordinates === 'object'
						? createPointFromCoords(updates.coordinates)
						: updates.coordinates
					: existing.coordinates,
			};

			const updatedZone = await this.zoneRepository.update(id, updateData);
			if (!updatedZone) {
				throw new AppError(
					'Erro ao atualizar zona',
					HTTP_STATUS.INTERNAL_SERVER_ERROR,
				);
			}

			logger.info('Zone updated successfully', { id });
			return updatedZone;
		} catch (error) {
			logger.error('Error updating zone', {
				error: (error as Error).message,
				id,
				updates,
			});
			throw error;
		}
	}

	/**
	 * Remove uma zona
	 */
	async deleteZone(id: string): Promise<void> {
		try {
			logger.info('Deleting zone', { id });

			// Verificar se a zona existe
			const existing = await this.zoneRepository.getById(id);
			if (!existing) {
				throw new AppError('Zona não encontrada', HTTP_STATUS.NOT_FOUND);
			}

			await this.zoneRepository.delete(id);

			logger.info('Zone deleted successfully', { id });
		} catch (error) {
			logger.error('Error deleting zone', {
				error: (error as Error).message,
				id,
			});
			throw error;
		}
	}

	/**
	 * Verifica se uma zona próxima já existe
	 */
	private async findNearbyZone(
		coordinates: Coordinates,
		radiusMeters: number,
		excludeId?: string,
	): Promise<Zone | null> {
		const results = await findZonesNearby(coordinates, radiusMeters, 10);
		return results.find((zone) => zone.id !== excludeId) || null;
	}

	/**
	 * Obtém estatísticas das zonas
	 */
	async getZoneStats(): Promise<{
		total: number;
		byUser: Record<string, number>;
		recentZones: number;
	}> {
		try {
			logger.info('Getting zone statistics');

			const allZones = await this.zoneRepository.getAll();

			const stats = {
				total: allZones.length,
				byUser: {} as Record<string, number>,
				recentZones: 0,
			};

			const oneWeekAgo = new Date();
			oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

			for (const zone of allZones) {
				// Contar por usuário
				stats.byUser[zone.userId] = (stats.byUser[zone.userId] || 0) + 1;

				// Contar zonas recentes
				if (zone.createdAt && new Date(zone.createdAt) > oneWeekAgo) {
					stats.recentZones++;
				}
			}

			return stats;
		} catch (error) {
			logger.error('Error getting zone statistics', {
				error: (error as Error).message,
			});
			throw error;
		}
	}

	/**
	 * Busca zonas em um bounding box
	 */
	async findZonesInBoundingBox(
		minLat: number,
		minLng: number,
		maxLat: number,
		maxLng: number,
		limit: number = 50,
	): Promise<Zone[]> {
		try {
			logger.info('Finding zones in bounding box', {
				minLat,
				minLng,
				maxLat,
				maxLng,
				limit,
			});

			const zones = await findZonesInBoundingBox(
				minLat,
				minLng,
				maxLat,
				maxLng,
				limit,
			);
			return zones;
		} catch (error) {
			logger.error('Error finding zones in bounding box', {
				error: (error as Error).message,
				minLat,
				minLng,
				maxLat,
				maxLng,
				limit,
			});
			throw error;
		}
	}

	/**
	 * Obtém estatísticas de zonas próximas
	 */
	async getZoneStatsNearby(
		center: Coordinates,
		radius: number,
	): Promise<{
		totalZones: number;
		avgDistance: number;
		minDistance: number;
		maxDistance: number;
	}> {
		try {
			logger.info('Getting zone statistics nearby', { center, radius });

			const stats = await getZoneStatsNearby(center, radius);
			return (
				stats[0] || {
					totalZones: 0,
					avgDistance: 0,
					minDistance: 0,
					maxDistance: 0,
				}
			);
		} catch (error) {
			logger.error('Error getting zone statistics nearby', {
				error: (error as Error).message,
				center,
				radius,
			});
			throw error;
		}
	}

	/**
	 * Atualiza coordenadas de uma zona
	 */
	async updateZoneCoordinates(
		zoneId: string,
		coordinates: Coordinates,
	): Promise<Zone[]> {
		try {
			logger.info('Updating zone coordinates', { zoneId, coordinates });

			const updatedZones = await updateZoneCoordinates(zoneId, coordinates);
			return updatedZones;
		} catch (error) {
			logger.error('Error updating zone coordinates', {
				error: (error as Error).message,
				zoneId,
				coordinates,
			});
			throw error;
		}
	}
}

export const zoneService = new ZoneService();
