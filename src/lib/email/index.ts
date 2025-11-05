import { emailService } from './service';

export { emailConfig, resend } from './config';
export { emailService } from './service';
export type {
	EmailConfig,
	EmailMessage,
} from './types';

export async function sendPasswordReset(email: string, resetUrl: string) {
	return emailService.sendPasswordReset({ email, resetUrl });
}
