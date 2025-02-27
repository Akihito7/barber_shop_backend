import { IsOptional, IsString } from 'class-validator';

export class IUpdateBarberShop {
  @IsString()
  name: string;
  @IsString()
  address: string;
  @IsString()
  phone: string;
  @IsString()
  openingHours: string;
  @IsString()
  closingHours: string;
  @IsString()
  @IsOptional()
  description: string;
}
