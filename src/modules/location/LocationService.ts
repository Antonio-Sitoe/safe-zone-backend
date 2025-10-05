import { db } from "../database/database";
import type {
	CreateLocation,
	Location,
	SearchLocation,
	UpdateLocation,
} from "../database/schemas/Location";
import { HTTP_STATUS } from "../utils/constants";
import { AppError } from "../utils/error";
import { logger } from "../utils/logger";

/**
 * Serviço para gerenciar localizações
 */
export class LocationService {
	/**
	 * Cria uma nova localização
	 */
	async createLocation(data: CreateLocation): Promise<Location> {
		try {
			logger.info("Creating new location", {
				name: data.name,
				category: data.category,
			});

			// Validações de negócio
			await this.validateLocationData(data);

			// Verificar se já existe uma localização muito próxima
			const nearbyLocation = await this.findNearbyLocation(
				data.latitude,
				data.longitude,
				0.1, // 100 metros
			);

			if (nearbyLocation) {
				throw new AppError(
					"Já existe uma localização muito próxima desta posição",
					HTTP_STATUS.CONFLICT,
				);
			}

			const location = await db.createLocation(data);

			logger.info("Location created successfully", { id: location.id });
			return location;
		} catch (error) {
			logger.error("Error creating location", { error: error.message, data });
			throw error;
		}
	}

	/**
	 * Busca localização por ID
	 */
	async getLocationById(id: string): Promise<Location> {
		try {
			logger.info("Getting location by ID", { id });

			const location = await db.getLocationById(id);
			if (!location) {
				throw new AppError("Localização não encontrada", HTTP_STATUS.NOT_FOUND);
			}

			return location;
		} catch (error) {
			logger.error("Error getting location by ID", {
				error: error.message,
				id,
			});
			throw error;
		}
	}

	/**
	 * Busca localizações com filtros
	 */
	async searchLocations(searchParams: SearchLocation): Promise<{
		locations: Location[];
		total: number;
		limit: number;
		offset: number;
	}> {
		try {
			logger.info("Searching locations", { searchParams });

			const [locations, total] = await Promise.all([
				db.searchLocations(searchParams),
				db.countLocations(searchParams),
			]);

			return {
				locations,
				total,
				limit: searchParams.limit,
				offset: searchParams.offset,
			};
		} catch (error) {
			logger.error("Error searching locations", {
				error: error.message,
				searchParams,
			});
			throw error;
		}
	}

	/**
	 * Atualiza uma localização
	 */
	async updateLocation(
		id: string,
		updates: Partial<UpdateLocation>,
	): Promise<Location> {
		try {
			logger.info("Updating location", { id, updates });

			// Verificar se a localização existe
			const existing = await db.getLocationById(id);
			if (!existing) {
				throw new AppError("Localização não encontrada", HTTP_STATUS.NOT_FOUND);
			}

			// Validações de negócio se houver mudanças de coordenadas
			if (updates.latitude || updates.longitude) {
				const lat = updates.latitude ?? existing.latitude;
				const lng = updates.longitude ?? existing.longitude;

				await this.validateLocationData({
					...existing,
					latitude: lat,
					longitude: lng,
					name: updates.name ?? existing.name,
					description: updates.description ?? existing.description,
					address: updates.address ?? existing.address,
					category: updates.category ?? existing.category,
					createdBy: existing.createdBy,
				});

				// Verificar proximidade (exceto com a própria localização)
				const nearbyLocation = await this.findNearbyLocation(lat, lng, 0.1, id);
				if (nearbyLocation) {
					throw new AppError(
						"Já existe uma localização muito próxima desta posição",
						HTTP_STATUS.CONFLICT,
					);
				}
			}

			const updatedLocation = await db.updateLocation(id, updates);
			if (!updatedLocation) {
				throw new AppError(
					"Erro ao atualizar localização",
					HTTP_STATUS.INTERNAL_SERVER_ERROR,
				);
			}

			logger.info("Location updated successfully", { id });
			return updatedLocation;
		} catch (error) {
			logger.error("Error updating location", {
				error: error.message,
				id,
				updates,
			});
			throw error;
		}
	}

	/**
	 * Remove uma localização
	 */
	async deleteLocation(id: string): Promise<void> {
		try {
			logger.info("Deleting location", { id });

			// Verificar se a localização existe
			const existing = await db.getLocationById(id);
			if (!existing) {
				throw new AppError("Localização não encontrada", HTTP_STATUS.NOT_FOUND);
			}

			const deleted = await db.deleteLocation(id);
			if (!deleted) {
				throw new AppError(
					"Erro ao remover localização",
					HTTP_STATUS.INTERNAL_SERVER_ERROR,
				);
			}

			logger.info("Location deleted successfully", { id });
		} catch (error) {
			logger.error("Error deleting location", { error: error.message, id });
			throw error;
		}
	}

	/**
	 * Verifica se uma localização próxima já existe
	 */
	private async findNearbyLocation(
		latitude: number,
		longitude: number,
		radiusKm: number,
		excludeId?: string,
	): Promise<Location | null> {
		const searchParams: SearchLocation = {
			latitude,
			longitude,
			radius: radiusKm,
			limit: 1,
			offset: 0,
		};

		const results = await db.searchLocations(searchParams);
		return results.find((loc) => loc.id !== excludeId) || null;
	}

	/**
	 * Valida dados da localização
	 */
	private async validateLocationData(data: CreateLocation): Promise<void> {
		// Validação de coordenadas válidas
		if (data.latitude < -90 || data.latitude > 90) {
			throw new AppError(
				"Latitude deve estar entre -90 e 90",
				HTTP_STATUS.BAD_REQUEST,
			);
		}

		if (data.longitude < -180 || data.longitude > 180) {
			throw new AppError(
				"Longitude deve estar entre -180 e 180",
				HTTP_STATUS.BAD_REQUEST,
			);
		}

		// Validação de rating se fornecido
		if (data.rating && (data.rating < 1 || data.rating > 5)) {
			throw new AppError(
				"Rating deve estar entre 1 e 5",
				HTTP_STATUS.BAD_REQUEST,
			);
		}

		// Validação de categoria
		const validCategories = ["safe", "unsafe", "neutral"];
		if (!validCategories.includes(data.category)) {
			throw new AppError(
				`Categoria deve ser uma das seguintes: ${validCategories.join(", ")}`,
				HTTP_STATUS.BAD_REQUEST,
			);
		}
	}

	/**
	 * Obtém estatísticas das localizações
	 */
	async getLocationStats(): Promise<{
		total: number;
		byCategory: Record<string, number>;
		verified: number;
		averageRating: number;
	}> {
		try {
			logger.info("Getting location statistics");

			const allLocations = await db.searchLocations({ limit: 1000, offset: 0 });

			const stats = {
				total: allLocations.locations.length,
				byCategory: {} as Record<string, number>,
				verified: 0,
				averageRating: 0,
			};

			let totalRating = 0;
			let ratedCount = 0;

			for (const location of allLocations.locations) {
				// Contar por categoria
				stats.byCategory[location.category] =
					(stats.byCategory[location.category] || 0) + 1;

				// Contar verificadas
				if (location.verified) {
					stats.verified++;
				}

				// Calcular rating médio
				if (location.rating) {
					totalRating += location.rating;
					ratedCount++;
				}
			}

			stats.averageRating = ratedCount > 0 ? totalRating / ratedCount : 0;

			return stats;
		} catch (error) {
			logger.error("Error getting location statistics", {
				error: error.message,
			});
			throw error;
		}
	}
}

// Instância singleton do serviço
export const locationService = new LocationService();
