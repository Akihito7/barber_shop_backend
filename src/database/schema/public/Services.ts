// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.services */
export type ServicesId = number & { __brand: 'ServicesId' };

/** Represents the table public.services */
export default interface ServicesTable {
  id: ColumnType<ServicesId, ServicesId | undefined, ServicesId>;

  name: ColumnType<string, string, string>;

  description: ColumnType<string | null, string | null, string | null>;

  price: ColumnType<string, string, string>;

  duration: ColumnType<number, number, number>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  updatedAt: ColumnType<Date, Date | string | undefined, Date | string>;
}

export type Services = Selectable<ServicesTable>;

export type NewServices = Insertable<ServicesTable>;

export type ServicesUpdate = Updateable<ServicesTable>;
