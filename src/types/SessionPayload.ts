import { Role } from '../interfaces/user';

export type SessionPayload = {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
};
