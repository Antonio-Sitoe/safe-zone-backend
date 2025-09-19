import { Type, Static } from '@sinclair/typebox'
import { VALIDATION_RULES, LOCATION_CATEGORIES, USER_ROLES } from '../constants'

// Schemas de resposta da API
export const ApiResponseSchema = <T extends any>(dataSchema: T) =>
  Type.Object({
    success: Type.Boolean(),
    message: Type.String(),
    data: Type.Optional(dataSchema),
    error: Type.Optional(Type.String()),
  })

// Schemas de usuário
export const UserSchema = Type.Object({
  id: Type.String(),
  email: Type.String({ format: 'email' }),
  name: Type.String({ minLength: 2, maxLength: 100 }),
  role: Type.Enum(USER_ROLES),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export const UserRoleSchema = Type.Enum(USER_ROLES)

// Schemas de autenticação
export const LoginRequestSchema = Type.Object({
  email: Type.String({
    format: 'email',
    maxLength: VALIDATION_RULES.EMAIL_MAX_LENGTH,
  }),
  password: Type.String({
    minLength: VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: VALIDATION_RULES.PASSWORD_MAX_LENGTH,
  }),
})

export const RegisterRequestSchema = Type.Object({
  email: Type.String({
    format: 'email',
    maxLength: VALIDATION_RULES.EMAIL_MAX_LENGTH,
  }),
  password: Type.String({
    minLength: VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: VALIDATION_RULES.PASSWORD_MAX_LENGTH,
  }),
  name: Type.String({
    minLength: VALIDATION_RULES.NAME_MIN_LENGTH,
    maxLength: VALIDATION_RULES.NAME_MAX_LENGTH,
  }),
})

export const UpdateProfileRequestSchema = Type.Object({
  name: Type.Optional(
    Type.String({
      minLength: VALIDATION_RULES.NAME_MIN_LENGTH,
      maxLength: VALIDATION_RULES.NAME_MAX_LENGTH,
    })
  ),
  email: Type.Optional(
    Type.String({
      format: 'email',
      maxLength: VALIDATION_RULES.EMAIL_MAX_LENGTH,
    })
  ),
})

export const ChangePasswordRequestSchema = Type.Object({
  currentPassword: Type.String({ minLength: 1 }),
  newPassword: Type.String({
    minLength: VALIDATION_RULES.PASSWORD_MIN_LENGTH,
    maxLength: VALIDATION_RULES.PASSWORD_MAX_LENGTH,
  }),
})

export const AuthResponseSchema = Type.Object({
  user: Type.Omit(UserSchema, ['password']),
  token: Type.String(),
})

// Schemas de localização
export const LocationCategorySchema = Type.Enum(LOCATION_CATEGORIES)

export const LocationSchema = Type.Object({
  id: Type.String(),
  name: Type.String({ minLength: 2, maxLength: 100 }),
  description: Type.Optional(
    Type.String({
      maxLength: VALIDATION_RULES.DESCRIPTION_MAX_LENGTH,
    })
  ),
  latitude: Type.Number({ minimum: -90, maximum: 90 }),
  longitude: Type.Number({ minimum: -180, maximum: 180 }),
  address: Type.String({
    minLength: 5,
    maxLength: VALIDATION_RULES.ADDRESS_MAX_LENGTH,
  }),
  category: LocationCategorySchema,
  rating: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
  verified: Type.Boolean(),
  createdBy: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' }),
})

export const CreateLocationRequestSchema = Type.Object({
  name: Type.String({ minLength: 2, maxLength: 100 }),
  description: Type.Optional(
    Type.String({
      maxLength: VALIDATION_RULES.DESCRIPTION_MAX_LENGTH,
    })
  ),
  latitude: Type.Number({ minimum: -90, maximum: 90 }),
  longitude: Type.Number({ minimum: -180, maximum: 180 }),
  address: Type.String({
    minLength: 5,
    maxLength: VALIDATION_RULES.ADDRESS_MAX_LENGTH,
  }),
  category: LocationCategorySchema,
  rating: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
})

export const UpdateLocationRequestSchema = Type.Object({
  name: Type.Optional(Type.String({ minLength: 2, maxLength: 100 })),
  description: Type.Optional(
    Type.String({
      maxLength: VALIDATION_RULES.DESCRIPTION_MAX_LENGTH,
    })
  ),
  latitude: Type.Optional(Type.Number({ minimum: -90, maximum: 90 })),
  longitude: Type.Optional(Type.Number({ minimum: -180, maximum: 180 })),
  address: Type.Optional(
    Type.String({
      minLength: 5,
      maxLength: VALIDATION_RULES.ADDRESS_MAX_LENGTH,
    })
  ),
  category: Type.Optional(LocationCategorySchema),
  rating: Type.Optional(Type.Number({ minimum: 1, maximum: 5 })),
})

export const SearchLocationRequestSchema = Type.Object({
  query: Type.Optional(Type.String({ minLength: 1 })),
  category: Type.Optional(LocationCategorySchema),
  latitude: Type.Optional(Type.Number()),
  longitude: Type.Optional(Type.Number()),
  radius: Type.Optional(
    Type.Number({
      minimum: 0.1,
      maximum: 100,
    })
  ),
  page: Type.Optional(Type.Number({ minimum: 1 })),
  limit: Type.Optional(
    Type.Number({
      minimum: 1,
      maximum: 100,
    })
  ),
})

// Schemas de paginação
export const PaginationSchema = Type.Object({
  page: Type.Number({ minimum: 1 }),
  limit: Type.Number({ minimum: 1, maximum: 100 }),
  total: Type.Number({ minimum: 0 }),
  totalPages: Type.Number({ minimum: 0 }),
  hasNext: Type.Boolean(),
  hasPrev: Type.Boolean(),
})

export const PaginatedResponseSchema = <T extends any>(itemSchema: T) =>
  Type.Object({
    data: Type.Array(itemSchema),
    pagination: PaginationSchema,
  })

// Schemas de health check
export const HealthCheckSchema = Type.Object({
  status: Type.String(),
  timestamp: Type.String({ format: 'date-time' }),
  uptime: Type.Number(),
  environment: Type.String(),
})

// Schemas de erro
export const ValidationErrorSchema = Type.Object({
  field: Type.String(),
  message: Type.String(),
  value: Type.Optional(Type.Any()),
})

// Tipos inferidos dos schemas
export type User = Static<typeof UserSchema>
export type UserRole = Static<typeof UserRoleSchema>
export type LoginRequest = Static<typeof LoginRequestSchema>
export type RegisterRequest = Static<typeof RegisterRequestSchema>
export type UpdateProfileRequest = Static<typeof UpdateProfileRequestSchema>
export type ChangePasswordRequest = Static<typeof ChangePasswordRequestSchema>
export type AuthResponse = Static<typeof AuthResponseSchema>
export type Location = Static<typeof LocationSchema>
export type LocationCategory = Static<typeof LocationCategorySchema>
export type CreateLocationRequest = Static<typeof CreateLocationRequestSchema>
export type UpdateLocationRequest = Static<typeof UpdateLocationRequestSchema>
export type SearchLocationRequest = Static<typeof SearchLocationRequestSchema>
export type HealthCheck = Static<typeof HealthCheckSchema>
export type ValidationError = Static<typeof ValidationErrorSchema>
