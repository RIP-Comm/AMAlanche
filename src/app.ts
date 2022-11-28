import 'reflect-metadata';

import express from 'express';
import Logger from './loaders/logger';
import * as dotenv from 'dotenv';
import loaders from './loaders';
dotenv.config();

async function startServer() {
  const app = express();

  await loaders({ expressApp: app });

  app
    .listen(process.env.PORT, () => {
      Logger.info(`Server listening on port: ${process.env.PORT}`);
    })
    .on('error', (err) => {
      Logger.error(err);
      process.exit(1);
    });
}

startServer();
