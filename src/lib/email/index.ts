import { emailService } from './service';
import type { EmailType } from './types';

export { emailConfig, resend } from './config';
export { emailService } from './service';
export type {
	EmailConfig,
	EmailMessage,
	EmailType,
	OTPEmailData,
} from './types';

export async function sendOTP(email: string, otp: string, type: EmailType) {
	return emailService.sendOTP({ email, otp, type });
}

export async function sendPasswordReset(email: string, resetUrl: string) {
	return emailService.sendPasswordReset({ email, resetUrl });
}
