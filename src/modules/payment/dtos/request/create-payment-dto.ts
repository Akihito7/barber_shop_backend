import { IsDateString, IsNumber, IsString } from 'class-validator';

export class ICreatePayment {
  @IsNumber()
  appointmentId: number;

  @IsString()
  amount: string;

  @IsString()
  @IsDateString()
  paymentDate: string | Date;

  @IsNumber()
  paymentStatusId: number;

  @IsNumber()
  paymentMethodsId: number;
}
