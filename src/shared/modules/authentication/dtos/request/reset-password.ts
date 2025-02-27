import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class IResetPassword {
  @IsEmail()
  email: string;
  @IsString()
  code: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 0,
    minNumbers: 0,
    minSymbols: 0,
    minUppercase: 0,
  })
  password: string;
}
