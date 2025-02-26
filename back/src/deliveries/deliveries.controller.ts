import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { DeliveriesService } from './deliveries.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Controller('deliveries')
export class DeliveriesController {
  constructor(private readonly deliveriesService: DeliveriesService) {}

  @Post()
  async create(@Body() createDeliveryDto: CreateDeliveryDto) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const delivery = await this.deliveriesService.create(createDeliveryDto);
    // Aqui você pode emitir uma notificação via WebSocket (veja o NotificationsGateway)
    return delivery;
  }

  @Get()
  async findAll(@Query('status') status?: string) {
    if (status === 'COMPLETED' || status === 'PENDING') {
      return await this.deliveriesService.findByStatus(status);
    }
    return await this.deliveriesService.findAll();
  }

  @Get('history')
  async findHistory() {
    return await this.deliveriesService.findHistory();
  }

  @Patch(':id/finalize')
  async finalizeDelivery(@Param('id') id: string) {
    return await this.deliveriesService.finalizeDelivery(Number(id));
  }
}
