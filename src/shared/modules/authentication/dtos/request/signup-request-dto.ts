import { IsEmail, IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class SignupRequestDto {
  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  role: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;

  @IsString()
  @IsOptional()
  photo: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  cpf: string;

  @IsString()
  @IsOptional()
  address: string;
}
