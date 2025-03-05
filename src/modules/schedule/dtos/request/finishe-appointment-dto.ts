import { IsNumber, IsString } from 'class-validator';

export class FinishAppointment {
  @IsNumber()
  appointmentId: number;
  @IsNumber()
  serviceId: number;
}
