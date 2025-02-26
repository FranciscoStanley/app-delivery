import { IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateDeliveryDto {
  @IsOptional()
  @IsString()
  customer?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  scheduledAt?: string; // Utilize string para datas em formato ISO

  @IsOptional()
  @IsString()
  status?: string;
}
