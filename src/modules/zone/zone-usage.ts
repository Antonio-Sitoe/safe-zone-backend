/**
 * Examples of using PostGIS with Drizzle ORM for zone operations
 */

import {
	type Coordinates,
	createPointFromCoords,
} from '../lib/queries/geography';
import {
	createZoneWithCoordinates,
	findZonesInBoundingBox,
	findZonesNearby,
	findZonesNearbyWithFilters,
	getZoneStatsNearby,
	updateZoneCoordinates,
} from '../lib/queries/zone-queries';

// Example coordinates (São Paulo, Brazil)
const saoPaulo: Coordinates = {
	latitude: -23.5505,
	longitude: -46.6333,
};

const rioDeJaneiro: Coordinates = {
	latitude: -22.9068,
	longitude: -43.1729,
};

const beloHorizonte: Coordinates = {
	latitude: -19.9167,
	longitude: -43.9345,
};

/**
 * Example 1: Create a zone with coordinates
 */
export async function exampleCreateZone() {
	try {
		const newZone = await createZoneWithCoordinates({
			location: 'Centro de São Paulo',
			date: '2024-01-15',
			hour: '14:30:00',
			description: 'Zona segura no centro da cidade',
			coordinates: saoPaulo,
			userId: 'user-uuid-here',
		});

		console.log('Zone created:', newZone);
		return newZone;
	} catch (error) {
		console.error('Error creating zone:', error);
	}
}

/**
 * Example 2: Find zones within 5km of a location
 */
export async function exampleFindNearbyZones() {
	try {
		const nearbyZones = await findZonesNearby(
			saoPaulo, // Center point
			5000, // 5km radius in meters
			20, // Max 20 results
		);

		console.log(`Found ${nearbyZones.length} zones within 5km:`);
		nearbyZones.forEach((zone) => {
			console.log(`- ${zone.location}: ${Math.round(zone.distance)}m away`);
		});

		return nearbyZones;
	} catch (error) {
		console.error('Error finding nearby zones:', error);
	}
}

/**
 * Example 3: Find zones with filters
 */
export async function exampleFindZonesWithFilters() {
	try {
		const filteredZones = await findZonesNearbyWithFilters(
			saoPaulo,
			10000, // 10km radius
			{
				userId: 'specific-user-id',
				startDate: '2024-01-01',
				endDate: '2024-12-31',
				location: 'centro',
			},
			15,
		);

		console.log(`Found ${filteredZones.length} filtered zones:`);
		filteredZones.forEach((zone) => {
			console.log(
				`- ${zone.location} (${zone.date}): ${Math.round(zone.distance)}m`,
			);
		});

		return filteredZones;
	} catch (error) {
		console.error('Error finding filtered zones:', error);
	}
}

/**
 * Example 4: Update zone coordinates
 */
export async function exampleUpdateZoneCoordinates(zoneId: string) {
	try {
		const updatedZone = await updateZoneCoordinates(
			zoneId,
			rioDeJaneiro, // New coordinates
		);

		console.log('Zone coordinates updated:', updatedZone);
		return updatedZone;
	} catch (error) {
		console.error('Error updating zone coordinates:', error);
	}
}

/**
 * Example 5: Find zones in a bounding box (useful for map views)
 */
export async function exampleBoundingBoxSearch() {
	try {
		// Bounding box around São Paulo metropolitan area
		const zonesInBox = await findZonesInBoundingBox(
			-24.0, // min latitude
			-47.5, // min longitude
			-23.0, // max latitude
			-46.0, // max longitude
			50, // max results
		);

		console.log(`Found ${zonesInBox.length} zones in bounding box`);
		return zonesInBox;
	} catch (error) {
		console.error('Error finding zones in bounding box:', error);
	}
}

/**
 * Example 6: Get statistics for zones in an area
 */
export async function exampleZoneStatistics() {
	try {
		const stats = await getZoneStatsNearby(saoPaulo, 10000); // 10km radius

		console.log('Zone statistics within 10km:');
		console.log(`Total zones: ${stats[0].totalZones}`);
		console.log(`Average distance: ${Math.round(stats[0].avgDistance)}m`);
		console.log(`Closest zone: ${Math.round(stats[0].minDistance)}m`);
		console.log(`Farthest zone: ${Math.round(stats[0].maxDistance)}m`);

		return stats;
	} catch (error) {
		console.error('Error getting zone statistics:', error);
	}
}

/**
 * Example 7: Advanced query with custom SQL
 */
export async function exampleAdvancedQuery() {
	try {
		const { db } = await import('../db/db');
		const { zones } = await import('../db/schemas/zone');
		const { sql } = await import('drizzle-orm');

		// Find zones within 5km, ordered by distance, with custom formatting
		const results = await db
			.select({
				id: zones.id,
				location: zones.location,
				coordinates: zones.coordinates,
				distanceKm: sql<number>`ROUND(ST_Distance(coordinates, ${createPointFromCoords(saoPaulo)}::geography) / 1000, 2)`,
				bearing: sql<number>`ST_Azimuth(${createPointFromCoords(saoPaulo)}::geography, coordinates)`,
			})
			.from(zones)
			.where(
				sql`ST_DWithin(coordinates, ${createPointFromCoords(saoPaulo)}::geography, 5000)`,
			)
			.orderBy(
				sql`ST_Distance(coordinates, ${createPointFromCoords(saoPaulo)}::geography)`,
			)
			.limit(10);

		console.log('Advanced query results:');
		results.forEach((zone) => {
			console.log(
				`- ${zone.location}: ${zone.distanceKm}km, bearing: ${Math.round((zone.bearing * 180) / Math.PI)}°`,
			);
		});

		return results;
	} catch (error) {
		console.error('Error in advanced query:', error);
	}
}

/**
 * Example 8: Batch operations with coordinates
 */
export async function exampleBatchOperations() {
	try {
		const zonesToCreate = [
			{
				location: 'Zona Norte SP',
				date: '2024-01-15',
				hour: '09:00:00',
				description: 'Zona segura zona norte',
				coordinates: { latitude: -23.4891, longitude: -46.6808 },
				userId: 'user-1',
			},
			{
				location: 'Zona Sul SP',
				date: '2024-01-15',
				hour: '15:00:00',
				description: 'Zona segura zona sul',
				coordinates: { latitude: -23.6525, longitude: -46.6453 },
				userId: 'user-2',
			},
			{
				location: 'Zona Oeste SP',
				date: '2024-01-15',
				hour: '18:00:00',
				description: 'Zona segura zona oeste',
				coordinates: { latitude: -23.5505, longitude: -46.7333 },
				userId: 'user-1',
			},
		];

		const createdZones = [];
		for (const zoneData of zonesToCreate) {
			const zone = await createZoneWithCoordinates(zoneData);
			createdZones.push(zone);
		}

		console.log(`Created ${createdZones.length} zones in batch`);
		return createdZones;
	} catch (error) {
		console.error('Error in batch operations:', error);
	}
}

// Run examples (uncomment to test)
// exampleCreateZone()
// exampleFindNearbyZones()
// exampleFindZonesWithFilters()
// exampleBoundingBoxSearch()
// exampleZoneStatistics()
// exampleAdvancedQuery()
// exampleBatchOperations()
