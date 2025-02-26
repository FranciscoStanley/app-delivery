import { IsString, IsDateString } from 'class-validator';

export class CreateDeliveryDto {
  @IsString()
  customer: string;

  @IsString()
  address: string;

  @IsDateString()
  scheduledAt: string; // geralmente em formato ISO
}
