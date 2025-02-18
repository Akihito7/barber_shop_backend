import { Injectable } from '@nestjs/common';
import { OfferingsRepository } from './offerings.repository';
import { GetServicesResposeDto } from './dtos/response/get-services-response-dto';
import { CreateServiceDto } from './dtos/request/create-service-dto';

@Injectable()
export class OfferingsService {
  constructor(private readonly offeringsRepository: OfferingsRepository) {}

  async getServices(): Promise<GetServicesResposeDto[]> {
    return this.offeringsRepository.getServices();
  }

  async getServiceDetails({ id }: { id: any }) {
    return this.offeringsRepository.getServiceDetails(id);
  }

  async createService({
    name,
    price,
    description,
    duration,
  }: CreateServiceDto) {
    return this.offeringsRepository.createService({
      name,
      price,
      description,
      duration,
    });
  }

  async deleteService({ serviceId }: { serviceId: any }): Promise<void> {
    await this.offeringsRepository.deleteService({ serviceId });
  }
}
