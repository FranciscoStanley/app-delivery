import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { DeliveriesService } from './deliveries.service';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [DeliveriesController],
  providers: [DeliveriesService, PrismaService],
})
export class DeliveriesModule {}
