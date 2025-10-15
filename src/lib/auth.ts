import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { bearer, emailOTP, openAPI } from 'better-auth/plugins';
import { db } from '@/db/db';
import { emailService } from './email/service';

export const auth = betterAuth({
	basePath: '/auth',
	trustedOrigins: ['https://cbf4dbc024b2.ngrok-free.app'],
	plugins: [
		openAPI(),
		bearer(),
		emailOTP({
			otpLength: 4,
			async sendVerificationOTP({ email, otp, type }) {
				await emailService.sendOTP({ email, otp, type });
			},
		}),
	],
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true,
	}),
	advanced: {
		database: {
			generateId: false,
		},
	},
	emailAndPassword: {
		autoSignIn: true,
		enabled: true,
		password: {
			hash: (password: string) => Bun.password.hash(password),
			verify: ({ hash, password }) => Bun.password.verify(password, hash),
		},
	},
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		cookieCache: {
			enabled: true,
			maxAge: 60 * 5,
		},
	},
});

let _schema: ReturnType<typeof auth.api.generateOpenAPISchema>;
const getSchema = async () => {
	_schema ??= auth.api.generateOpenAPISchema();
	return _schema;
};

export const OpenAPI = {
	getPaths: (prefix = '/auth') =>
		getSchema().then(({ paths }) => {
			const reference: typeof paths = Object.create(null);

			for (const path of Object.keys(paths)) {
				const key = prefix + path;
				reference[key] = paths[path];

				for (const method of Object.keys(paths[path])) {
					const operation = (reference[key] as any)[method];

					operation.tags = ['Better Auth'];
				}
			}

			return reference;
		}) as Promise<any>,
	components: getSchema().then(({ components }) => components) as Promise<any>,
} as const;
