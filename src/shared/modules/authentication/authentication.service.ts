import { Injectable } from '@nestjs/common';
import { AuthenticationRepository } from './authentication.repository';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}
}
