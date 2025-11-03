export interface EmailConfig {
	from: string;
	apiKey: string;
}

export interface EmailMessage {
	to: string | string[];
	subject: string;
	text?: string;
	html: string;
	from?: string;
}

export type EmailType = 'sign-in' | 'email-verification' | 'forget-password';

export interface OTPEmailData {
	email: string;
	otp: string;
	type: EmailType;
}
