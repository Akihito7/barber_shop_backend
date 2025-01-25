import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupRequestDto } from './dtos/request/signup-request-dto';
import { SignlnRequestDto } from './dtos/request/signln-request.dto';
import { SignlnResponseDto } from './dtos/response/signln-response-dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() body: SignupRequestDto) {
    return this.authenticationService.signup(body);
  }

  @Post('signln')
  async signln(@Body() body: SignlnRequestDto) : Promise<SignlnResponseDto>{
    return this.authenticationService.signln(body);
  }
}
