import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { OfferingsService } from './offerings.service';
import { GetServicesResposeDto } from './dtos/response/get-services-response-dto';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('offerings')
@UseGuards(AuthGuard)
export class OfferingsController {
  constructor(private readonly offeringsService: OfferingsService) {}

  @Get()
  async getServices(): Promise<GetServicesResposeDto[]> {
    return this.offeringsService.getServices();
  }

  @Get('/:id')
  async getServiceDetails(@Param('id') id) {
    return this.offeringsService.getServiceDetails({ id });
  }
}
