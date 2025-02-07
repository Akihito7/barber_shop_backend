export class IGetAppointmentByClientId {
  id: number;
  userId: number;
  barberId: number;
  startTime: Date;
  endTime: Date;
  statusId : any;
  createdAt: Date;
  updatedAt: Date;
  serviceId: number;
  paymentMethod: string;
  name: string;
  description: string;
  price: string;
  duration: number;
}
