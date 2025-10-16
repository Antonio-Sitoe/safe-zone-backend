import { env } from '../env'
import { render } from '@react-email/render'
import { logger } from '@/utils/logger'
import { transporter } from './config'
import { EmailOTPTemplate } from './template'
import type { OTPEmailData } from './types'

export class EmailService {
  async sendOTP({ email, otp, type }: OTPEmailData) {
    try {
      const html = await render(EmailOTPTemplate({ otpCode: otp, type }))
      const subject = this.getSubject(type)

      if (process.env.NODE_ENV === 'development') {
        this.logEmail(email, type, otp, subject)
        return { success: true, messageId: `dev-${Date.now()}` }
      }

      const info = await transporter.sendMail({
        from: `"Safe Zone" <${env.EMAIL_USER}>`,
        to: email,
        subject,
        html,
      })

      return { success: true, messageId: info.messageId }
    } catch (error) {
      logger.error('Erro ao enviar email OTP', { error, email, type })
      throw new Error('Falha ao enviar email de verificação')
    }
  }

  private logEmail(email: string, type: string, otp: string, subject: string) {
    logger.info('Email OTP enviado', { email, type, otp })
    console.log('='.repeat(50))
    console.log(`📧 EMAIL ${type.toUpperCase()}`)
    console.log(`Para: ${email}`)
    console.log(`Assunto: ${subject}`)
    console.log(`OTP: ${otp}`)
    console.log('='.repeat(50))
  }

  private getSubject(type: string): string {
    switch (type) {
      case 'sign-in':
        return '🔐 Código de Acesso - Safe Zone'
      case 'email-verification':
        return '✅ Verifique seu Email - Safe Zone'
      case 'forget-password':
        return '🔄 Redefinir Senha - Safe Zone'
      default:
        return '📧 Código de Verificação - Safe Zone'
    }
  }
}

export const emailService = new EmailService()
