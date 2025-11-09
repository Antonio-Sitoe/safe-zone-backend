import { z } from "zod";

const EnvSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("localhost"),
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string({ error: "DATABASE_URL is required" }),
  BETTER_AUTH_SECRET: z.string({ error: "BETTER_AUTH_SECRET is required" }),
  BETTER_AUTH_URL: z.string().optional(),
  LOG_LEVEL: z.string({ error: "LOG_LEVEL is required" }),
  RESEND_API_KEY: z.string({ error: "RESEND_API_KEY is required" }),
  EMAIL_FROM: z.string().default("Safe Zone <noreply@safe-zone.com>"),
  SMS_PROVIDER_ID: z.string(),
});

export const env = EnvSchema.parse(process.env);
