import { zoneFeatureDetails } from '@/db/schemas/zone-details';
import { IZoneFeatureDetails } from '../zone/zone.schema';
import { db } from '@/db/db';

export class ZoneFeatureDetailsRepository {
	constructor(private readonly database: typeof db = db) {}
	async create(
		zoneId: string,
		featureDetails: IZoneFeatureDetails & { type: 'SAFE' | 'DANGER' },
	) {
		return this.database.insert(zoneFeatureDetails).values({
			zoneId,
			zoneType: featureDetails.type,
			goodLighting: featureDetails.goodLighting,
			policePresence: featureDetails.policePresence,
			publicTransport: featureDetails.publicTransport,
			insufficientLighting: featureDetails.insufficientLighting,
			lackOfPolicing: featureDetails.lackOfPolicing,
			abandonedHouses: featureDetails.abandonedHouses,
		});
	}
}

export const zoneFeatureDetailsRepository = new ZoneFeatureDetailsRepository();
