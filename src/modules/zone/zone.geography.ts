export interface Coordinates {
	latitude: number;
	longitude: number;
}

const POINT_REGEX = /POINT\(([\d.-]+)\s+([\d.-]+)\)/;

export function createPoint(lat: number, lng: number): string {
	return `POINT(${lng} ${lat})`;
}

export function createPointFromCoords(coords: Coordinates): string {
	return createPoint(coords.latitude, coords.longitude);
}

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

export function calculateDistance(
	point1: Coordinates,
	point2: Coordinates,
): string {
	const p1 = createPointFromCoords(point1);
	const p2 = createPointFromCoords(point2);
	return `ST_Distance('${p1}'::geography, '${p2}'::geography)`;
}

export function createStdWithinQuery(
	center: Coordinates,
	radius: number,
): string {
	const point = createPointFromCoords(center);
	return `ST_DWithin(coordinates, '${point}'::geography, ${radius})`;
}
