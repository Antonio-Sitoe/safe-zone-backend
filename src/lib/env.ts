import { z } from 'zod'

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('localhost'),
  NODE_ENV: z.string().default('development'),
  DATABASE_URL: z.string({ error: 'DATABASE_URL is required' }),
  BETTER_AUTH_SECRET: z.string({ error: 'BETTER_AUTH_SECRET is required' }),
  LOG_LEVEL: z.string({ error: 'LOG_LEVEL is required' }),
  LOG_FILE: z.string({ error: 'LOG_FILE is required' }),
  RESEND_API_KEY: z.string({ error: 'RESEND_API_KEY is required' }),
  EMAIL_FROM: z.string().default('Safe Zone <noreply@safe-zone.com>'),
  EMAIL_USER: z.string().optional(),
  EMAIL_PASSWORD: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_SECURE: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
})

export const env = EnvSchema.parse(process.env)
