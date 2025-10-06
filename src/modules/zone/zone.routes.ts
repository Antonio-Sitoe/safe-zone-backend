import { Elysia } from 'elysia'
import { zoneController } from './zone.controller'
import { ZoneBodySchema, ZoneResponseSchema } from './zone.schema'

export const zoneRoutes = new Elysia({ prefix: '/zone' })
  // create zone
  .post('/', zoneController.createZone.bind(zoneController), {
    body: ZoneBodySchema,
    response: ZoneResponseSchema,
    detail: {
      tags: ['Zone'],
      summary: 'Create zone',
      description: 'Create a new zone',
    },
    auth: true,
  })

// export const locationRoutes = new Elysia({ prefix: '/zone' })
//   // Rota para listar localizações com filtros
//   .get('/', locationController.searchLocations.bind(locationController), {
//     query: searchLocationSchema,
//     response: {
//       200: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         data: Type.Object({
//           locations: Type.Array(LocationSchema),
//           pagination: Type.Object({
//             total: Type.Number(),
//             limit: Type.Number(),
//             offset: Type.Number(),
//             pages: Type.Number(),
//           }),
//         }),
//       }),
//       400: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//       500: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//     },
//     detail: {
//       tags: ['Locations'],
//       summary: 'Listar localizações',
//       description: 'Lista localizações com filtros opcionais e paginação',
//     },
//   })

//   // Rota para obter estatísticas
//   .get('/stats', locationController.getLocationStats.bind(locationController), {
//     response: {
//       200: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         data: Type.Object({
//           total: Type.Number(),
//           byCategory: Type.Record(Type.String(), Type.Number()),
//           verified: Type.Number(),
//           averageRating: Type.Number(),
//         }),
//       }),
//       500: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//     },
//     detail: {
//       tags: ['Locations'],
//       summary: 'Estatísticas das localizações',
//       description: 'Obtém estatísticas gerais das localizações',
//     },
//   })

//   // Rota para criar nova localização
//   .post('/', locationController.createLocation.bind(locationController), {
//     body: createLocationSchema,
//     response: {
//       201: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         data: LocationSchema,
//       }),
//       400: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//       409: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//       500: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//     },
//     detail: {
//       tags: ['Locations'],
//       summary: 'Criar localização',
//       description: 'Cria uma nova localização no sistema',
//     },
//   })

//   // Rota para obter localização por ID
//   .get('/:id', locationController.getLocationById.bind(locationController), {
//     params: locationParamsSchema,
//     response: {
//       200: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         data: LocationSchema,
//       }),
//       404: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//       500: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//     },
//     detail: {
//       tags: ['Locations'],
//       summary: 'Obter localização por ID',
//       description: 'Obtém uma localização específica pelo ID',
//     },
//   })

//   // Rota para atualizar localização
//   .put('/:id', locationController.updateLocation.bind(locationController), {
//     params: locationParamsSchema,
//     body: updateLocationSchema,
//     response: {
//       200: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         data: LocationSchema,
//       }),
//       400: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//       404: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//       409: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//       500: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//     },
//     detail: {
//       tags: ['Locations'],
//       summary: 'Atualizar localização',
//       description: 'Atualiza uma localização existente',
//     },
//   })

//   // Rota para remover localização
//   .delete('/:id', locationController.deleteLocation.bind(locationController), {
//     params: locationParamsSchema,
//     response: {
//       200: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         data: Type.Null(),
//       }),
//       404: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//       500: Type.Object({
//         success: Type.Boolean(),
//         message: Type.String(),
//         error: Type.Optional(Type.String()),
//       }),
//     },
//     detail: {
//       tags: ['Locations'],
//       summary: 'Remover localização',
//       description: 'Remove uma localização do sistema',
//     },
//   })
