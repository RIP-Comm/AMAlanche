import { Router } from 'express';
import session from './session';
import user from './user';
import auth from './auth';

// guaranteed to get dependencies
export default (): Router => {
  const app = Router();

  user(app);
  auth(app);

  session(app);
  return app;
};
