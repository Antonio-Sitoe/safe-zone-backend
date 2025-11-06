import { render } from '@react-email/render';
import { logger } from '@/utils/logger';
import { emailConfig, resend } from './config';
import { PasswordResetEmailTemplate } from './password-reset-template';

export class EmailService {
	async sendPasswordReset({
		email,
		resetUrl,
	}: {
		email: string;
		resetUrl: string;
	}) {
		try {
			const html = await render(
				PasswordResetEmailTemplate({ resetUrl, userEmail: email }),
			);
			const subject = '🔄 Redefinir Senha - Safe Zone';

			if (process.env.NODE_ENV === 'development') {
				this.logPasswordReset(email, resetUrl, subject);
				return { success: true, messageId: `dev-${Date.now()}` };
			}

			const { data, error } = await resend.emails.send({
				from: emailConfig.from,
				to: [email],
				subject,
				html,
			});

			if (error) {
				logger.error('Erro ao enviar email de reset de senha via Resend', {
					error,
					email,
				});
				throw new Error('Falha ao enviar email de recuperação');
			}

			return { success: true, messageId: data?.id };
		} catch (error) {
			logger.error('Erro ao enviar email de reset de senha', { error, email });
			throw new Error('Falha ao enviar email de recuperação');
		}
	}

	private logPasswordReset(email: string, resetUrl: string, subject: string) {
		logger.info('Email de reset de senha enviado', { email, resetUrl });
		console.log('='.repeat(50));
		console.log(`📧 EMAIL DE RESET DE SENHA`);
		console.log(`Para: ${email}`);
		console.log(`Assunto: ${subject}`);
		console.log(`Link: ${resetUrl}`);
		console.log('='.repeat(50));
	}
}

export const emailService = new EmailService();
