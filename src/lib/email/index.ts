import { emailService } from './service';
import type { EmailType } from './types';

export { transporter } from './config';
export { emailService } from './service';
export type {
	EmailConfig,
	EmailMessage,
	EmailType,
	OTPEmailData,
} from './types';

export async function sendOTP(
	email: string,
	otp: string,
	type: EmailType,
	retries = 3,
) {
	return emailService.sendOTP({ email, otp, type }, retries);
}
