export interface EmailConfig {
  host: string
  port: number
  secure: boolean
  user: string
  pass: string
}

export interface EmailMessage {
  to: string
  subject: string
  text: string
  html: string
}

export type EmailType = 'sign-in' | 'email-verification' | 'forget-password'

export interface OTPEmailData {
  email: string
  otp: string
  type: EmailType
}
