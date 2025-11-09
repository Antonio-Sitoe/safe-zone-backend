import { z } from 'zod'

export const SendAlertRequestSchema = z.object({
  contactIds: z
    .array(z.uuid('Cada ID deve ser um UUID válido'))
    .min(1, 'É necessário fornecer pelo menos um contato')
    .max(100, 'Máximo de 100 contatos por alerta'),
})

export const AlertResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      sent: z.number(),
      failed: z.number(),
      contacts: z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          phone: z.string(),
          status: z.enum(['sent', 'failed']),
        })
      ),
    })
    .optional(),
  error: z.string().optional(),
})

export type ISendAlertBody = z.infer<typeof SendAlertRequestSchema>
export type SendAlertRequest = z.infer<typeof SendAlertRequestSchema>
export type AlertResponse = z.infer<typeof AlertResponseSchema>
