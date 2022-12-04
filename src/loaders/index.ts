import Logger from './logger';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';
import mongo from './mongo';
import './event';
export default async ({ expressApp }): Promise<void> => {
  // Add here everything that need load to server startup
  const dbConnection = await mongo();
  Logger.info('Database connection loaded');

  await dependencyInjectorLoader({ dbConnection });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
