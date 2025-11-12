import { HTTP_STATUS } from '@/utils/constants';
import { AppError } from '@/utils/error';
import { logger } from '@/utils/logger';
import {
	type ZoneFeatureDetailsService,
	zoneFeatureDetailsService,
} from '../zone-feature-details/zone.feature.details.service';
import {
	type Coordinates,
	createPointFromCoords,
	parsePoint,
} from './zone.geography';
import type { ZoneRepository } from './zone.repository';
import { zoneRepository as defaultZoneRepository } from './zone.repository';
import type {
	IUpdateZoneBodyRequest,
	IZoneWithUserIdBodyRequest,
} from './zone.schema';
import type { Zone } from './zone.types';
import { ICreateZoneWithFeatureDetailsResponse } from './zone.types';

export class ZoneService {
	constructor(
		private readonly zoneRepository: ZoneRepository = defaultZoneRepository,
		private readonly zoneDetailsService: ZoneFeatureDetailsService = zoneFeatureDetailsService,
	) {}

	async getAll(lat?: number, long?: number, type?: 'SAFE' | 'DANGER') {
		const zones = await this.zoneRepository.getAll(lat, long, type);

		return zones;
	}

	async getZoneByType(type: 'SAFE' | 'DANGER') {
		const zones = await this.zoneRepository.getByType(type);
		return zones;
	}

	async createZone(data: IZoneWithUserIdBodyRequest) {
		const zone = await this.zoneRepository.create(data);
		let featureDetails = null;
		if (zone) {
			featureDetails = await this.zoneDetailsService.create(
				zone.id,
				data.type,
				data.featureDetails,
			);
		}

		if (zone.type === 'DANGER') {
			const checkZone = await this.zoneRepository.getAll(
				zone.latitude,
				zone.longitude,
				zone.type,
			);

			if (checkZone.length >= 10) {
				const getCenter = await this.zoneRepository.getCenter(
					zone.latitude,
					zone.longitude,
					zone.type,
				);

				await this.zoneRepository.createCriticalZone(
					Number(getCenter?.latitude),
					Number(getCenter?.longitude),
				);

				return {
					message:
						'Zona criada com sucesso. Múltiplas zonas de perigo detectadas na mesma área. Uma zona crítica foi registrada.',
				};
			}
		}

		return {
			...zone,
			coordinates: {
				latitude: zone.latitude ?? 0,
				longitude: zone.longitude ?? 0,
			},
			featureDetails: featureDetails?.[0] ?? {
				zoneId: zone.id,
				zoneType: zone.type ?? 'SAFE',
				goodLighting: false,
				policePresence: false,
				publicTransport: false,
				insufficientLighting: false,
				lackOfPolicing: false,
				abandonedHouses: false,
			},
		};
	}

	async getZoneById(id: string) {
		try {
			logger.info('Getting zone by ID', { id });

			const zone = await this.zoneRepository.getById(id);
			if (!zone) {
				throw new AppError('Zona não encontrada', HTTP_STATUS.NOT_FOUND);
			}

			return {
				zone,
			};
		} catch (error) {
			logger.error('Error getting zone by ID', {
				error: (error as Error).message,
				id,
			});
			throw error;
		}
	}

	async findZonesNearby(lat: number, long: number, radius: number = 1000) {
		try {
			logger.info('Finding zones nearby', { lat, long, radius });

			const zones = await this.zoneRepository.getNearbyZones(lat, long, radius);

			return zones;
		} catch (error) {
			logger.error('Error finding zones nearby', {
				error: (error as Error).message,
				lat,
				long,
				radius,
			});
		}
	}
	async updateZone(
		id: string,
		updates: IUpdateZoneBodyRequest,
	): Promise<ICreateZoneWithFeatureDetailsResponse> {
		try {
			const existing = await this.zoneRepository.getById(id);
			if (!existing) {
				throw new AppError('Zona não encontrada', HTTP_STATUS.NOT_FOUND);
			}

			const payload = {
				...existing,
				slug: updates.slug ?? existing.slug,
				date: updates.date ?? existing.date,
				hour: updates.hour ?? existing.hour,
				description: updates.description ?? existing.description,
				type: updates.type ?? existing.type,
				latitude: updates.coordinates?.latitude ?? existing.latitude,
				longitude: updates.coordinates?.longitude ?? existing.longitude,
				geom: updates.coordinates
					? createPointFromCoords(updates.coordinates)
					: existing.geom,
			};

			const updatedZone = await this.zoneRepository.update(id, payload as any);
			if (!updatedZone) {
				throw new AppError(
					'Erro ao atualizar zona',
					HTTP_STATUS.INTERNAL_SERVER_ERROR,
				);
			}

			if (updates.featureDetails) {
				await this.zoneDetailsService.update(
					updatedZone.id,
					updatedZone.type ?? 'SAFE',
					updates.featureDetails,
				);
			}

			const zoneWithDetails = await this.zoneRepository.getById(id);

			return {
				...zoneWithDetails,
				coordinates: {
					latitude: zoneWithDetails.latitude,
					longitude: zoneWithDetails.longitude,
				},
				featureDetails: (zoneWithDetails as any).featureDetails ?? {
					zoneId: zoneWithDetails.id,
					zoneType: zoneWithDetails.type ?? 'SAFE',
					goodLighting: false,
					policePresence: false,
					publicTransport: false,
					insufficientLighting: false,
					lackOfPolicing: false,
					abandonedHouses: false,
				},
			};
		} catch (error) {
			logger.error('Error updating zone', {
				error: (error as Error).message,
				id,
				updates,
			});
			throw error;
		}
	}

	async deleteZone(id: string): Promise<void> {
		try {
			logger.info('Deleting zone', { id });

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

			const zones = await this.zoneRepository.findZonesInBoundingBox(
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

	async updateZoneCoordinates(
		zoneId: string,
		coordinates: Coordinates,
	): Promise<Zone[]> {
		try {
			logger.info('Updating zone coordinates', { zoneId, coordinates });

			const updatedZones = await this.zoneRepository.updateZoneCoordinates(
				zoneId,
				coordinates,
			);
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
