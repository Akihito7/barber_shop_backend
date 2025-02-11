import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignupRequestDto } from './dtos/request/signup-request-dto';
import { SignlnRequestDto } from './dtos/request/signln-request.dto';
import { SignlnResponseDto } from './dtos/response/signln-response-dto';
import { IAccountActivition } from './dtos/request/account-activation';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() body: SignupRequestDto) {
    return this.authenticationService.signup(body);
  }

  @Post('signln')
  async signln(@Body() body: SignlnRequestDto): Promise<SignlnResponseDto> {
    return this.authenticationService.signln(body);
  }

  @Get('validate-token')
  async validateToken(@Query() query) {
    return this.authenticationService.validateToken(query.token);
  }

  @Get('account-activation')
  async accountActivation(@Query() query) {
    return this.authenticationService.accountActivation({
      email: query.email,
      code: query.code,
    });
  }

  @Get('resend-code-email')
  async resendCodeEmail(@Query() query) {
    return this.authenticationService.resendCodeEmail({
      email: query.email,
    });
  }
}
