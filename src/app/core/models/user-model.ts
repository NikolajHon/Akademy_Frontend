// user-model.ts
import { UserRole } from './user-role-enum';

export interface UserModel {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
}
