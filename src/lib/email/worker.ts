import { Worker } from 'bullmq';
import { emailConnection } from './config';
import { emailService } from './service';
import type { OTPEmailData } from './types';

const worker = new Worker(
	'emailQueue',
	async (job) => {
		try {
			const { email, otp, type } = job.data as OTPEmailData;
			await emailService.sendOTP({ email, otp, type });
		} catch (error) {
			console.error(`Erro ao enviar o e-mail para ${job.data.email}:`, error);
			throw error;
		}
	},
	{
		connection: emailConnection,
	},
);

worker.on('completed', (job) => {
	console.log(`Job ${job?.id} concluído com sucesso!`);
});

worker.on('failed', async (job, err) => {
	console.log(`Job ${job?.id} falhou com o erro:`, err);
});

console.log('Worker do BullMQ iniciado e aguardando jobs...');
