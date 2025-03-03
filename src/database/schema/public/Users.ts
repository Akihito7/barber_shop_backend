// @generated
// This file is automatically generated by Kanel. Do not modify manually.

import type { ColumnType, Selectable, Insertable, Updateable } from 'kysely';

/** Identifier type for public.users */
export type UsersId = number & { __brand: 'UsersId' };

/** Represents the table public.users */
export default interface UsersTable {
  id: ColumnType<UsersId, UsersId | undefined, UsersId>;

  email: ColumnType<string, string, string>;

  password: ColumnType<string, string, string>;

  photo: ColumnType<string | null, string | null, string | null>;

  phoneNumber: ColumnType<string | null, string | null, string | null>;

  cpf: ColumnType<string | null, string | null, string | null>;

  address: ColumnType<string | null, string | null, string | null>;

  role: ColumnType<string, string, string>;

  createdAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  updatedAt: ColumnType<Date | null, Date | string | null, Date | string | null>;

  lastLogin: ColumnType<Date | null, Date | string | null, Date | string | null>;

  isActive: ColumnType<boolean | null, boolean | null, boolean | null>;

  roles: ColumnType<string[] | null, string[] | null, string[] | null>;

  name: ColumnType<string, string | undefined, string>;

  isAccountActive: ColumnType<boolean, boolean | undefined, boolean>;

  username: ColumnType<string, string | undefined, string>;
}

export type Users = Selectable<UsersTable>;

export type NewUsers = Insertable<UsersTable>;

export type UsersUpdate = Updateable<UsersTable>;
