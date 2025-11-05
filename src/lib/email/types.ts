export interface EmailConfig {
  from: string
  apiKey: string
}

export interface EmailMessage {
  to: string | string[]
  subject: string
  text?: string
  html: string
  from?: string
}
