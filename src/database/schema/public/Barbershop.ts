// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.barbershop */
export type BarbershopId = number & { __brand: 'BarbershopId' };

/** Represents the table public.barbershop */
export default interface BarbershopTable {
  id: ColumnType<BarbershopId, BarbershopId | undefined, BarbershopId>;

  name: ColumnType<string, string, string>;

  address: ColumnType<string, string, string>;

  phone: ColumnType<string | null, string | null, string | null>;

  openingHours: ColumnType<Date, Date | string, Date | string>;

  closingHours: ColumnType<Date, Date | string, Date | string>;

  workingDays: ColumnType<string, string, string>;

  description: ColumnType<string | null, string | null, string | null>;
}

export type Barbershop = Selectable<BarbershopTable>;

export type NewBarbershop = Insertable<BarbershopTable>;

export type BarbershopUpdate = Updateable<BarbershopTable>;
