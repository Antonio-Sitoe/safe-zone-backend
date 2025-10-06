import { and, desc, eq, sql } from 'drizzle-orm'
import { db } from '../../db/db'
import type { Zone } from '../../db/schemas/zone'
import { zones } from '../../db/schemas/zone'
import { type Coordinates, createPointFromCoords } from './zone.geography'
import type { IZoneRepository } from './zone.types'
import type { IZoneWithUserIdBodyRequest } from './zone.schema'

export class ZoneRepository implements IZoneRepository {
  constructor(private readonly database: typeof db = db) {}
  async create(zone: IZoneWithUserIdBodyRequest): Promise<Zone> {
    const point = createPointFromCoords(zone.coordinates)
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
      .returning()
    return data[0]
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
        userId: zone.userId,
        updatedAt: new Date(),
      })
      .where(eq(zones.id, id))
      .returning()
    return data[0]
  }

  async getAll(): Promise<Zone[]> {
    return await this.database
      .select()
      .from(zones)
      .orderBy(desc(zones.createdAt))
  }

  async delete(id: string): Promise<void> {
    await this.database.delete(zones).where(eq(zones.id, id))
  }

  async getById(id: string): Promise<Zone> {
    const data = await this.database
      .select()
      .from(zones)
      .where(eq(zones.id, id))
      .limit(1)
    return data[0]
  }

  async getByUserId(userId: string): Promise<Zone[]> {
    return await this.database
      .select()
      .from(zones)
      .where(eq(zones.userId, userId))
      .orderBy(desc(zones.createdAt))
  }

  async getByLocation(location: string): Promise<Zone[]> {
    return await this.database
      .select()
      .from(zones)
      .where(sql`location ILIKE ${`%${location}%`}`)
      .orderBy(desc(zones.createdAt))
  }

  async getByDate(date: string): Promise<Zone[]> {
    return await this.database
      .select()
      .from(zones)
      .where(eq(zones.date, date))
      .orderBy(desc(zones.createdAt))
  }
}

export const zoneRepository = new ZoneRepository()

/**
 * Find zones within a radius of given coordinates
 * @param center Center coordinates
 * @param radius Radius in meters
 * @param limit Maximum number of results
 */
export async function findZonesNearby(
  center: Coordinates,
  radius: number,
  limit = 10
) {
  const point = createPointFromCoords(center)
  console.log(point)

  return await db
    .select({
      id: zones.id,
      slug: zones.slug,
      date: zones.date,
      hour: zones.hour,
      description: zones.description,
      coordinates: zones.coordinates,
      userId: zones.userId,
      createdAt: zones.createdAt,
      updatedAt: zones.updatedAt,
      distance: sql<number>`ST_Distance(coordinates, ${point}::geography)`,
    })
    .from(zones)
    .where(sql`ST_DWithin(coordinates, ${point}::geography, ${radius})`)
    .orderBy(sql`ST_Distance(coordinates, ${point}::geography)`)
    .limit(limit)
}

/**
 * Find zones within a radius with additional filters
 * @param center Center coordinates
 * @param radius Radius in meters
 * @param filters Additional filters (userId, date range, etc.)
 * @param limit Maximum number of results
 */
export async function findZonesNearbyWithFilters(
  center: Coordinates,
  radius: number,
  filters: {
    userId?: string
    startDate?: string
    endDate?: string
    location?: string
  } = {},
  limit = 10
) {
  const point = createPointFromCoords(center)

  const whereConditions = [
    sql`ST_DWithin(coordinates, ${point}::geography, ${radius})`,
  ]

  if (filters.userId) {
    whereConditions.push(eq(zones.userId, filters.userId))
  }

  if (filters.startDate) {
    whereConditions.push(sql`date >= ${filters.startDate}`)
  }

  if (filters.endDate) {
    whereConditions.push(sql`date <= ${filters.endDate}`)
  }

  if (filters.location) {
    whereConditions.push(sql`location ILIKE ${`%${filters.location}%`}`)
  }

  return await db
    .select({
      id: zones.id,
      slug: zones.slug,
      date: zones.date,
      hour: zones.hour,
      description: zones.description,
      coordinates: zones.coordinates,
      userId: zones.userId,
      createdAt: zones.createdAt,
      updatedAt: zones.updatedAt,
      distance: sql<number>`ST_Distance(coordinates, ${point}::geography)`,
    })
    .from(zones)
    .where(and(...whereConditions))
    .orderBy(sql`ST_Distance(coordinates, ${point}::geography)`)
    .limit(limit)
}

/**
 * Update zone coordinates
 * @param zoneId Zone ID
 * @param coordinates New coordinates
 */
export async function updateZoneCoordinates(
  zoneId: string,
  coordinates: Coordinates
) {
  const point = createPointFromCoords(coordinates)

  return await db
    .update(zones)
    .set({
      coordinates: sql`${point}::geography`,
      updatedAt: new Date(),
    })
    .where(eq(zones.id, zoneId))
    .returning()
}

/**
 * Get zones within a bounding box
 * @param minLat Minimum latitude
 * @param minLng Minimum longitude
 * @param maxLat Maximum latitude
 * @param maxLng Maximum longitude
 * @param limit Maximum number of results
 */
export async function findZonesInBoundingBox(
  minLat: number,
  minLng: number,
  maxLat: number,
  maxLng: number,
  limit = 50
) {
  return await db
    .select()
    .from(zones)
    .where(
      sql`ST_Intersects(
        coordinates, 
        ST_MakeEnvelope(${minLng}, ${minLat}, ${maxLng}, ${maxLat}, 4326)::geography
      )`
    )
    .orderBy(desc(zones.createdAt))
    .limit(limit)
}

/**
 * Get zone statistics within a radius
 * @param center Center coordinates
 * @param radius Radius in meters
 */
export async function getZoneStatsNearby(center: Coordinates, radius: number) {
  const point = createPointFromCoords(center)

  return await db
    .select({
      totalZones: sql<number>`COUNT(*)`,
      avgDistance: sql<number>`AVG(ST_Distance(coordinates, ${point}::geography))`,
      minDistance: sql<number>`MIN(ST_Distance(coordinates, ${point}::geography))`,
      maxDistance: sql<number>`MAX(ST_Distance(coordinates, ${point}::geography))`,
    })
    .from(zones)
    .where(sql`ST_DWithin(coordinates, ${point}::geography, ${radius})`)
}
