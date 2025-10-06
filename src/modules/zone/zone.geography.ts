/**
 * Utility functions for PostGIS geography operations
 */

export interface Coordinates {
	latitude: number;
	longitude: number;
}

// Regex pattern for parsing PostGIS POINT strings
const POINT_REGEX = /POINT\(([\d.-]+)\s+([\d.-]+)\)/;

/**
 * Create a PostGIS POINT from latitude and longitude
 * @param lat Latitude
 * @param lng Longitude
 * @returns PostGIS POINT string
 */
export function createPoint(lat: number, lng: number): string {
	return `POINT(${lng} ${lat})`;
}

/**
 * Create a PostGIS POINT from Coordinates object
 * @param coords Coordinates object
 * @returns PostGIS POINT string
 */
export function createPointFromCoords(coords: Coordinates): string {
	return createPoint(coords.latitude, coords.longitude);
}

/**
 * Parse PostGIS POINT string to Coordinates object
 * @param point PostGIS POINT string
 * @returns Coordinates object
 */
export function parsePoint(point: string): Coordinates | null {
	const match = point.match(POINT_REGEX);
	if (match) {
		return {
			longitude: Number.parseFloat(match[1]),
			latitude: Number.parseFloat(match[2]),
		};
	}
	return null;
}

/**
 * Calculate distance between two points using PostGIS ST_Distance
 * @param point1 First point
 * @param point2 Second point
 * @returns Distance in meters
 */
export function calculateDistance(
	point1: Coordinates,
	point2: Coordinates,
): string {
	const p1 = createPointFromCoords(point1);
	const p2 = createPointFromCoords(point2);
	return `ST_Distance('${p1}'::geography, '${p2}'::geography)`;
}

/**
 * Create ST_DWithin query for finding nearby points
 * @param center Center coordinates
 * @param radius Radius in meters
 * @returns ST_DWithin SQL expression
 */
export function createStdWithinQuery(
	center: Coordinates,
	radius: number,
): string {
	const point = createPointFromCoords(center);
	return `ST_DWithin(coordinates, '${point}'::geography, ${radius})`;
}
