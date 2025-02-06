import { IsDateString, IsString } from 'class-validator';

export class ICreateAppointmentWithStripe {
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
  paymentMethodToken: string;
}
