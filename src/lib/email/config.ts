import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
  connectionTimeout: 30000,
  greetingTimeout: 15000,
  socketTimeout: 30000,
  pool: true,
  maxConnections: 1,
  maxMessages: 3,
  rateDelta: 20000,
  rateLimit: 5,
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3',
  },
  debug: process.env.NODE_ENV === 'development',
  logger: process.env.NODE_ENV === 'development',
})
