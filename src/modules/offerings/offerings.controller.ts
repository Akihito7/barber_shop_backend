import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OfferingsService } from './offerings.service';
import { GetServicesResposeDto } from './dtos/response/get-services-response-dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateServiceDto } from './dtos/request/create-service-dto';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles-decorator';
import Stripe from 'stripe';
import { ConfigService } from '@nestjs/config';
import { UpdateServiceDto } from './dtos/request/update-service.dto';
import { IUpdateBarberShop } from './dtos/request/update-barber-dto';

@Controller('offerings')
@UseGuards(AuthGuard)
export class OfferingsController {
  private stripe: Stripe;
  constructor(
    private readonly offeringsService: OfferingsService,
    private readonly configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_KEY'), {
      apiVersion: '2025-01-27.acacia',
    });
  }

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

  @Post('create-payment')
  async createPayment({}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: 2000,
        currency: 'BRL',
        payment_method_types: ['card'],
      });
      return paymentIntent.client_secret;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  @Put('update/:id')
  async updatedService(@Param('id') serviceId, @Body() body: UpdateServiceDto) {
    return this.offeringsService.updateService({
      serviceId,
      data: body,
    });
  }

  @Delete('delete/:id')
  @HttpCode(204)
  async deleteService(@Param('id') serviceId): Promise<void> {
    return this.offeringsService.deleteService({ serviceId });
  }

  @Put('barber-shop/update')
  @HttpCode(204)
  async updateBarberShop(@Body() body: IUpdateBarberShop) {
    return this.offeringsService.updateBarberShop(body);
  }
  //mudar para o module barber
}
