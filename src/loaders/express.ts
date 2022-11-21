import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from '../routes';
import { isCelebrateError } from 'celebrate';

export default ({ app }: { app: express.Application }) => {
  app.get('/status', (req: Request, res: Response) => {
    res.status(200).end();
  });
  app.head('/status', (req: Request, res: Response) => {
    res.status(200).end();
  });

  app.use(cors());
  app.use(express.json());

  // Load API routes
  app.use('/api/v1', routes());

  //Celebrate error handler
  app.use((err, req: Request, res: Response, next) => {
    if (isCelebrateError(err)) {
      const error = {
        details: err.details,
        message: err.message,
        name: err.name,
        stack: err.stack,
      };
      res.status(400).json(error);
    } else {
      next(err);
    }
  });

  /// catch 404 and forward to error handler
  app.use((req: Request, res: Response, next) => {
    const err = new Error('Not Found');
    err['status'] = 404;
    next(err);
  });
};
