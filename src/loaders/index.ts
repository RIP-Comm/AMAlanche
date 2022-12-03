import Logger from './logger';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';
import mongo from './mongo';
import './event';
export default async ({ expressApp }): Promise<void> => {
  // Add here everything that need load to server startup
  const dbConnection = await mongo();
  Logger.info('Database connection loaded');

  const userModel = {
    name: 'userModel',
    // Notice the require syntax and the '.default'
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    model: require('../models/user').default,
  };
  await dependencyInjectorLoader({
    dbConnection,
    models: [userModel],
  });
  Logger.info('Dependency Injector loaded');

  await expressLoader({ app: expressApp });
  Logger.info('Express loaded');
};
