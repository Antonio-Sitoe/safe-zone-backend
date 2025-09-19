import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string({ error: 'DATABASE_URL is required' }),
  BETTER_AUTH_SECRET: z.string({ error: 'BETTER_AUTH_SECRET is required' }),
  BETTER_AUTH_URL: z.string({ error: 'BETTER_AUTH_URL is required' }),
  REDIS_URL: z.string({ error: 'REDIS_URL is required' }),
  CORS_ORIGIN: z.string({ error: 'CORS_ORIGIN is required' }),
  LOG_LEVEL: z.string({ error: 'LOG_LEVEL is required' }),
  LOG_FILE: z.string({ error: 'LOG_FILE is required' }),
  CORS_CREDENTIALS: z.coerce
    .boolean({ error: 'CORS_CREDENTIALS is required' })
    .default(true),
})

export const env = EnvSchema.parse(process.env)
