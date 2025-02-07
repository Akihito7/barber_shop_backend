import { Controller, Get } from '@nestjs/common';
import { ManagementBarberShopService } from './management-barber-shop.service';
import { IGetBarberShopDetailsResponse } from './dtos/response/get-barber-shop-details-response-dto';

@Controller('management-barber-shop')
export class ManagementBarberShopController {
  constructor(
    private readonly managementBarberShopService: ManagementBarberShopService,
  ) {}

  @Get()
  async getBarberShopDetails() : Promise<IGetBarberShopDetailsResponse> {
    return this.managementBarberShopService.getBarberShopDetails();
  }
}
