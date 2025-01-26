import { IsString } from 'class-validator';

export class GetAppointmentsByDayRequestDto {
  @IsString()
  date: string;

  @IsString()
  serviceId: string;
}
