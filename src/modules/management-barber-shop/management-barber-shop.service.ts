import { Injectable } from '@nestjs/common';
import { ManagementBarberShopRepository } from './management-barber-shop.repository';

@Injectable()
export class ManagementBarberShopService {
  constructor(
    private readonly managementBarberShopRepository: ManagementBarberShopRepository,
  ) {}

  async getBarberShopDetails() {
    return this.managementBarberShopRepository.getBarberShopDetails();
  }
}
