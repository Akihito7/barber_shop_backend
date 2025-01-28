export interface GetAppointmentsByEmployeeResponse {
  id: number;
  userId: number;
  barberId: number;
  startTime: unknown; // ISO date string
  endTime: string; // ISO date string
  status: string;
  createdAt: string; // ISO date string
  updatedAt: string;
  serviceId: number;
  username: string;
  email: string;
  password: string;
  photo: string | null;
  phoneNumber: string;
  cpf: string | null;
  address: string | null;
  role: string;
  lastLogin: string | null;
  isActive: boolean;
  name: string;
  description: string;
  price: string;
  duration: number;
}
