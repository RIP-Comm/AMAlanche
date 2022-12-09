import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { SessionPayload } from '../types/SessionPayload';
import { createJwtToken } from '../utils/createSession';
import { CustomError } from '../utils/response/custom-error/CustomError';
import { Role } from '../interfaces/user';

export const checkSession = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const customError = new CustomError(400, 'General', 'Authorization header not provided');
    return next(customError);
  }

  const token = authHeader.split(' ')[1];
  let jwtPayload: { [key: string]: any };
  try {
    jwtPayload = jwt.verify(token, process.env.JWT_SECRET as string) as { [key: string]: any };
    ['iat', 'exp'].forEach((keyToRemove) => delete jwtPayload[keyToRemove]);
    req.sessionPayload = jwtPayload as SessionPayload;
  } catch (err) {
    const customError = new CustomError(401, 'Raw', 'JWT error', null, err);
    return next(customError);
  }
  try {
    // Refresh and send a new token on every request
    const newToken = createJwtToken(jwtPayload as SessionPayload);
    res.setHeader('token', `Bearer ${newToken}`);
    return next();
  } catch (err) {
    const customError = new CustomError(400, 'Raw', "Token can't be created", null, err);
    return next(customError);
  }
};

export const checkRole = (roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.sessionPayload;

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
