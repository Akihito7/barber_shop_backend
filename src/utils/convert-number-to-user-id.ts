import { UsersId } from 'src/database/schema/public/Users';

export function convertNumberToUserId(userIdNumber: number): UsersId {
  return userIdNumber as UsersId;
}
