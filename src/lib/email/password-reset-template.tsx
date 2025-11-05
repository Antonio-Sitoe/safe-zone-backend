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
} from '@react-email/components'

interface PasswordResetEmailProps {
  resetUrl: string
  userEmail: string
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
        <Body
          style={{
            backgroundColor: '#f9fafb',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <Container
            style={{
              margin: '0 auto',
              padding: '32px 16px',
              maxWidth: '600px',
            }}
          >
            {/* Header */}
            <Section
              style={{
                backgroundColor: '#1e293b',
                color: '#ffffff',
                padding: '32px',
                textAlign: 'center',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#2563eb',
                  borderRadius: '50%',
                  margin: '0 auto 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg
                  width="24"
                  height="24"
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
              <Heading
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                  margin: '0 0 8px 0',
                }}
              >
                🛡️ Safe Zone
              </Heading>
              <Text style={{ color: '#cbd5e1', margin: '0' }}>
                Redefinir Senha
              </Text>
            </Section>

            {/* Main Content */}
            <Section
              style={{
                backgroundColor: '#ffffff',
                padding: '32px',
                borderBottomLeftRadius: '8px',
                borderBottomRightRadius: '8px',
                borderLeft: '1px solid #e5e7eb',
                borderRight: '1px solid #e5e7eb',
                borderBottom: '1px solid #e5e7eb',
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Heading
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: '#1e293b',
                    marginBottom: '16px',
                    margin: '0 0 16px 0',
                  }}
                >
                  Você solicitou a redefinição de senha
                </Heading>
                <Text
                  style={{
                    color: '#475569',
                    marginBottom: '24px',
                    margin: '0 0 24px 0',
                  }}
                >
                  Clique no botão abaixo para criar uma nova senha para sua
                  conta. Este link expira em 1 hora.
                </Text>
              </div>

              {/* Reset Button */}
              <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
                <Button
                  href={resetUrl}
                  style={{
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: '600',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  Redefinir Senha
                </Button>
              </Section>

              {/* Info Box */}
              <Section
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '32px',
                }}
              >
                <Text
                  style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    margin: '0 0 12px 0',
                  }}
                >
                  <strong>Observações importantes:</strong>
                </Text>
                <ul
                  style={{
                    fontSize: '14px',
                    color: '#1e293b',
                    margin: '0',
                    paddingLeft: '20px',
                    listStyleType: 'disc',
                  }}
                >
                  <li style={{ marginBottom: '8px' }}>
                    Este link é válido por apenas <strong>1 hora</strong>
                  </li>
                  <li style={{ marginBottom: '8px' }}>
                    Se você não solicitou esta redefinição, ignore este email
                  </li>
                  <li style={{ marginBottom: '0' }}>
                    Nunca compartilhe este link com outras pessoas
                  </li>
                </ul>
              </Section>

              {/* Alternative Link */}
              <Section
                style={{
                  backgroundColor: '#f1f5f9',
                  borderRadius: '8px',
                  padding: '24px',
                  marginBottom: '32px',
                }}
              >
                <Text
                  style={{
                    fontSize: '12px',
                    color: '#475569',
                    margin: '0 0 8px 0',
                  }}
                >
                  Se o botão não funcionar, copie e cole este link no seu
                  navegador:
                </Text>
                <Text
                  style={{
                    fontSize: '12px',
                    color: '#2563eb',
                    wordBreak: 'break-all',
                    margin: '0',
                  }}
                >
                  {resetUrl}
                </Text>
              </Section>

              <div
                style={{
                  textAlign: 'center',
                  fontSize: '14px',
                  color: '#475569',
                  marginBottom: '32px',
                }}
              >
                <Text style={{ margin: '0' }}>
                  Email: <strong>{userEmail}</strong>
                </Text>
              </div>
            </Section>

            {/* Footer */}
            <Section
              style={{
                backgroundColor: '#f1f5f9',
                padding: '32px',
                textAlign: 'center',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                marginTop: '16px',
              }}
            >
              <div style={{ color: '#475569', fontSize: '14px' }}>
                <Text
                  style={{
                    fontWeight: '500',
                    margin: '0 0 8px 0',
                  }}
                >
                  Safe Zone - Mapa Seguro
                </Text>
                <Text style={{ margin: '0' }}>
                  Este é um email automático, não responda a esta mensagem.
                </Text>
              </div>

              <div
                style={{
                  marginTop: '24px',
                  paddingTop: '16px',
                  borderTop: '1px solid #cbd5e1',
                }}
              >
                <Text
                  style={{
                    fontSize: '12px',
                    color: '#64748b',
                    margin: '0',
                  }}
                >
                  © {new Date().getFullYear()} Safe Zone. Todos os direitos
                  reservados.
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
