import { env } from '../env'
import { render } from '@react-email/render'
import { logger } from '@/utils/logger'
import { transporter } from './config'
import { EmailOTPTemplate } from './template'
import type { OTPEmailData } from './types'

export class EmailService {
  async sendOTP({ email, otp, type }: OTPEmailData, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const html = await render(EmailOTPTemplate({ otpCode: otp, type }))
        const subject = this.getSubject(type)

        if (
          process.env.NODE_ENV === 'development' ||
          process.env.EMAIL_FALLBACK === 'true'
        ) {
          this.logEmail(email, type, otp, subject)
          return { success: true, messageId: `dev-${Date.now()}` }
        }

        await this.verifyConnection()

        const info = await transporter.sendMail({
          from: `"Safe Zone" <${env.EMAIL_USER}>`,
          to: email,
          subject,
          html,
        })

        logger.info('Email OTP enviado com sucesso', {
          email,
          type,
          messageId: info.messageId,
          attempt,
        })

        return { success: true, messageId: info.messageId }
      } catch (error) {
        logger.error(
          `Erro ao enviar email OTP (tentativa ${attempt}/${retries})`,
          {
            error,
            email,
            type,
            attempt,
          }
        )

        if (attempt === retries) {
          logger.error(
            'Falha definitiva ao enviar email após todas as tentativas',
            {
              email,
              type,
              totalAttempts: retries,
            }
          )
          throw new Error(
            `Falha ao enviar email de verificação após ${retries} tentativas`
          )
        }

        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000)
        logger.info(`Aguardando ${delay}ms antes da próxima tentativa...`)
        await this.sleep(delay)
      }
    }
  }

  private async verifyConnection() {
    try {
      await transporter.verify()
    } catch (error) {
      logger.warn(
        'Falha na verificação de conexão SMTP, tentando reconectar...',
        { error }
      )
      await this.sleep(2000)
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
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
