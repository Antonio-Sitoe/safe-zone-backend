import { z } from 'zod'
import {
  CreateLocationSchema,
  UpdateLocationSchema,
  SearchLocationSchema,
} from '../../db/schemas/Location'

// Schema para criação de localização (com createdBy obrigatório)
export const createLocationSchema = CreateLocationSchema.extend({
  createdBy: z.string().uuid('ID do usuário inválido'),
})

// Schema para atualização de localização (com id obrigatório)
export const updateLocationSchema = UpdateLocationSchema

// Schema para busca de localizações (com paginação)
export const searchLocationSchema = SearchLocationSchema.extend({
  page: z.number().min(1, 'Página deve ser pelo menos 1').optional(),
}).transform((data) => {
  // Converter page para offset
  const page = data.page || 1
  const limit = data.limit || 20
  const offset = (page - 1) * limit

  return {
    ...data,
    offset,
    limit,
  }
})

// Schema para parâmetros de rota
export const locationParamsSchema = z.object({
  id: z.string().uuid('ID inválido'),
})

// Tipos inferidos dos schemas
export type CreateLocationRequest = z.infer<typeof createLocationSchema>
export type UpdateLocationRequest = z.infer<typeof updateLocationSchema>
export type SearchLocationRequest = z.infer<typeof searchLocationSchema>
export type LocationParams = z.infer<typeof locationParamsSchema>
