export interface ContactValidationResult {
	id: string;
	name: string;
	phone: string;
	valid: boolean;
	error?: string;
}

export interface AlertResult {
	sent: number;
	failed: number;
	contacts: Array<{
		id: string;
		name: string;
		phone: string;
		status: 'sent' | 'failed';
		error?: string;
	}>;
}
