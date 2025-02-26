
# Delivery App

Este é um projeto completo de agendamento e gerenciamento de entregas, composto por um back-end desenvolvido com NestJS (utilizando Prisma para ORM e Socket.IO para notificações e chat) e um front-end desenvolvido com Next.js, TypeScript e Chakra UI. O projeto integra funcionalidades como:

- **Agendamento de entregas:** Cadastro, listagem, filtragem (entregas pendentes, finalizadas, histórico).
- **Finalização de entregas:** Atualização de status via endpoint.
- **Notificações em tempo real:** Utilizando Socket.IO para notificar o front-end sempre que uma nova entrega é criada ou finalizada.
- **Chat de Suporte:** Um chat interativo com suporte a emojis, similar ao WhatsApp.
- **Dashboard com gráficos:** Gráficos de barras e de pizza para exibir informações resumidas sobre as entregas.

## Arquitetura do Projeto

### Back-End

- **Framework:** NestJS
- **Banco de Dados:** Prisma (exemplo com SQLite, mas pode ser configurado para outros SGBDs)
- **WebSockets:** Socket.IO (usando `@nestjs/platform-socket.io`)
- **Principais Módulos:**
  - **DeliveriesModule:** Controlador e serviço para criação, listagem, filtragem e finalização de entregas.
  - **NotificationsGateway:** Gateway para envio de notificações em tempo real.
  - **ChatGateway:** Gateway para gerenciamento de um chat de suporte.
- **Estrutura de Diretórios (Exemplo):**


backend/
├── src/
│ ├── app.module.ts
│ ├── main.ts
│ ├── prisma.service.ts
│ ├── deliveries/
│ │ ├── deliveries.controller.ts
│ │ ├── deliveries.module.ts
│ │ ├── deliveries.service.ts
│ │ └── dto/
│ │ └── create-delivery.dto.ts
│ ├── notifications-gateway/
│ │ └── notifications.gateway.ts
│ └── chat-gateway/
│ └── notifications-gatewaychat.gateway.ts
└── prisma/
└── schema.prisma



### Front-End
- **Framework:** Next.js (App Router)
- **Linguagem:** TypeScript
- **UI Library:** Chakra UI
- **Gráficos:** react-chartjs-2 e chart.js
- **Chat e Emojis:** Socket.IO Client, emoji-mart
- **Funcionalidades:**
- Sidebar fixa com links para Dashboard, Agendar, Histórico, Entregas Finalizadas e Entregas Pendentes.
- Dashboard com gráficos (barras e pizza) exibindo estatísticas de entregas.
- Modal de Chat de Suporte interativo, com opção para selecionar emojis e enviar mensagens.
- **Estrutura de Diretórios (Exemplo):**


front/
├── .env.local
├── next.config.js
├── package.json
├── tsconfig.json
└── app/
├── layout.tsx // Layout raiz com Sidebar fixa e ChatSupport
├── page.tsx // Dashboard: lista todas as entregas e gráficos
├── schedule/
│ └── page.tsx // Página para agendar nova entrega
├── history/
│ └── page.tsx // Página para histórico de agendamento
├── completed/
│ └── page.tsx // Página para entregas finalizadas
├── pending/
│ └── page.tsx // Página para entregas pendentes
└── components/
├── DeliveryCard.tsx
├── Sidebar.tsx // Sidebar com links e alternância de tema
├── DeliveryChart.tsx // Gráficos de barras e pizza
└── ChatSupport.tsx // Chat interativo com modal, emojis e campo de texto



## Tecnologias Utilizadas

- **Back-End:**
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [Socket.IO](https://socket.io/)
- **Front-End:**
- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [react-chartjs-2](https://react-chartjs-2.js.org/)
- [chart.js](https://www.chartjs.org/)
- [emoji-mart](https://github.com/missive/emoji-mart)
- [socket.io-client](https://socket.io/docs/v4/client-api/)

## Instalação e Execução

### Back-End

1. **Acesse o diretório do back-end:**
 ```bash
 cd backend
````

2. **Instale as dependências:**
   ```bash
   npm install
   npm install @nestjs/platform-socket.io socket.io
   ```
3. **Configure o Prisma:**
   - Atualize o arquivo `prisma/schema.prisma` conforme necessário.
   - Execute as migrações:
     ```bash
     npx prisma migrate dev --name init
     npx prisma generate
     ```
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run start:dev
   ```

### Front-End

1. **Acesse o diretório do front-end:**
   ```bash
   cd front
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   npm install socket.io-client react-chartjs-2 chart.js emoji-mart react-icons
   ```
3. **Configure as variáveis de ambiente:**
   - Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
     ```env
     REACT_APP_API_URL=http://localhost:3001
     ```
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

## Uso

- **Dashboard:**  
  Ao acessar a aplicação, a página inicial exibirá o dashboard com gráficos (barras e pizza) que mostram as estatísticas das entregas.

- **Sidebar:**  
  A sidebar fixa à esquerda contém links para:

  - Dashboard
  - Agendar nova entrega
  - Histórico de agendamento
  - Entregas finalizadas
  - Entregas pendentes  
    A sidebar também possui um botão de alternância de tema.

- **Agendamento:**  
  Na página de agendamento, o usuário pode cadastrar uma nova entrega. Após o cadastro, o back-end define o status da entrega como "PENDING".

- **Notificações:**  
  Sempre que uma nova entrega é criada ou o status de uma entrega é alterado, o back-end envia uma notificação via WebSocket para o front-end.

- **Chat de Suporte:**  
  O botão de chat (com ícone de chat e o texto "Chat") é exibido no canto superior direito. Ao clicar nele, um modal é aberto onde o usuário pode:
  - Visualizar as mensagens trocadas.
  - Enviar novas mensagens.
  - Utilizar o seletor de emojis para inserir emojis na mensagem.
  - Enviar mensagens pressionando o botão "Enviar" ou a tecla Enter.

## Observações

- **Socket.IO:**  
  Certifique-se de que o servidor Socket.IO no back-end esteja rodando e configurado para o namespace `/chat`.
- **Variáveis de Ambiente:**  
  As variáveis de ambiente devem ser configuradas corretamente. Em Create React App, as variáveis devem começar com `REACT_APP_`.
- **Estilização:**  
  O Chakra UI é utilizado para criar uma interface responsiva e personalizável. Você pode ajustar o tema e os estilos conforme necessário.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença

Este projeto está licenciado sob a [MIT License](LICENSE).

```javascript
Este README.md é um exemplo completo para você copiar, colar e utilizar no seu projeto. Ele resume a arquitetura, as funcionalidades e as instruções de instalação e execução tanto do back-end quanto do front-end.
```
