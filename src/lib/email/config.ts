import { Queue } from 'bullmq'
import { env } from '@/lib/env'
import type { ConnectionOptions } from 'bullmq'
import nodemailer from 'nodemailer'

export const emailConnection: ConnectionOptions = {
  url: env.REDIS_URL,
}

export const emailQueue = new Queue('emailQueue', {
  connection: emailConnection,
})

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: true,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
})
