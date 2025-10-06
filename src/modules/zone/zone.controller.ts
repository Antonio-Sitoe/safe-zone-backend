import type { IZoneBodyRequest } from './zone.schema'
import { HTTP_STATUS } from '../../utils/constants'
import { zoneService, type ZoneService } from './zone.service'
import { errorResponse, successResponse } from '../../utils/response'
import type { AuthenticatedContext } from '@/@types/auth'
import type { Context } from 'elysia'

export class ZoneController {
  constructor(private readonly service: ZoneService = zoneService) {}
  async createZone(ctx: Context) {
    try {
      const context = { ...ctx } as AuthenticatedContext
      const body = context.body as IZoneBodyRequest
      const userId = context?.user?.id
      const zoneData = { ...body, userId }
      const zone = await this.service.createZone(zoneData)
      return successResponse(zone, 'Zona criada com sucesso')
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro desconhecido'

      if (error && typeof error === 'object' && 'statusCode' in error) {
        return errorResponse(
          errorMessage,
          (error as { statusCode: number }).statusCode.toString()
        )
      }
      return errorResponse(
        'Erro interno do servidor',
        HTTP_STATUS.INTERNAL_SERVER_ERROR.toString()
      )
    }
  }

  // async getZoneById(ctx: Context) {
  //   try {
  //     const { id } = ctx.params as { id: string }

  //     logger.info('Getting location by ID', { id })

  //     const location = await locationService.getLocationById(id)

  //     return successResponse(location, 'Localização encontrada com sucesso')
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : 'Erro desconhecido'
  //     logger.error('Error getting location by ID', {
  //       error: errorMessage,
  //       id: ctx.params?.id,
  //     })

  //     if (
  //       error &&
  //       typeof error === 'object' &&
  //       'statusCode' in error &&
  //       (error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
  //     ) {
  //       return notFoundResponse('Localização não encontrada')
  //     }

  //     if (error && typeof error === 'object' && 'statusCode' in error) {
  //       return errorResponse(
  //         errorMessage,
  //         (error as { statusCode: number }).statusCode
  //       )
  //     }

  //     return errorResponse(
  //       'Erro interno do servidor',
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR
  //     )
  //   }
  // }

  // async searchLocations(ctx: Context) {
  //   try {
  //     const query = ctx.query as SearchLocationRequest

  //     logger.info('Searching locations', { query })

  //     const result = await locationService.searchLocations(query)

  //     return successResponse(
  //       {
  //         locations: result.locations,
  //         pagination: {
  //           total: result.total,
  //           limit: result.limit,
  //           offset: result.offset,
  //           pages: Math.ceil(result.total / result.limit),
  //         },
  //       },
  //       'Localizações encontradas com sucesso'
  //     )
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : 'Erro desconhecido'
  //     logger.error('Error searching locations', {
  //       error: errorMessage,
  //       query: ctx.query,
  //     })

  //     if (error && typeof error === 'object' && 'statusCode' in error) {
  //       return errorResponse(
  //         errorMessage,
  //         (error as { statusCode: number }).statusCode
  //       )
  //     }

  //     return errorResponse(
  //       'Erro interno do servidor',
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR
  //     )
  //   }
  // }

  // async updateLocation(ctx: Context) {
  //   try {
  //     const { id } = ctx.params as LocationParams
  //     const body = ctx.body as Partial<UpdateLocationRequest>

  //     logger.info('Updating location', { id, updates: body })

  //     const location = await locationService.updateLocation(id, body)

  //     return successResponse(location, 'Localização atualizada com sucesso')
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : 'Erro desconhecido'
  //     logger.error('Error updating location', {
  //       error: errorMessage,
  //       id: ctx.params?.id,
  //       body: ctx.body,
  //     })

  //     if (
  //       error &&
  //       typeof error === 'object' &&
  //       'statusCode' in error &&
  //       (error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
  //     ) {
  //       return notFoundResponse('Localização não encontrada')
  //     }

  //     if (error && typeof error === 'object' && 'statusCode' in error) {
  //       return errorResponse(
  //         errorMessage,
  //         (error as { statusCode: number }).statusCode
  //       )
  //     }

  //     return errorResponse(
  //       'Erro interno do servidor',
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR
  //     )
  //   }
  // }

  // async deleteLocation(ctx: Context) {
  //   try {
  //     const { id } = ctx.params as LocationParams

  //     logger.info('Deleting location', { id })

  //     await locationService.deleteLocation(id)

  //     return successResponse(null, 'Localização removida com sucesso')
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : 'Erro desconhecido'
  //     logger.error('Error deleting location', {
  //       error: errorMessage,
  //       id: ctx.params?.id,
  //     })

  //     if (
  //       error &&
  //       typeof error === 'object' &&
  //       'statusCode' in error &&
  //       (error as { statusCode: number }).statusCode === HTTP_STATUS.NOT_FOUND
  //     ) {
  //       return notFoundResponse('Localização não encontrada')
  //     }

  //     if (error && typeof error === 'object' && 'statusCode' in error) {
  //       return errorResponse(
  //         errorMessage,
  //         (error as { statusCode: number }).statusCode
  //       )
  //     }

  //     return errorResponse(
  //       'Erro interno do servidor',
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR
  //     )
  //   }
  // }

  // async getLocationStats(_ctx: Context) {
  //   try {
  //     logger.info('Getting location statistics')

  //     const stats = await locationService.getLocationStats()

  //     return successResponse(stats, 'Estatísticas obtidas com sucesso')
  //   } catch (error: unknown) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : 'Erro desconhecido'
  //     logger.error('Error getting location statistics', {
  //       error: errorMessage,
  //     })

  //     if (error && typeof error === 'object' && 'statusCode' in error) {
  //       return errorResponse(
  //         errorMessage,
  //         (error as { statusCode: number }).statusCode
  //       )
  //     }

  //     return errorResponse(
  //       'Erro interno do servidor',
  //       HTTP_STATUS.INTERNAL_SERVER_ERROR
  //     )
  //   }
  // }
}

export const zoneController = new ZoneController()
