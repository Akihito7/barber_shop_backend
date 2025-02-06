import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAppoitmentDto {
  @IsString()
  userId: string;
  @IsString()
  barberId: string;
  @IsString()
  status: string;
  @IsString()
  serviceId: string;
  @IsString()
  hour: string;
  @IsDateString()
  date: Date;
  @IsString()
  methodPayment: string;
  @IsString()
  @IsOptional()
  cardType: string;
  @IsString()
  @IsOptional()
  cardNumber: number;
  @IsString()
  @IsOptional()
  cardExpiry: string;
  @IsString()
  @IsOptional()
  cvc: number;
}
