import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateDeliveryDto } from './dto/create-delivery.dto';

@Injectable()
export class DeliveriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDeliveryDto: CreateDeliveryDto) {
    // Cria uma entrega com status padrão "PENDING"
    return await this.prisma.delivery.create({
      data: {
        ...createDeliveryDto,
        status: 'PENDING',
      },
    });
  }

  async findAll() {
    return await this.prisma.delivery.findMany();
  }

  async findByStatus(status: string) {
    return await this.prisma.delivery.findMany({
      where: { status },
    });
  }

  async findHistory() {
    // Exemplo: histórico de entregas finalizadas (status diferente de PENDING)
    return await this.prisma.delivery.findMany({
      where: { status: { not: 'PENDING' } },
    });
  }

  async finalizeDelivery(id: number) {
    // Atualiza o status da entrega para "COMPLETED"
    return await this.prisma.delivery.update({
      where: { id },
      data: { status: 'COMPLETED' },
    });
  }
}
