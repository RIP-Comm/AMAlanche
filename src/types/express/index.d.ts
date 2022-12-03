import { IUserDocument, IUserModel } from '../../models/user';
import { SessionPayload } from '../SessionPayload';
declare global {
  namespace Express {
    export interface Request {
      sessionPayload: SessionPayload;
    }
    export interface Response {
      customSuccess(httpStatusCode: number, message: string, data?: any): Response;
    }
  }

  namespace Models {
    export type UserModel = IUserDocument & IUserModel;
  }
}
