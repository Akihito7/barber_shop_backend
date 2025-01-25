import {
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

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signup(data: SignupRequestDto) {
    const usernameExists =
      await this.authenticationRepository.getUserByUsername({
        username: data.username,
      });

    if (usernameExists) throw new ConflictException('Username already exists.');

    const emailExists = await this.authenticationRepository.getUserByEmail({
      email: data.email,
    });

    if (emailExists) throw new ConflictException('Email already exists.');

    const passwordHashed = await hash(data.password, 8);
    data.password = passwordHashed;

    await this.authenticationRepository.createUser(data);
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
}
