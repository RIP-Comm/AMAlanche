import jwt from 'jsonwebtoken';

import { SessionPayload } from '../types/SessionPayload';

export const createJwtToken = (payload: SessionPayload): string => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
};
