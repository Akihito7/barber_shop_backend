import { IsDateString, IsNumber, IsString } from 'class-validator';

export class ICreateAppointmentWithStripe {
  @IsString()
  userId: string;
  @IsString()
  barberId: string;
  @IsNumber()
  status: number;
  @IsString()
  serviceId: string;
  @IsString()
  hour: string;
  @IsDateString()
  date: Date;
  @IsNumber()
  methodPayment: number;
  @IsString()
  paymentMethodToken: string;
}
