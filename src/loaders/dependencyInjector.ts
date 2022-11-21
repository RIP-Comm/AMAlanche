import { Container } from 'typedi';
import Logger from './logger';

export default ({ dbConnection }) => {
  try {
    //Add here all dependency that have to injected in a service.
    Container.set('database-connection', dbConnection);
    Container.set('logger', Logger);
  } catch (e) {
    Logger.error('Error on dependency injector loader: %o', e);
    throw e;
  }
};
