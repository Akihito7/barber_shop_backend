import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { OfferingsRepository } from '../offerings/offerings.repository';
import { ICreateAppointmentWithStripe } from '../schedule/dtos/request/create-appointment-with-stripe-dto';
import { ICreatePayment } from './dtos/request/create-payment-dto';
import { PaymentRepository } from './payment.repository';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    private readonly configService: ConfigService,
    private readonly offeringsRepository: OfferingsRepository,
    private readonly paymentRepository: PaymentRepository,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_KEY'), {
      apiVersion: '2025-01-27.acacia',
    });
  }
  async generateIntentionPayment(data: ICreateAppointmentWithStripe) {
    const service = await this.offeringsRepository.getServiceDetails(
      data.serviceId,
    );
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Number(service.price) * 100,
      currency: 'BRL',
      payment_method_types: ['card'],
      payment_method: data.paymentMethodToken,
    });
    return paymentIntent;
  }

  async paymentWithStripe(data: ICreateAppointmentWithStripe) {
    const paymentIntetion = await this.generateIntentionPayment(data);
    const response = await this.stripe.paymentIntents.confirm(
      paymentIntetion.id,
    );
    if (response.status === 'succeeded') {
      console.log('Pagamento confirmado com sucesso!');
      return {
        ok: true,
      };
    }
    throw new Error('error ao tentar realizar o pagamento');
  }

  async createPayment(data: ICreatePayment) {
    return this.paymentRepository.createPayment(data);
  }

  async getPaymentByAppointmentId(appointmentId : any){
    return this.paymentRepository.getPaymentByAppointmentId(appointmentId)
  }
}
