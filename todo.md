# Documento de Requisitos Funcionais – Aplicação Mapa Seguro

**Versão:** 1.0

---

## 1. Cadastro & Login

### 1.1 Fluxo de Login

- [ ] Campos obrigatórios: Email/Nome de Usuário, Senha.
- [ ] Regras:
  - [ ] Se campos não preenchidos → 'Preencha todos os campos obrigatórios.'
  - [ ] Se dados inválidos → 'Credenciais inválidas.'
  - [ ] Se login bem-sucedido → 'Login efetuado com sucesso.'

### 1.2 Fluxo de Criação de Conta

- [ ] Campos obrigatórios: Nome, Email, Telefone, Senha, Confirmar Senha.
- [ ] Validações:
  - [ ] Email válido.
  - [ ] Telefone apenas dígitos.
  - [ ] Senha forte (8+ caracteres, maiúscula, minúscula, número, caractere especial).
  - [ ] Confirmar Senha igual a Senha.
- [ ] Mensagens: Erro específico ou 'Conta criada com sucesso.'

### 1.3 Confirmação de Conta

- [ ] Campo para inserir código enviado por email/telefone.
- [ ] Regras:
  - [ ] Código válido dentro do prazo.
  - [ ] Código inválido → 'Código inválido ou expirado.'
  - [ ] Código correto → 'Conta confirmada com sucesso.'
  - [ ] Expirado → opção 'Reenviar código'.

---

## 2. Mapa com Localização Atual

- [ ] Mapa abre centralizado na localização atual.
- [ ] Exibe:
  - [ ] Zonas Seguras (azul).
  - [ ] Zonas de Perigo (vermelho).
  - [ ] Áreas Críticas (10+ relatos, vermelho forte).
- [ ] Se usuária próxima de área de perigo/crítica → notificação em tempo real.

---

## 3. Criar Zona Segura

- [ ] Campos obrigatórios: Localização (GPS/manual), Data, Hora, Descrição.
- [ ] Checkbox:
  - [ ] Boa iluminação
  - [ ] Presença policial
  - [ ] Transporte público
- [ ] Upload de fotos/vídeos (opcional).
- [ ] Ações: Guardar (salva), Fechar (cancela).

---

## 4. Criar Zona de Perigo

- [ ] Campos obrigatórios: Localização (GPS/manual), Data, Hora, Descrição.
- [ ] Checkbox:
  - [ ] Iluminação insuficiente
  - [ ] Falta de policiamento
  - [ ] Casas abandonadas
- [ ] Upload de fotos/vídeos (opcional).
- [ ] Ações: Guardar (salva), Fechar (cancela).

---

## 5. Alerta Coletivo

- [ ] 10+ usuárias → Área marcada como Crítica.
- [ ] Ícone diferenciado no mapa.
- [ ] Notificação enviada para usuárias próximas.

---

## 6. Comunidade de Apoio & Disparo de Alertas

### 6.1 Adicionar Contato

- [ ] Campos: Nome, Número, Tipo (Família, Amigo, Trabalho).
- [ ] Validações: número único.
- [ ] Opções: Guardar, Fechar.
- [ ] Mensagem: 'Contato adicionado com sucesso.'

### 6.2 Criar Grupo

- [ ] Campos: Nome, Participantes (números).
- [ ] Permitir múltiplos participantes.
- [ ] Validação: participantes devem estar cadastrados ou novos números.
- [ ] Mensagem: 'Grupo criado com sucesso.'

### 6.3 Disparo de Alertas

- [ ] Alerta Individual: Enviado para contatos e grupos.
- [ ] Alerta Coletivo (10+ relatos): dispara alerta para todos os contatos/grupos.
- [ ] Notificações: via push e SMS, com local + risco + data/hora.

---

## 7. Regras de Negócio

- [ ] RN01 – Apenas contatos confirmados recebem alertas.
- [ ] RN02 – Apenas usuárias cadastradas podem disparar alertas.
- [ ] RN03 – Contatos e grupos podem ser editados/excluídos.
- [ ] RN04 – Cada alerta é registrado e vinculado ao mapa.
- [ ] RN05 – Áreas críticas são geradas com ≥10 relatos.

---

## 8. Critérios de Aceitação

### Cadastro & Login

- [ ] Usuária só acessa após validação de código.
- [ ] Emails/telefones inválidos bloqueiam cadastro.
- [ ] Senhas não coincidentes impedem criação.

### Mapa

- [ ] Sempre centralizado na localização atual.
- [ ] Exibe ícones diferentes para zonas.
- [ ] Notificação em tempo real em zonas perigosas.

### Zonas

- [ ] Campos obrigatórios preenchidos.
- [ ] Localização, data e hora válidos.
- [ ] Zona exibida no mapa imediatamente.

### Alertas

- [ ] Alerta individual notifica todos os contatos e grupos.
- [ ] 10+ relatos → Área Crítica e notificação em tempo real.

### Comunidade de Apoio

- [ ] Contatos duplicados não permitidos.
- [ ] Grupos com múltiplos participantes.
- [ ] Usuária pode editar ou excluir contatos e grupos.

---

## NB

### 1. Recuperação de Senha

- [ ] Fluxo para quando a usuária esquecer a senha.
- [ ] Envio de código por email/telefone para redefinição.

### 2. Gestão de Perfil da Usuária

- [ ] Editar dados pessoais (nome, telefone, email).
- [ ] Alterar senha.
- [ ] Excluir conta.

### 3. Gestão das Zonas

- [ ] Usuária pode editar ou excluir uma zona que ela mesma criou.
- [ ] Definir como tratar inconsistências (ex: várias usuárias marcam locais diferentes no mesmo ponto).

### 4. Configurações de Notificações

- [ ] Ativar/desativar tipos de alerta (apenas zonas críticas, todos os alertas, apenas contatos diretos etc.).

### 5. Privacidade e Segurança

- [ ] Política clara sobre o que é compartilhado (ex: localização só é enviada em caso de alerta, nunca de forma contínua).
- [ ] Consentimento explícito no cadastro.

### 6. Logs / Histórico

- [ ] Usuária pode ver histórico de seus alertas disparados.
- [ ] Histórico de zonas visualizadas ou criadas.

### 7. Critérios de Performance (para os devs)

- [ ] O mapa deve carregar em até 10 segundos.
- [ ] Notificações devem ser enviadas em até 10 segundos após disparo.
