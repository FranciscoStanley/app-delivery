import { Module } from '@nestjs/common';
import { DeliveriesModule } from './deliveries/deliveries.module';
import { NotificationsGateway } from './notifications-gateway/notifications.gateway';
import { ChatGateway } from './chat-gateway/chat.gateway';
import { PrismaService } from './prisma.service';

@Module({
  imports: [DeliveriesModule],
  providers: [PrismaService, NotificationsGateway, ChatGateway],
})
export class AppModule {}
