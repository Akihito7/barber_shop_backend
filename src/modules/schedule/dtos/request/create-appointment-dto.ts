import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAppoitmentDto {
  @IsString()
  userId: string;
  @IsString()
  barberId: string;
  @IsNumber()
  status: IStatus;
  @IsString()
  serviceId: string;
  @IsString()
  hour: string;
  @IsDateString()
  date: Date;
  @IsNumber()
  methodPayment: number;
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

type IStatus = 1 | 2 | 3 | 4;
//1 - Agendado
//2 - Em Andamento
//3 - Finalizado
//4 - Cancelado
