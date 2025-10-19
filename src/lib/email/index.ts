import { emailService } from './service'
import type { EmailType } from './types'

export { emailService } from './service'
export { resend, emailConfig } from './config'
export type {
  EmailConfig,
  EmailMessage,
  EmailType,
  OTPEmailData,
} from './types'

export async function sendOTP(email: string, otp: string, type: EmailType) {
  return emailService.sendOTP({ email, otp, type })
}
