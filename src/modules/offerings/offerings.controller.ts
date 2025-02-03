import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { OfferingsService } from './offerings.service';
import { GetServicesResposeDto } from './dtos/response/get-services-response-dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateServiceDto } from './dtos/request/create-service-dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles-decorator';

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

  @Post('create')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async createService(@Body() body: CreateServiceDto) {
    return this.offeringsService.createService(body);
  }
}
