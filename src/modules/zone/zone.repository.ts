import { desc, eq, sql } from 'drizzle-orm';
import { zoneFeatureDetails } from '@/db/schemas/zone-details';
import { db } from '../../db/db';
import { criticalZones, zones } from '../../db/schemas/zone';
import { type Coordinates, createPointFromCoords } from './zone.geography';
import type { IZoneWithUserIdBodyRequest } from './zone.schema';
import type { IZoneRepository, Zone } from './zone.types';

export class ZoneRepository implements IZoneRepository {
	constructor(private readonly database: typeof db = db) {}
	async create(zone: IZoneWithUserIdBodyRequest): Promise<Zone> {
		const data = await this.database
			.insert(zones)
			.values({
				slug: zone.slug,
				date: zone.date,
				hour: zone.hour,
				description: zone.description,
				latitude: zone.coordinates.latitude,
				longitude: zone.coordinates.longitude,
				geom: { x: zone.coordinates.longitude, y: zone.coordinates.latitude },
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
				latitude: zones.latitude,
				longitude: zones.longitude,
				geom: zones.geom,
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
				latitude: zones.latitude,
				longitude: zones.longitude,
				geom: zones.geom,
				type: zones.type,
				userId: zones.userId,
				updatedAt: new Date(),
			})
			.where(eq(zones.id, id))
			.returning({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				latitude: zones.latitude,
				longitude: zones.longitude,
				geom: zones.geom,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
			});
		return data[0];
	}

	async getAll(lat?: number, long?: number, type?: 'SAFE' | 'DANGER') {
		const hasCoordinates =
			typeof lat === 'number' &&
			!Number.isNaN(lat) &&
			typeof long === 'number' &&
			!Number.isNaN(long);

		if (!hasCoordinates) {
			if (type) {
				return await this.database
					.select({
						id: zones.id,
						slug: zones.slug,
						date: zones.date,
						hour: zones.hour,
						description: zones.description,
						latitude: zones.latitude,
						longitude: zones.longitude,
						geom: zones.geom,
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

			return await this.database
				.select({
					id: zones.id,
					slug: zones.slug,
					date: zones.date,
					hour: zones.hour,
					description: zones.description,
					latitude: zones.latitude,
					longitude: zones.longitude,
					geom: zones.geom,
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

		const safeLat = lat as number;
		const safeLong = long as number;

		const query = sql`
    WITH ranked AS (
      SELECT *,
             ST_Distance(
               geom::geography,
               ST_SetSRID(ST_MakePoint(${safeLong}, ${safeLat}), 4326)::geography
             ) AS distance_meters,
             ROW_NUMBER() OVER (
               PARTITION BY "userId" 
               ORDER BY ST_Distance(
                 geom::geography,
                 ST_SetSRID(ST_MakePoint(${safeLong}, ${safeLat}), 4326)::geography
               )
             ) AS rn
      FROM zones
      ${type ? sql`WHERE type = ${type}` : sql``}
    )
    SELECT *
    FROM ranked
    WHERE rn = 1
    ORDER BY distance_meters ASC
  `;

		const result = await db.execute(query);
		return result;
	}

	async getCenter(lat: number, long: number, type: 'SAFE' | 'DANGER') {
		const result = await db.execute(sql`
    SELECT
      ST_X(ST_Centroid(ST_Collect(geom))) AS longitude,
      ST_Y(ST_Centroid(ST_Collect(geom))) AS latitude
    FROM zones
    WHERE type = ${type}
      AND ST_DWithin(
        geom::geography,
        ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)::geography,
        1000
      )
  `);

		if (!result?.[0]?.longitude) {
			return null;
		}

		return {
			latitude: result[0].latitude,
			longitude: result[0].longitude,
		};
	}

	async createCriticalZone(latitude: number, longitude: number): Promise<void> {
		await this.database.insert(criticalZones).values({
			latitude,
			longitude,
			geom: { x: longitude, y: latitude },
		});
	}
	async getByType(type: 'SAFE' | 'DANGER'): Promise<Zone[]> {
		return await this.database
			.select({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				latitude: zones.latitude,
				longitude: zones.longitude,
				geom: zones.geom,
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
				latitude: zones.latitude,
				longitude: zones.longitude,
				geom: zones.geom,
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
				latitude: zones.latitude,
				longitude: zones.longitude,
				geom: zones.geom,
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
		return await db
			.update(zones)
			.set({
				latitude: coordinates.latitude,
				longitude: coordinates.longitude,
				geom: { x: coordinates.longitude, y: coordinates.latitude },
				updatedAt: new Date(),
			})
			.where(eq(zones.id, zoneId))
			.returning({
				id: zones.id,
				slug: zones.slug,
				date: zones.date,
				hour: zones.hour,
				description: zones.description,
				latitude: zones.latitude,
				longitude: zones.longitude,
				geom: zones.geom,
				type: zones.type,
				userId: zones.userId,
				createdAt: zones.createdAt,
				updatedAt: zones.updatedAt,
			});
	}

	async getNearbyZones(lat: number, long: number, radius = 1000) {
		const result = await db.execute(sql`
    SELECT
      DISTINCT(geom), slug, type, latitude, longitude,
      ST_Distance(
        geom::geography,
        ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)::geography
      ) AS distance_meters
    FROM zones
    WHERE type = 'DANGER'
      AND ST_DWithin(
        geom::geography,
        ST_SetSRID(ST_MakePoint(${long}, ${lat}), 4326)::geography,
        ${radius}
      )
    ORDER BY distance_meters ASC
  `);

		return result;
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
				latitude: zones.latitude,
				longitude: zones.longitude,
				geom: zones.geom,
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
