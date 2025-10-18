# Documento de Requisitos Funcionais – Aplicação Mapa Seguro

## 1. Cadastro & Login

### 1.1 Fluxo de Login

- [x] Campos obrigatórios: Email/Nome de Usuário, Senha.
- [x] Regras:
  - [x] Se campos não preenchidos → 'Preencha todos os campos obrigatórios.'
  - [x] Se dados inválidos → 'Credenciais inválidas.'
  - [x] Se login bem-sucedido → 'Login efetuado com sucesso.'

### 1.2 Fluxo de Criação de Conta

- [x] Campos obrigatórios: Nome, Email, Telefone, Senha, Confirmar Senha.
- [x] Validações:
  - [x] Email válido.
  - [x] Telefone apenas dígitos.
  - [x] Senha forte (8+ caracteres, maiúscula, minúscula, número, caractere especial).
  - [x] Confirmar Senha igual a Senha.
- [x] Mensagens: Erro específico ou 'Conta criada com sucesso.'

### 1.3 Confirmação de Conta

- [x] Campo para inserir código enviado por email/telefone.
- [x] Regras:
  - [x] Código válido dentro do prazo.
  - [x] Código inválido → 'Código inválido ou expirado.'
  - [x] Código correto → 'Conta confirmada com sucesso.'
  - [x] Expirado → opção 'Reenviar código'.

### Cadastro & Login

- [ ] Usuária só acessa após validação de código.
- [ ] Emails/telefones inválidos bloqueiam cadastro.
- [ ] Senhas não coincidentes impedem criação.

### 1. Recuperação de Senha

- [ ] Fluxo para quando a usuária esquecer a senha.
- [ ] Envio de código por email/telefone para redefinição.

### 2. Gestão de Perfil da Usuária

- [ ] Editar dados pessoais (nome, telefone, email).
- [ ] Alterar senha.
- [ ] Excluir conta.

## 3. Criar Zona Segura

- [x] Campos obrigatórios: Localização (GPS/manual), Data, Hora, Descrição.
- [x] Checkbox:
  - [x] Boa iluminação
  - [x] Presença policial
  - [x] Transporte público
- [ ] Upload de fotos/vídeos (opcional).
- [x] Ações: Guardar (salva), Fechar (cancela).

---

## 4. Criar Zona de Perigo

- [x] Campos obrigatórios: Localização (GPS/manual), Data, Hora, Descrição.
- [x] Checkbox:
  - [x] Iluminação insuficiente
  - [x] Falta de policiamento
  - [x] Casas abandonadas
- [] Upload de fotos/vídeos (opcional).
- [x] Ações: Guardar (salva), Fechar (cancela).

---

### Zonas

- [x] Campos obrigatórios preenchidos.
- [x] Localização, data e hora válidos.
- [x] Zona exibida no mapa imediatamente.
- [x] RN05 – Áreas críticas são geradas com ≥10 relatos.
- [ ] O mapa deve carregar em até 10 segundos.
- [x] 10+ usuárias → Área marcada como Crítica.

---

### 3. Gestão das Zonas

- [ ] Usuária pode editar ou excluir uma zona que ela mesma criou.
- [ ] Definir como tratar inconsistências (ex: várias usuárias marcam locais diferentes no mesmo ponto).

## 2. Mapa com Localização Atual

- [ ] Mapa abre centralizado na localização atual.
- [ ] Exibe:
  - [ ] Zonas Seguras (azul).
  - [ ] Zonas de Perigo (vermelho).
  - [ ] Áreas Críticas (10+ relatos, vermelho forte).
- [ ] Se usuária próxima de área de perigo/crítica → notificação em tempo real.
- [ ] Sempre centralizado na localização atual.
- [ ] Exibe ícones diferentes para zonas.
- [ ] Notificação em tempo real em zonas perigosas.
- [ ] O mapa deve carregar em até 10 segundos.

---

## 6. Comunidade de Apoio & Disparo de Alertas

### 6.1 Adicionar Contato

- [x] Campos: Nome, Número, Tipo (Família, Amigo, Trabalho).
- [x] Validações: número único.
- [x] Opções: Guardar, Fechar.
- [x] Mensagem: 'Contato adicionado com sucesso.'

### 6.2 Criar Grupo

- [x] Campos: Nome, Participantes (números).
- [x] Permitir múltiplos participantes.
- [x] Validação: participantes devem estar cadastrados ou novos números.
- [x] Mensagem: 'Grupo criado com sucesso.'

### Comunidade de Apoio

- [x] Contatos duplicados não permitidos.
- [x] Grupos com múltiplos participantes.
- [x] Usuária pode editar ou excluir contatos e grupos.
- [ ] RN03 – Contatos e grupos podem ser editados/excluídos.

=====================================================================================

### 6.3 Disparo de Alertas

- [ ] Alerta Individual: Enviado para contatos e grupos.
- [ ] Alerta Coletivo (10+ relatos): dispara alerta para todos os contatos/grupos.
- [ ] Notificações: via push e SMS, com local + risco + data/hora.

## 5. Alerta Coletivo

- [ ] 10+ usuárias → Área marcada como Crítica.
- [ ] Ícone diferenciado no mapa.
- [ ] Notificação enviada para usuárias próximas.
- [ ] Alerta individual notifica todos os contatos e grupos.
- [ ] 10+ relatos → Área Crítica e notificação em tempo real.

## 7. Regras de Negócio

- [ ] RN01 – Apenas contatos confirmados recebem alertas.
- [ ] RN02 – Apenas usuárias cadastradas podem disparar alertas.
- [ ] RN04 – Cada alerta é registrado e vinculado ao mapa.

### 4. Configurações de Notificações

- [ ] Ativar/desativar tipos de alerta (apenas zonas críticas, todos os alertas, apenas contatos diretos etc.).

### 5. Privacidade e Segurança

- [ ] Política clara sobre o que é compartilhado (ex: localização só é enviada em caso de alerta, nunca de forma contínua).
- [ ] Consentimento explícito no cadastro.

### 6. Logs / Histórico

- [ ] Usuária pode ver histórico de seus alertas disparados.
- [ ] Histórico de zonas visualizadas ou criadas.
- [ ] Notificações devem ser enviadas em até 10 segundos após disparo.
