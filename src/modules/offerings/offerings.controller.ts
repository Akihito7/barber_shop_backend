import { Controller, Get } from '@nestjs/common';
import { OfferingsService } from './offerings.service';
import { GetServicesResposeDto } from './dtos/response/get-services-response-dto';

@Controller('offerings')
export class OfferingsController {
  constructor(private readonly offeringsService: OfferingsService) {}

  @Get()
  async getServices(): Promise<GetServicesResposeDto[]> {
    return this.offeringsService.getServices();
  }
}
