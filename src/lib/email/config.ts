import type { ConnectionOptions } from 'bullmq'
import { Queue } from 'bullmq'
import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

export const emailConnection: ConnectionOptions = {
  url: env.REDIS_URL,
}

export const emailQueue = new Queue('emailQueue', {
  connection: emailConnection,
})

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para outras portas
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
  connectionTimeout: 60000, // 60 segundos
  greetingTimeout: 30000, // 30 segundos
  socketTimeout: 60000, // 60 segundos
  tls: {
    rejectUnauthorized: false,
  },
  pool: true, // usar pool de conexões
  maxConnections: 5,
  maxMessages: 100,
  rateDelta: 20000, // 20 segundos
  rateLimit: 5, // máximo 5 emails por 20 segundos
})
