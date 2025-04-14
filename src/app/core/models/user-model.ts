import {UserRole} from './user-role-enum';

export interface UserModel {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}
