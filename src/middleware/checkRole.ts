import { Request, Response, NextFunction } from 'express';
import { Role } from '../interfaces/user';

import { CustomError } from '../utils/response/custom-error/CustomError';

export const checkRole = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.jwtPayload;

    if (roles.indexOf(role) === -1) {
      const errors = [
        'Unauthorized - Insufficient user rights',
        `Current role: ${role}. Required role: ${roles.toString()}`,
      ];

      const customError = new CustomError(
        401,
        'Unauthorized',
        'Unauthorized - Insufficient user rights',
        errors,
      );
      return next(customError);
    }
    return next();
  };
};
