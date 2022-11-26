import express, { Request, Response } from 'express';
import cors from 'cors';
import routes from '../routes';
import { errorHandler } from '../middleware/errorHandler';
import { errors } from 'celebrate';

import '../utils/response/customSuccess';

export default ({ app }: { app: express.Application }) => {
  app
    .route('/health')
    .get((req: Request, res: Response) => {
      res.status(200).send('AMALANCHE Service: Up & Ready');
    })
    .head((req: Request, res: Response) => {
      res.status(200).end();
    });

  app.use(cors());
  app.use(express.json());

  // Load API routes
  app.use('/api/v1', routes());

  // catch 404
  app.use((req: Request, res: Response) => {
    return res.status(404).json('404 Not Found');
  });

  //Celebrate error handler
  app.use(errors());

  //General error handler
  app.use(errorHandler);
};
