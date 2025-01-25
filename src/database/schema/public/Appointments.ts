// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { UsersId } from './Users';
import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.appointments */
export type AppointmentsId = number & { __brand: 'AppointmentsId' };

/** Represents the table public.appointments */
export default interface AppointmentsTable {
  id: ColumnType<AppointmentsId, AppointmentsId | undefined, AppointmentsId>;

  userId: ColumnType<UsersId, UsersId, UsersId>;

  barberId: ColumnType<UsersId, UsersId, UsersId>;

  startTime: ColumnType<Date, Date | string, Date | string>;

  endTime: ColumnType<Date, Date | string, Date | string>;

  status: ColumnType<string, string, string>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Appointments = Selectable<AppointmentsTable>;

export type NewAppointments = Insertable<AppointmentsTable>;

export type AppointmentsUpdate = Updateable<AppointmentsTable>;
