import { Module } from '@nestjs/common';
import { ManagementBarberShopController } from './management-barber-shop.controller';
import { ManagementBarberShopService } from './management-barber-shop.service';
import { ManagementBarberShopRepository } from './management-barber-shop.repository';

@Module({
  imports: [],
  controllers: [ManagementBarberShopController],
  providers: [ManagementBarberShopService, ManagementBarberShopRepository],
})
export class ManagementBarberShopModule {}
