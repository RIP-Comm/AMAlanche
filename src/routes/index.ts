import { Router } from 'express';
import user from './user';

// guaranteed to get dependencies
export default (): Router => {
  const app = Router();

  user(app);

  return app;
};
