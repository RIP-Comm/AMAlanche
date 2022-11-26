import { Router } from 'express';
import question from './question';
import user from './user';

// guaranteed to get dependencies
export default (): Router => {
  const app = Router();

  user(app);
  question(app);

  return app;
};
