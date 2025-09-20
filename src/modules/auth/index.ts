export { authRoutes } from './auth.routes'
export { authController } from './auth.controller'
export { authService } from './auth.service'

export type {
  LoginRequest,
  RegisterRequest,
  User,
  Session,
  AuthResponse,
  ApiResponse,
  AuthResult,
  AuthContext,
  ValidationError,
  AuthConfig,
  AuthEvent,
} from './auth.types'

export {
  LoginRequestSchema,
  RegisterRequestSchema,
  UserSchema,
  SessionSchema,
  AuthResponseSchema,
  OtpResponseDataSchema,
  ApiResponseSchema,
  SignInResponseSchema,
  SignUpResponseSchema,
  SignOutResponseSchema,
} from './auth.schemas'
