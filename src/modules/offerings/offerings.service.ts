import { Injectable } from '@nestjs/common';
import { OfferingsRepository } from './offerings.repository';
import { GetServicesResposeDto } from './dtos/response/get-services-response-dto';
import { CreateServiceDto } from './dtos/request/create-service-dto';
import { UpdateServiceDto } from './dtos/request/update-service.dto';

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

  async updateService({
    serviceId,
    data,
  }: {
    serviceId: string;
    data: UpdateServiceDto;
  }) {
    return this.offeringsRepository.updateService({
      serviceId,
      data,
    });
  }

  async deleteService({ serviceId }: { serviceId: any }): Promise<void> {
    await this.offeringsRepository.deleteService({ serviceId });
  }
}
