import { ApiResponseSchema } from '@/utils/api-response'
import { z } from 'zod'

export const zoneFeatureDetailsSchema = z.object({
  goodLighting: z.boolean().optional().default(false),
  policePresence: z.boolean().optional().default(false),
  publicTransport: z.boolean().optional().default(false),
  insufficientLighting: z.boolean().optional().default(false),
  lackOfPolicing: z.boolean().optional().default(false),
  abandonedHouses: z.boolean().optional().default(false),
})

export const CreateZoneSchema = z.object({
  slug: z.string().min(1),
  date: z.string().min(1),
  hour: z.string().min(1),
  description: z.string().min(1),
  type: z.enum(['SAFE', 'DANGER']).default('SAFE'),
  coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
})
export const ZoneBodySchema = CreateZoneSchema.extend({
  featureDetails: zoneFeatureDetailsSchema,
})
export const CreateZoneWithUserSchema = CreateZoneSchema.extend({
  userId: z.string().min(1),
  featureDetails: zoneFeatureDetailsSchema,
})

export const ZoneResponseSchema = {
  400: ApiResponseSchema(
    z.object({
      success: z.boolean(),
      message: z.string(),
      error: z.string(),
    })
  ),
  500: ApiResponseSchema(
    z.object({
      success: z.boolean(),
      message: z.string(),
      error: z.string(),
    })
  ),
}
export type IZoneFeatureDetails = z.infer<typeof zoneFeatureDetailsSchema>

export type IZoneRequest = z.infer<typeof CreateZoneSchema>
export type IZoneWithUserIdBodyRequest = z.infer<
  typeof CreateZoneWithUserSchema
>

export type IZoneBodyRequest = z.infer<typeof ZoneBodySchema>
export type IZoneResponse = z.infer<typeof ZoneResponseSchema>
