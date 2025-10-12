import { zones, zoneTypeEnum } from '@/db/schemas/zone'
import { IZoneBodyRequest } from './zone.schema'
import { NewZoneFeatureDetails } from '../zone-feature-details/zone.feature.details.types'
import { Coordinates } from './zone.geography'

export interface IZoneRepository {
  create(zone: IZoneBodyRequest): Promise<Zone>
  update(id: string, zone: Zone): Promise<Zone>
  getAll(): Promise<Zone[]>
  getByType(type: 'SAFE' | 'DANGER'): Promise<Zone[]>
  delete(id: string): Promise<void>
  getById(id: string): Promise<Zone>
  getByUserId(userId: string): Promise<Zone[]>
}

export type Zone = typeof zones.$inferSelect
export type NewZone = typeof zones.$inferInsert
export type ZoneType = (typeof zoneTypeEnum.enumValues)[number]

export interface IZoneWithUserIdBodyRequest extends IZoneBodyRequest {
  userId: string
}

export interface ICreateZoneWithFeatureDetailsResponse
  extends Omit<Zone, 'coordinates'> {
  featureDetails: NewZoneFeatureDetails
  coordinates: Coordinates
}
