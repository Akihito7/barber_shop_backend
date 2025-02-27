import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticationRepository } from './authentication.repository';
import { SignupRequestDto } from './dtos/request/signup-request-dto';
import { compare, hash } from 'bcrypt';
import { SignlnRequestDto } from './dtos/request/signln-request.dto';
import { JwtService } from '@nestjs/jwt';
import { SignlnResponseDto } from './dtos/response/signln-response-dto';
import { NotificationService } from '../notifications/notification.service';
import { IResendCodeEmail } from './dtos/request/resend-code-email.dto';
import { IResetPassword } from './dtos/request/reset-password';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly jwtService: JwtService,
    private readonly notication: NotificationService,
  ) {}

  async signup(data: SignupRequestDto) {
    const usernameExists =
      await this.authenticationRepository.getUserByUsername({
        username: data.username,
      });

    if (usernameExists && usernameExists.isAccountActive === false) {
      await this.authenticationRepository.deleteUser(usernameExists.id);
    }

    if (usernameExists && usernameExists.isAccountActive === true)
      throw new ConflictException('Username already exists.');

    const emailExists = await this.authenticationRepository.getUserByEmail({
      email: data.email,
    });

    if (emailExists && emailExists.isAccountActive === false) {
      await this.authenticationRepository.deleteUser(emailExists.id);
    }

    if (emailExists && emailExists.isAccountActive === true)
      throw new ConflictException('Email already exists.');

    const passwordHashed = await hash(data.password, 8);
    data.password = passwordHashed;

    await this.authenticationRepository.createUser(data);

    const code = this.generateCode();
    await this.notication.createEmailCodeVerification({
      email: data.email,
      code,
    });
    await this.notication.sendEmailVerification({ code, email: data.email });
  }

  async signln(data: SignlnRequestDto): Promise<SignlnResponseDto> {
    const user = await this.authenticationRepository.getUserByEmail({
      email: data.email,
    });

    if (!user)
      throw new UnauthorizedException('Email and/or password incorret.');

    const passwordMatched = await compare(data.password, user.password);

    if (!passwordMatched)
      throw new UnauthorizedException('Email and/or password incorret.');

    const token = this.jwtService.sign(
      {},
      {
        subject: user.id.toString(),
      },
    );
    return {
      token,
    };
  }

  async verifyToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }
  }

  async validateToken(token: string) {
    try {
      await this.verifyToken(token);
      return {
        isValidToken: true,
      };
    } catch (error) {
      return {
        isValidToken: false,
      };
    }
  }

  generateCode(): string {
    const code = Math.floor(100000 + Math.random() * 900000)
      .toString()
      .padStart(6, '0');
    return code;
  }

  async accountActivation({ email, code }) {
    const hasCode =
      await this.authenticationRepository.getCodeEmailVerification({
        email,
        code,
      });

    if (!hasCode) {
      throw new BadRequestException('Código expirado ou inválido.');
    }
    const currentDate = new Date();
    if (currentDate > hasCode.expirationAt) {
      await this.authenticationRepository.deleteCodeEmailVerification(code);
      throw new BadRequestException('Código expirado ou inválido.');
    }

    await this.authenticationRepository.accountActivation(email);
    await this.authenticationRepository.deleteCodeEmailVerification(code);
  }

  async resendCodeEmail({ email }: IResendCodeEmail) {
    const code = this.generateCode();
    await this.notication.createEmailCodeVerification({
      email,
      code,
    });
    await this.notication.sendEmailVerification({ code, email });
  }

  async sendCodeChangePasswordToEmail({ email }: any) {
    const code = this.generateCode();
    await this.saveCodeChangePassword({
      email,
      code,
    });
    await this.notication.sendEmailToChangePassword({
      email,
      code,
    });
  }

  async saveCodeChangePassword({ email, code }: any) {
    await this.authenticationRepository.saveCodeChangePassword({
      email,
      code,
    });
  }

  async resetPassword({ email, code, password }: IResetPassword) {
    const hasCode =
      await this.authenticationRepository.getCodeChangePassword(code);
      console.log('its me code', code)
    if (!hasCode) {
      throw new BadRequestException('Código expirado ou inválido.');
    }
    const currentDate = new Date();
    if (currentDate > hasCode.expirationAt) {
      //deletar o codigo
      throw new BadRequestException('Código expirado ou inválido.');
    }
    const hashPassword = await bcrypt.hash(password, 8);
    await this.authenticationRepository.deleteCodeChangePassword(code)
    await this.authenticationRepository.resetPassword({
      email,
      password: hashPassword,
    });
  }
}
