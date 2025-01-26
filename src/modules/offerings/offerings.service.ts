import { Injectable } from '@nestjs/common';
import { OfferingsRepository } from './offerings.repository';
import { GetServicesResposeDto } from './dtos/response/get-services-response-dto';

@Injectable()
export class OfferingsService {
  constructor(private readonly offeringsRepository: OfferingsRepository) {}

  async getServices(): Promise<GetServicesResposeDto[]> {
    return this.offeringsRepository.getServices();
  }
}
