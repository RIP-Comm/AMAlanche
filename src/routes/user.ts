import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import UserService from '../services/user';
import { CustomError } from '../utils/response/custom-error/CustomError';
// TODO: example, to de-comment when login is implemented
import { checkSession, checkRole } from '../middleware/authHandler';
import { Role } from '../interfaces/user';

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get(
    '/:id',
    [
      checkSession,
      checkRole([Role.ADMIN, Role.MODERATOR]),
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          id: Joi.string().required(),
        }),
      }),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userService: UserService = Container.get(UserService);
        res.json(await userService.get(req.params.id));
      } catch (error) {
        const customError = new CustomError(400, 'Raw', 'Error', null, error);
        return next(customError);
      }
    },
  );

  /**
   * Example of how use service. Don't use it in FE.
   * This api will be deprecated when will be introduced Authentication route/service.
   *
   * TO USE ONLY FOR DEVELOPMENT PURPOSE
   */
  if (process.env.NODE_ENV === 'development') {
    route.post(
      '/',
      [
        checkSession,
        checkRole([Role.ADMIN, Role.MODERATOR]),
        celebrate({
          [Segments.BODY]: Joi.object().keys({
            username: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required(),
            role: Joi.string().valid('admin', 'moderator', 'user'),
          }),
        }),
      ],
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const userService: UserService = Container.get(UserService);
          const createdUser = await userService.create(req.body);
          res.customSuccess(200, `Created user`, createdUser);
        } catch (error) {
          const customError = new CustomError(400, 'Raw', 'Error', null, error);
          return next(customError);
        }
      },
    );
  }
};
