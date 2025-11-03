import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from '@react-email/components';

interface PasswordResetEmailProps {
	resetUrl: string;
	userEmail: string;
}

export function PasswordResetEmailTemplate({
	resetUrl,
	userEmail,
}: PasswordResetEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>Redefinir sua senha - Safe Zone</Preview>
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
							<Text className="text-slate-300 m-0">Redefinir Senha</Text>
						</Section>

						{/* Main Content */}
						<Section className="bg-white p-8 rounded-b-lg border-x border-b border-gray-200">
							<div className="text-center mb-8">
								<Heading className="text-xl font-semibold text-slate-800 mb-4 m-0">
									Você solicitou a redefinição de senha
								</Heading>
								<Text className="text-slate-600 mb-6 m-0">
									Clique no botão abaixo para criar uma nova senha para sua
									conta. Este link expira em 1 hora.
								</Text>
							</div>

							{/* Reset Button */}
							<Section className="text-center mb-8">
								<Button
									href={resetUrl}
									className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg no-underline inline-block"
								>
									Redefinir Senha
								</Button>
							</Section>

							{/* Info Box */}
							<Section className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
								<Text className="text-sm text-slate-700 m-0 mb-3">
									<strong>Observações importantes:</strong>
								</Text>
								<ul className="text-sm text-slate-700 m-0 pl-5 space-y-1">
									<li>
										Este link é válido por apenas <strong>1 hora</strong>
									</li>
									<li>
										Se você não solicitou esta redefinição, ignore este email
									</li>
									<li>Nunca compartilhe este link com outras pessoas</li>
								</ul>
							</Section>

							{/* Alternative Link */}
							<Section className="bg-slate-50 rounded-lg p-6 mb-8">
								<Text className="text-xs text-slate-600 m-0 mb-2">
									Se o botão não funcionar, copie e cole este link no seu
									navegador:
								</Text>
								<Text className="text-xs text-blue-600 break-all m-0">
									{resetUrl}
								</Text>
							</Section>

							<div className="text-center text-sm text-slate-600 mb-8">
								<Text className="m-0">
									Email: <strong>{userEmail}</strong>
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
