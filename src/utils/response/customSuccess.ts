import { response, Response } from 'express';

response.customSuccess = function (
  httpStatusCode: number,
  message: string,
  data: unknown = null,
): Response {
  return this.status(httpStatusCode).json({ message, data });
};
