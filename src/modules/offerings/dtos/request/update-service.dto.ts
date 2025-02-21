import { IsNumber, IsString } from "class-validator";

export class UpdateServiceDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  price: string;

  @IsNumber()
  duration: number;
}
