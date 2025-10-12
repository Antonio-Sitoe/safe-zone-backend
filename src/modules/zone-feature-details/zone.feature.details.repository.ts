import { eq } from 'drizzle-orm'
import { db } from '@/db/db'
import { zoneFeatureDetails } from '@/db/schemas/zone-details'
import type { IZoneFeatureDetails } from '../zone/zone.schema'

export class ZoneFeatureDetailsRepository {
  constructor(private readonly database: typeof db = db) {}
  async create(
    zoneId: string,
    featureDetails: IZoneFeatureDetails & { type: 'SAFE' | 'DANGER' }
  ) {
    return this.database
      .insert(zoneFeatureDetails)
      .values({
        zoneId,
        zoneType: featureDetails.type,
        goodLighting: featureDetails.goodLighting,
        policePresence: featureDetails.policePresence,
        publicTransport: featureDetails.publicTransport,
        insufficientLighting: featureDetails.insufficientLighting,
        lackOfPolicing: featureDetails.lackOfPolicing,
        abandonedHouses: featureDetails.abandonedHouses,
      })
      .returning()
  }

  async update(
    zoneId: string,
    featureDetails: IZoneFeatureDetails & { type: 'SAFE' | 'DANGER' }
  ) {
    return this.database
      .update(zoneFeatureDetails)
      .set({
        zoneType: featureDetails.type,
        goodLighting: featureDetails.goodLighting,
        policePresence: featureDetails.policePresence,
        publicTransport: featureDetails.publicTransport,
        insufficientLighting: featureDetails.insufficientLighting,
        lackOfPolicing: featureDetails.lackOfPolicing,
        abandonedHouses: featureDetails.abandonedHouses,
      })
      .where(eq(zoneFeatureDetails.zoneId, zoneId))
      .returning()
  }
}

export const zoneFeatureDetailsRepository = new ZoneFeatureDetailsRepository()
