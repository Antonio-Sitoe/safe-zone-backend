import { IZoneFeatureDetails } from '../zone/zone.schema';
import {
	type ZoneFeatureDetailsRepository,
	zoneFeatureDetailsRepository,
} from './zone.feature.details.repository';

export class ZoneFeatureDetailsService {
	constructor(
		private readonly repository: ZoneFeatureDetailsRepository = zoneFeatureDetailsRepository,
	) {}

	async create(
		zoneId: string,
		type: 'SAFE' | 'DANGER',
		featureDetails: IZoneFeatureDetails,
	) {
		return this.repository.create(zoneId, {
			...featureDetails,
			type,
		});
	}

	async update(
		zoneId: string,
		type: 'SAFE' | 'DANGER',
		featureDetails: IZoneFeatureDetails,
	) {
		return this.repository.update(zoneId, {
			...featureDetails,
			type,
		});
	}
}

export const zoneFeatureDetailsService = new ZoneFeatureDetailsService();
