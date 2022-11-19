import { Container } from 'typedi';

import LoggerInstance from './logger';

export default () => {
  try {
    //Add here all dependency that have to injected in a service.
    Container.set('logger', LoggerInstance);
  } catch (e) {
    LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
    throw e;
  }
};