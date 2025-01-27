import { IsDateString, IsString } from 'class-validator';

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
}
