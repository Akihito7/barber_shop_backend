// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.password_reset */
export type PasswordResetId = number & { __brand: 'PasswordResetId' };

/** Represents the table public.password_reset */
export default interface PasswordResetTable {
  id: ColumnType<PasswordResetId, PasswordResetId | undefined, PasswordResetId>;

  email: ColumnType<string, string, string>;

  code: ColumnType<string, string, string>;

  createdAt: ColumnType<Date, Date | string | undefined, Date | string>;

  expirationAt: ColumnType<Date, Date | string, Date | string>;
}

export type PasswordReset = Selectable<PasswordResetTable>;

export type NewPasswordReset = Insertable<PasswordResetTable>;

export type PasswordResetUpdate = Updateable<PasswordResetTable>;
