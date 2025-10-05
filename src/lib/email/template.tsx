import {
	Body,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

interface EmailOTPTemplateProps {
	otpCode: string;
	type?: 'sign-in' | 'email-verification' | 'forget-password';
}

export function EmailOTPTemplate({
	otpCode,
	type = 'email-verification',
}: EmailOTPTemplateProps) {
	const getTitle = () => {
		switch (type) {
			case 'sign-in':
				return 'Código de Acesso';
			case 'email-verification':
				return 'Verificação de Email';
			case 'forget-password':
				return 'Redefinição de Senha';
			default:
				return 'Verificação de Email';
		}
	};

	const getDescription = () => {
		switch (type) {
			case 'sign-in':
				return 'Use o código abaixo para fazer login em sua conta';
			case 'email-verification':
				return 'Use o código abaixo para verificar seu endereço de email';
			case 'forget-password':
				return 'Use o código abaixo para redefinir sua senha';
			default:
				return 'Use o código abaixo para verificar sua conta';
		}
	};

	const previewText = `${getTitle()} - Safe Zone`;

	return (
		<Html>
			<Head />
			<Preview>{previewText}</Preview>
			<Tailwind>
				<Body className="bg-gray-50 font-sans">
					<Container className="mx-auto py-8 px-4 max-w-2xl">
						{/* Header */}
						<Section className="bg-slate-800 text-white p-8 text-center rounded-t-lg">
							<div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Ícone de segurança"
								>
									<title>Ícone de segurança</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
									/>
								</svg>
							</div>
							<Heading className="text-2xl font-bold mb-2 m-0">
								🛡️ Safe Zone
							</Heading>
							<Text className="text-slate-300 m-0">{getTitle()}</Text>
						</Section>

						{/* Main Content */}
						<Section className="bg-white p-8 rounded-b-lg border-x border-b border-gray-200">
							<div className="text-center mb-8">
								<Heading className="text-xl font-semibold text-slate-800 mb-4 m-0">
									{getDescription()}
								</Heading>
							</div>

							{/* OTP Code Box */}
							<Section className="bg-slate-50 border-2 border-blue-100 rounded-lg shadow-sm p-8 text-center mb-8">
								<Text className="text-sm text-slate-600 mb-3 font-medium m-0">
									SEU CÓDIGO DE VERIFICAÇÃO
								</Text>
								<div className="text-4xl font-bold text-slate-800 tracking-widest mb-3 font-mono">
									{otpCode}
								</div>
								<Text className="text-xs text-slate-500 m-0">
									Este código expira em 10 minutos
								</Text>
							</Section>

							<div className="text-center text-sm text-slate-600 mb-8">
								<Text className="m-0">
									Digite este código na página de confirmação para prosseguir.
								</Text>
							</div>
						</Section>

						{/* Footer */}
						<Section className="bg-slate-100 p-8 text-center border border-gray-200 rounded-lg mt-4">
							<div className="text-slate-600 text-sm">
								<Text className="font-medium m-0 mb-2">
									Safe Zone - Mapa Seguro
								</Text>
								<Text className="m-0">
									Este é um email automático, não responda a esta mensagem.
								</Text>
							</div>

							<div className="mt-6 pt-4 border-t border-slate-200">
								<Text className="text-xs text-slate-500 m-0">
									© {new Date().getFullYear()} Safe Zone. Todos os direitos
									reservados.
								</Text>
							</div>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}
