import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import AuthenticationService from '../services/authentication';
import { CustomError } from '../utils/response/custom-error/CustomError';

const route = Router();

export default (app: Router) => {
  app.use('/auth', route);

  route.post(
    '/sign-in',
    [
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authenticationService: AuthenticationService = Container.get(AuthenticationService);
        const token = await authenticationService.signIn(req.body);
        res.customSuccess(200, 'Token successfully created.', `Bearer ${token}`);
      } catch (error) {
        if (error instanceof CustomError) {
          return next(error);
        }
        const customError = new CustomError(400, 'Raw', 'Error', null, error);
        return next(customError);
      }
    },
  );

  route.post(
    '/sign-up',
    [
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          username: Joi.string().required(),
          email: Joi.string().required(),
          password: Joi.string().required(),
        }),
      }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authenticationService: AuthenticationService = Container.get(AuthenticationService);
        const user = await authenticationService.signUp(req.body);
        return res.customSuccess(200, 'User successfully created', user);
      } catch (error) {
        const customError = new CustomError(
          400,
          'Raw',
          `User '${req.body.email}' can't be created`,
          null,
          error,
        );
        return next(customError);
      }
    },
  );
};
