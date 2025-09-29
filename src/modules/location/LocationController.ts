import type { Context } from 'elysia'
import { locationService } from './LocationService'
import type {
  CreateLocationRequest,
  UpdateLocationRequest,
  SearchLocationRequest,
  LocationParams,
} from '../../utils/schemas/location'
import {
  successResponse,
  errorResponse,
  notFoundResponse,
} from '../../utils/response'
import { HTTP_STATUS } from '../../utils/constants'
import { logger } from '../../utils/logger'

/**
 * Controller para gerenciar localizações
 */
export class LocationController {
  /**
   * Cria uma nova localização
   */
  async createLocation(ctx: Context) {
    try {
      const body = ctx.body as CreateLocationRequest

      logger.info('Creating location', {
        name: body.name,
        category: body.category,
      })

      const location = await locationService.createLocation(body)

      return successResponse(
        location,
        'Localização criada com sucesso',
        HTTP_STATUS.CREATED
      )
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('Error creating location', {
        error: errorMessage,
        body: ctx.body,
      })

      if (error && typeof error === 'object' && 'statusCode' in error) {
        return errorResponse(
          errorMessage,
          (error as { statusCode: number }).statusCode
        )
      }

      return errorResponse(
        'Erro interno do servidor',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * Busca localização por ID
   */
  async getLocationById(ctx: Context) {
    try {
      const { id } = ctx.params as LocationParams

      logger.info('Getting location by ID', { id })

      const location = await locationService.getLocationById(id)

      return successResponse(location, 'Localização encontrada com sucesso')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('Error getting location by ID', {
        error: errorMessage,
        id: ctx.params?.id,
      })

      if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        (error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
      ) {
        return notFoundResponse('Localização não encontrada')
      }

      if (error && typeof error === 'object' && 'statusCode' in error) {
        return errorResponse(
          errorMessage,
          (error as { statusCode: number }).statusCode
        )
      }

      return errorResponse(
        'Erro interno do servidor',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * Lista localizações com filtros
   */
  async searchLocations(ctx: Context) {
    try {
      const query = ctx.query as SearchLocationRequest

      logger.info('Searching locations', { query })

      const result = await locationService.searchLocations(query)

      return successResponse(
        {
          locations: result.locations,
          pagination: {
            total: result.total,
            limit: result.limit,
            offset: result.offset,
            pages: Math.ceil(result.total / result.limit),
          },
        },
        'Localizações encontradas com sucesso'
      )
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('Error searching locations', {
        error: errorMessage,
        query: ctx.query,
      })

      if (error && typeof error === 'object' && 'statusCode' in error) {
        return errorResponse(
          errorMessage,
          (error as { statusCode: number }).statusCode
        )
      }

      return errorResponse(
        'Erro interno do servidor',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * Atualiza uma localização
   */
  async updateLocation(ctx: Context) {
    try {
      const { id } = ctx.params as LocationParams
      const body = ctx.body as Partial<UpdateLocationRequest>

      logger.info('Updating location', { id, updates: body })

      const location = await locationService.updateLocation(id, body)

      return successResponse(location, 'Localização atualizada com sucesso')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('Error updating location', {
        error: errorMessage,
        id: ctx.params?.id,
        body: ctx.body,
      })

      if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        (error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
      ) {
        return notFoundResponse('Localização não encontrada')
      }

      if (error && typeof error === 'object' && 'statusCode' in error) {
        return errorResponse(
          errorMessage,
          (error as { statusCode: number }).statusCode
        )
      }

      return errorResponse(
        'Erro interno do servidor',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * Remove uma localização
   */
  async deleteLocation(ctx: Context) {
    try {
      const { id } = ctx.params as LocationParams

      logger.info('Deleting location', { id })

      await locationService.deleteLocation(id)

      return successResponse(null, 'Localização removida com sucesso')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('Error deleting location', {
        error: errorMessage,
        id: ctx.params?.id,
      })

      if (
        error &&
        typeof error === 'object' &&
        'statusCode' in error &&
        (error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
      ) {
        return notFoundResponse('Localização não encontrada')
      }

      if (error && typeof error === 'object' && 'statusCode' in error) {
        return errorResponse(
          errorMessage,
          (error as { statusCode: number }).statusCode
        )
      }

      return errorResponse(
        'Erro interno do servidor',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }
  }

  /**
   * Obtém estatísticas das localizações
   */
  async getLocationStats(_ctx: Context) {
    try {
      logger.info('Getting location statistics')

      const stats = await locationService.getLocationStats()

      return successResponse(stats, 'Estatísticas obtidas com sucesso')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'
      logger.error('Error getting location statistics', { error: errorMessage })

      if (error && typeof error === 'object' && 'statusCode' in error) {
        return errorResponse(
          errorMessage,
          (error as { statusCode: number }).statusCode
        )
      }

      return errorResponse(
        'Erro interno do servidor',
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      )
    }
  }
}

// Instância singleton do controller
export const locationController = new LocationController()
