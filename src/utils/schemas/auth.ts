import { z } from 'zod'
import { VALIDATION_RULES } from '../constants'

// Schema para login
export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, 'Email muito longo'),
  password: z
    .string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      'Senha deve ter pelo menos 8 caracteres'
    )
    .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, 'Senha muito longa'),
})

// Schema para registro
export const registerSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, 'Email muito longo'),
  password: z
    .string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      'Senha deve ter pelo menos 8 caracteres'
    )
    .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, 'Senha muito longa'),
  name: z
    .string()
    .min(
      VALIDATION_RULES.NAME_MIN_LENGTH,
      'Nome deve ter pelo menos 2 caracteres'
    )
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'Nome muito longo'),
})

// Schema para atualização de perfil
export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(
      VALIDATION_RULES.NAME_MIN_LENGTH,
      'Nome deve ter pelo menos 2 caracteres'
    )
    .max(VALIDATION_RULES.NAME_MAX_LENGTH, 'Nome muito longo')
    .optional(),
  email: z
    .string()
    .email('Email inválido')
    .max(VALIDATION_RULES.EMAIL_MAX_LENGTH, 'Email muito longo')
    .optional(),
})

// Schema para mudança de senha
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z
    .string()
    .min(
      VALIDATION_RULES.PASSWORD_MIN_LENGTH,
      'Nova senha deve ter pelo menos 8 caracteres'
    )
    .max(VALIDATION_RULES.PASSWORD_MAX_LENGTH, 'Nova senha muito longa'),
})

// Tipos inferidos dos schemas
export type LoginRequest = z.infer<typeof loginSchema>
export type RegisterRequest = z.infer<typeof registerSchema>
export type UpdateProfileRequest = z.infer<typeof updateProfileSchema>
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>
