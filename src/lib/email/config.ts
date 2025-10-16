import nodemailer from 'nodemailer'
import { env } from '@/lib/env'

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Porta SSL
  secure: true, // SSL = true na 465
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD, // senha de app (não senha normal da conta)
  },
})
