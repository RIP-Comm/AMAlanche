
import Logger from './logger';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';

export default async ({ expressApp }): Promise<void> => {
  // Add here everything that need load to server startup
  await dependencyInjectorLoader();
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};