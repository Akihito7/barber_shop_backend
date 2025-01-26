import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './shared/modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './shared/modules/authentication/authentication.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { OfferingsModule } from './modules/offerings/offerings.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthenticationModule,
    ScheduleModule,
    OfferingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
