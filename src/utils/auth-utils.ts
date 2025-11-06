export function extractTokenFromHeaders(
	headers:
		| Headers
		| Record<string, string | undefined>
		| { authorization?: string; Authorization?: string },
): string | null {
	let authorization: string | null = null;

	if (headers instanceof Headers) {
		authorization =
			headers.get('authorization') || headers.get('Authorization');
	} else {
		authorization =
			(headers as Record<string, string | undefined>).authorization ||
			(headers as Record<string, string | undefined>).Authorization ||
			(headers as Record<string, string | undefined>)['authorization'] ||
			(headers as Record<string, string | undefined>)['Authorization'] ||
			null;
	}

	if (!authorization) {
		return null;
	}

	if (
		typeof authorization === 'string' &&
		authorization.startsWith('Bearer ')
	) {
		return authorization.replace('Bearer ', '').trim();
	}

	return typeof authorization === 'string' ? authorization.trim() : null;
}
