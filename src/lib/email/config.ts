import nodemailer from 'nodemailer';
import { env } from '@/lib/env';

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	host: 'smtp.gmail.com',
	port: 587,
	secure: false,
	auth: {
		user: env.EMAIL_USER,
		pass: env.EMAIL_PASSWORD,
	},
	connectionTimeout: 60000,
	greetingTimeout: 30000,
	socketTimeout: 60000,
	tls: {
		rejectUnauthorized: false,
	},
});
