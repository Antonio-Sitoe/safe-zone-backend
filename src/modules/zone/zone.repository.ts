import { desc, eq, sql } from 'drizzle-orm';
import { db } from '../../db/db';
import { zones } from '../../db/schemas/zone';
import { type Coordinates, createPointFromCoords } from './zone.geography';
import type { IZoneRepository, Zone } from './zone.types';
import type { IZoneWithUserIdBodyRequest } from './zone.schema';
import { zoneFeatureDetails } from '@/db/schemas/zone-details';

export class ZoneRepository implements IZoneRepository {
	constructor(private readonly database: typeof db = db) {}
	async create(zone: IZoneWithUserIdBodyRequest): Promise<Zone> {
		const point = createPointFromCoords(zone.coordinates);
		const data = await this.database
			.insert(zones)
			.values({
				slug: zone.slug,
				date: zone.date,
				hour: zone.hour,
				description: zone.description,
				coordinates: sql`${point}::geography`,
				type: zone.type,
				userId: zone.userId,
				updatedAt: new Date(),
			})
			.returning({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
			});
		return data[0];
	}

	async update(id: string, zone: Zone): Promise<Zone> {
		const data = await this.database
			.update(zones)
			.set({
				slug: zone.slug,
				date: zone.date,
				hour: zone.hour,
				description: zone.description,
				coordinates: zone.coordinates,
				type: zone.type,
				userId: zone.userId,
				updatedAt: new Date(),
			})
			.where(eq(zones.id, id))
			.returning({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
			});
		return data[0];
	}

	async getAll(): Promise<Zone[]> {
		return await this.database
			.select({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
				featureDetails: zoneFeatureDetails,
			})
			.from(zones)
			.leftJoin(zoneFeatureDetails, eq(zones.id, zoneFeatureDetails.zoneId))
			.orderBy(desc(zones.createdAt));
	}

	async getByType(type: 'SAFE' | 'DANGER'): Promise<Zone[]> {
		return await this.database
			.select({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
				featureDetails: zoneFeatureDetails,
			})
			.from(zones)
			.leftJoin(zoneFeatureDetails, eq(zones.id, zoneFeatureDetails.zoneId))
			.where(eq(zones.type, type))
			.orderBy(desc(zones.createdAt));
	}

	async delete(id: string): Promise<void> {
		await this.database.delete(zones).where(eq(zones.id, id));
	}

	async getById(id: string): Promise<Zone> {
		const data = await this.database
			.select({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
				featureDetails: zoneFeatureDetails,
			})
			.from(zones)
			.leftJoin(zoneFeatureDetails, eq(zones.id, zoneFeatureDetails.zoneId))
			.where(eq(zones.id, id))
			.limit(1);
		return data[0];
	}

	async getByUserId(userId: string): Promise<Zone[]> {
		return await this.database
			.select({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
			})
			.from(zones)
			.where(eq(zones.userId, userId))
			.orderBy(desc(zones.createdAt));
	}

	async updateZoneCoordinates(zoneId: string, coordinates: Coordinates) {
		const point = createPointFromCoords(coordinates);

		return await db
			.update(zones)
			.set({
				coordinates: sql`${point}::geography`,
				updatedAt: new Date(),
			})
			.where(eq(zones.id, zoneId))
			.returning({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
			});
	}

	async findZonesNearby(center: Coordinates, radius: number, limit = 10) {
		const point = createPointFromCoords(center);

		return await db
			.select({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
				distance: sql<number>`ST_Distance(coordinates, ${point}::geography)`,
			})
			.from(zones)
			.where(sql`ST_DWithin(coordinates, ${point}::geography, ${radius})`)
			.orderBy(sql`ST_Distance(coordinates, ${point}::geography)`)
			.limit(limit);
	}

	async findZonesInBoundingBox(
		minLat: number,
		minLng: number,
		maxLat: number,
		maxLng: number,
		limit = 50,
	) {
		return await db
			.select({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				coordinates: sql<string>`ST_AsText(${zones.coordinates})`,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
			})
			.from(zones)
			.where(
				sql`ST_Intersects(
        coordinates, 
        ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326)::geography
      )`,
			)
			.orderBy(desc(zones.createdAt))
			.limit(limit);
	}
}

export const zoneRepository = new ZoneRepository();
