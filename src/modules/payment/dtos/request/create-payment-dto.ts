import { IsDateString, IsNumber, IsString } from 'class-validator';

export class ICreatePayment {
  @IsNumber()
  appointmentId: number;

  @IsString()
  amount: string;

  @IsString()
  @IsDateString()
  paymentDate: string | Date;

  @IsString()
  paymentMethod: string;

  @IsString()
  paymentStatus: string;
}
