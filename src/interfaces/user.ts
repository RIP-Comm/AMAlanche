export enum Role {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
}

export interface IUser {
  _id: string;
  username: string;
  role: Role;
  email: string;
  isVerified: boolean;
  password: string;
  salt: string;
  createdAt: Date;
}

export interface ICreateUser {
  username: string;
  role?: Role;
  email: string;
  password: string;
}

export interface IMinimalUser {
  _id: string;
  username: string;
  role: Role;
}
