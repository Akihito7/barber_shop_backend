import { Module } from '@nestjs/common';
import { OfferingsController } from './offerings.controller';
import { OfferingsService } from './offerings.service';
import { OfferingsRepository } from './offerings.repository';

@Module({
  imports: [],
  controllers: [OfferingsController],
  providers: [OfferingsService, OfferingsRepository],
})
export class OfferingsModule {}
