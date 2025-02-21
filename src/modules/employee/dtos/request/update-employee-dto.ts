import { IsEmail, IsNumber, IsString, IsStrongPassword } from 'class-validator';

export class IUpdateEmployee {
  @IsString()
  id: number;
  @IsString()
  username: string;
  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;
  roles: string[];
  role: string;
  phoneNumber: number;
}
