import { logger } from '@/utils/logger'
import { AppError } from '@/utils/error'

import type {
  IZoneWithUserIdBodyRequest,
  IUpdateZoneBodyRequest,
} from './zone.schema'

import {
  type Coordinates,
  createPointFromCoords,
  parsePoint,
} from './zone.geography'

import {
  type ZoneFeatureDetailsService,
  zoneFeatureDetailsService,
} from '../zone-feature-details/zone.feature.details.service'

import type { Zone } from './zone.types'
import { HTTP_STATUS } from '@/utils/constants'
import type { ZoneRepository } from './zone.repository'
import { ICreateZoneWithFeatureDetailsResponse } from './zone.types'
import { zoneRepository as defaultZoneRepository } from './zone.repository'

export class ZoneService {
  constructor(
    private readonly zoneRepository: ZoneRepository = defaultZoneRepository,
    private readonly zoneDetailsService: ZoneFeatureDetailsService = zoneFeatureDetailsService
  ) {}

  async getAll() {
    const zones = await this.zoneRepository.getAll()
    return zones.map((item) => {
      return {
        ...item,
        coordinates: parsePoint(item.coordinates || '') ?? null,
      }
    })
  }

  async getZoneByType(type: 'SAFE' | 'DANGER') {
    const zones = await this.zoneRepository.getByType(type)
    return zones.map((item) => {
      return {
        ...item,
        coordinates: parsePoint(item.coordinates || '') ?? null,
      }
    })
  }

  async createZone(
    data: IZoneWithUserIdBodyRequest
  ): Promise<ICreateZoneWithFeatureDetailsResponse> {
    const zone = await this.zoneRepository.create(data)
    let featureDetails = null
    if (zone) {
      featureDetails = await this.zoneDetailsService.create(
        zone.id,
        data.type,
        data.featureDetails
      )
    }

    const coordinates = parsePoint(zone.coordinates || '') ?? null

    return {
      ...zone,
      coordinates: {
        latitude: coordinates?.latitude ?? 0,
        longitude: coordinates?.longitude ?? 0,
      },
      featureDetails: featureDetails?.[0] ?? {
        zoneId: zone.id,
        zoneType: zone.type ?? 'SAFE',
        goodLighting: false,
        policePresence: false,
        publicTransport: false,
        insufficientLighting: false,
        lackOfPolicing: false,
        abandonedHouses: false,
      },
    }
  }

  async getZoneById(
    id: string
  ): Promise<Pick<ICreateZoneWithFeatureDetailsResponse, 'coordinates'>> {
    try {
      logger.info('Getting zone by ID', { id })

      const zone = await this.zoneRepository.getById(id)
      if (!zone) {
        throw new AppError('Zona não encontrada', HTTP_STATUS.NOT_FOUND)
      }

      return {
        ...zone,
        coordinates: parsePoint(zone.coordinates || '') ?? {
          latitude: 0,
          longitude: 0,
        },
      }
    } catch (error) {
      logger.error('Error getting zone by ID', {
        error: (error as Error).message,
        id,
      })
      throw error
    }
  }

  async findZonesNearby(
    center: Coordinates,
    radius: number = 1000,
    limit: number = 10
  ): Promise<Zone[]> {
    try {
      logger.info('Finding zones nearby', { center, radius, limit })

      const zones = await this.zoneRepository.findZonesNearby(
        center,
        radius,
        limit
      )
      return zones
    } catch (error) {
      logger.error('Error finding zones nearby', {
        error: (error as Error).message,
        center,
        radius,
        limit,
      })
      throw error
    }
  }

  async updateZone(
    id: string,
    updates: IUpdateZoneBodyRequest
  ): Promise<ICreateZoneWithFeatureDetailsResponse> {
    try {
      const existing = await this.zoneRepository.getById(id)
      if (!existing) {
        throw new AppError('Zona não encontrada', HTTP_STATUS.NOT_FOUND)
      }

      const updateData = {
        ...existing,
        ...updates,
        coordinates: updates.coordinates
          ? typeof updates.coordinates === 'object'
            ? createPointFromCoords(updates.coordinates)
            : updates.coordinates
          : existing.coordinates,
      }

      const updatedZone = await this.zoneRepository.update(id, updateData)
      if (!updatedZone) {
        throw new AppError(
          'Erro ao atualizar zona',
          HTTP_STATUS.INTERNAL_SERVER_ERROR
        )
      }

      if (updates.featureDetails) {
        await this.zoneDetailsService.update(
          updatedZone.id,
          updatedZone.type ?? 'SAFE',
          updates.featureDetails
        )
      }

      const zoneWithDetails = await this.zoneRepository.getById(id)

      return {
        ...zoneWithDetails,
        coordinates: parsePoint(zoneWithDetails.coordinates || '') ?? {
          latitude: 0,
          longitude: 0,
        },
        featureDetails: (zoneWithDetails as any).featureDetails ?? {
          zoneId: zoneWithDetails.id,
          zoneType: zoneWithDetails.type ?? 'SAFE',
          goodLighting: false,
          policePresence: false,
          publicTransport: false,
          insufficientLighting: false,
          lackOfPolicing: false,
          abandonedHouses: false,
        },
      }
    } catch (error) {
      logger.error('Error updating zone', {
        error: (error as Error).message,
        id,
        updates,
      })
      throw error
    }
  }

  async deleteZone(id: string): Promise<void> {
    try {
      logger.info('Deleting zone', { id })

      const existing = await this.zoneRepository.getById(id)
      if (!existing) {
        throw new AppError('Zona não encontrada', HTTP_STATUS.NOT_FOUND)
      }

      await this.zoneRepository.delete(id)

      logger.info('Zone deleted successfully', { id })
    } catch (error) {
      logger.error('Error deleting zone', {
        error: (error as Error).message,
        id,
      })
      throw error
    }
  }

  async findZonesInBoundingBox(
    minLat: number,
    minLng: number,
    maxLat: number,
    maxLng: number,
    limit: number = 50
  ): Promise<Zone[]> {
    try {
      logger.info('Finding zones in bounding box', {
        minLat,
        minLng,
        maxLat,
        maxLng,
        limit,
      })

      const zones = await this.zoneRepository.findZonesInBoundingBox(
        minLat,
        minLng,
        maxLat,
        maxLng,
        limit
      )
      return zones
    } catch (error) {
      logger.error('Error finding zones in bounding box', {
        error: (error as Error).message,
        minLat,
        minLng,
        maxLat,
        maxLng,
        limit,
      })
      throw error
    }
  }

  async updateZoneCoordinates(
    zoneId: string,
    coordinates: Coordinates
  ): Promise<Zone[]> {
    try {
      logger.info('Updating zone coordinates', { zoneId, coordinates })

      const updatedZones = await this.zoneRepository.updateZoneCoordinates(
        zoneId,
        coordinates
      )
      return updatedZones
    } catch (error) {
      logger.error('Error updating zone coordinates', {
        error: (error as Error).message,
        zoneId,
        coordinates,
      })
      throw error
    }
  }
}

export const zoneService = new ZoneService()
