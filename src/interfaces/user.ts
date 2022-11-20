
export type Role = 'admin'| 'moderator' | 'user';

export interface IUser {
  _id: string,
  username: string,
  role: Role,
  email: string,
  isAuthenticated: boolean,
  password: string,
  salt: string,
  creationDate: Date
}

export interface ICreateUser {
  username: string,
  role?: Role,
  email: string,
  password: string,
  salt: string,
}