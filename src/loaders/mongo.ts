import mongoose, { connect } from 'mongoose';
import Logger from './logger';

export default async (): Promise<typeof mongoose> => {
  //add here mongo DB configuration
  let uri = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`;
  if (process.env.MONGO_PASSWORD != null && process.env.MONGO_PASSWORD != null) {
    uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`;
  }
  Logger.info(`Connection uri: ${uri}`);
  return await connect(uri);
};
