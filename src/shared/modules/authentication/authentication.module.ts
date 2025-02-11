import { Global, Module } from '@nestjs/common';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthenticationRepository } from './authentication.repository';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationModule } from '../notifications/notification.module';

@Global()
@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    NotificationModule
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthenticationRepository],
  exports: [AuthenticationRepository, AuthenticationService],
})
export class AuthenticationModule {}
