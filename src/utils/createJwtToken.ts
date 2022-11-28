import jwt from 'jsonwebtoken';

import { JwtPayload } from '../types/JwtPayload';

export const createJwtToken = (payload: JwtPayload): string => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};
