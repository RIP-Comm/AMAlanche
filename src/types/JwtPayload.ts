import { Role } from '../interfaces/user';

export type JwtPayload = {
  id: number;
  email: string;
  role: Role;
  created_at: Date;
};
