/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' }, transports: ['websocket'] })
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(server: Server) {
    console.log('Notifications WebSocket Initialized');
  }

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  sendNewDeliveryNotification(delivery: any) {
    this.server.emit('newDelivery', delivery);
  }
}
