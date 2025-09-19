// Tipos de resposta da API
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: string
}

// Tipos de usuário
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

// Tipos de autenticação
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: Omit<User, 'password'>
  token: string
}

// Tipos de localização (para o Safe Zone)
export interface Location {
  id: string
  name: string
  description: string
  latitude: number
  longitude: number
  address: string
  category: LocationCategory
  rating: number
  verified: boolean
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export enum LocationCategory {
  SAFE = 'safe',
  UNSAFE = 'unsafe',
  NEUTRAL = 'neutral',
  EMERGENCY = 'emergency',
}

// Tipos de erro
export interface AppError extends Error {
  statusCode: number
  isOperational: boolean
}

// Tipos de validação
export interface ValidationError {
  field: string
  message: string
  value?: any
}

// Tipos de paginação
export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}
