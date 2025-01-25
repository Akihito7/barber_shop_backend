import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';

@Injectable()
export class AuthenticationRepository {
  constructor(
    @Inject('DATABASE_CONNECTION') private readonly db: Kysely<any>,
  ) {}
}
