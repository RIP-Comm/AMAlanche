import { Router } from 'express';
import session from './session';
import user from './user';

// guaranteed to get dependencies
export default (): Router => {
  const app = Router();

  user(app);

  session(app);
  return app;
};
