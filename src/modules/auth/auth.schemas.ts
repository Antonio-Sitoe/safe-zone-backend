import { z } from 'zod'

export const LoginRequestSchema = z.object({
  email: z.email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa'),
})

export const RegisterRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome deve ter pelo menos 2 caracteres')
    .max(100, 'Nome muito longo'),
  email: z.email('Email inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(128, 'Senha muito longa'),
})

export const UserSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string(),
  emailVerified: z.boolean(),
  image: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const SessionSchema = z.object({
  id: z.string(),
  token: z.string(),
  expiresAt: z.string(),
})

export const AuthResponseSchema = z.object({
  user: UserSchema,
  session: SessionSchema,
})

export const OtpResponseDataSchema = z.object({
  message: z.string(),
})

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    message: z.string(),
    data: dataSchema.optional(),
    error: z.string().optional(),
  })

export const SignInResponseSchema = {
  200: ApiResponseSchema(AuthResponseSchema),
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

export const SignUpResponseSchema = {
  201: ApiResponseSchema(AuthResponseSchema),
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

export const SignOutResponseSchema = {
  200: ApiResponseSchema(z.null()),
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

export type LoginRequest = z.infer<typeof LoginRequestSchema>
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>
export type User = z.infer<typeof UserSchema>
export type Session = z.infer<typeof SessionSchema>
export type AuthResponse = z.infer<typeof AuthResponseSchema>
export type OtpResponse = z.infer<typeof OtpResponseDataSchema>
