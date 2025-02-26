/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from '../prisma.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: 'chat' })
export class ChatGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly prisma: PrismaService) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody() message: { content: string; sender?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        content: message.content,
        sender: message.sender || client.id, // Usa o ID do cliente se o remetente não for fornecido
      },
    });
    this.server.emit('newMessage', chatMessage);
  }
}
