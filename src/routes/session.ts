import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response, NextFunction } from 'express';
import Container from 'typedi';
import { ICreateSession, IUpdateSession } from '../interfaces/session';
import LoggerInstance from '../loaders/logger';
import SessionService from '../services/session';
import { CustomError } from '../utils/response/custom-error/CustomError';

const route = Router();

export default (app: Router) => {
  app.use('/sessions', route);

  route.route('/').post(
    celebrate({
      [Segments.BODY]: Joi.object().keys({
        url: Joi.string().required(),
        owner: Joi.string().required(),
        quesiton: Joi.string().required(),
        title: Joi.string().required(),
      }),
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sessionService: SessionService = Container.get(SessionService);
        const createdSession = await sessionService.create(req.body as ICreateSession);
        res.customSuccess(200, 'OK', createdSession);
      } catch (error) {
        LoggerInstance.error(error);

        const customError = new CustomError(400, 'Raw', 'Unable to create session', null, error);
        return next(customError);
      }
    },
  );

  route
    .route('/:id')
    .all(
      celebrate({
        [Segments.PARAMS]: Joi.object().keys({
          id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
        }),
      }),
    )
    .get(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sessionService: SessionService = Container.get(SessionService);
        const retrievedSession = await sessionService.get(req.params.id);
        res.customSuccess(200, 'OK', retrievedSession);
      } catch (error) {
        const customError = new CustomError(400, 'Raw', 'Unable to find session', null, error);
        return next(customError);
      }
    })
    .delete(async (req: Request, res: Response, next: NextFunction) => {
      try {
        const sessionService: SessionService = Container.get(SessionService);
        const deletedSession = await sessionService.delete(req.params.id);
        res.customSuccess(200, 'OK', deletedSession);
      } catch (error) {
        const customError = new CustomError(400, 'Raw', 'Unable to delete session', null, error);
        return next(customError);
      }
    })
    .put(
      celebrate({
        [Segments.BODY]: Joi.object().keys({
          url: Joi.string().required(),
          owner: Joi.string().required(),
          quesiton: Joi.string().required(),
          title: Joi.string().required(),
        }),
      }),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const sessionService: SessionService = Container.get(SessionService);
          const updatedSession = await sessionService.update(
            req.params.id,
            req.body as IUpdateSession,
          );
          res.customSuccess(200, 'OK', updatedSession);
        } catch (error) {
          const customError = new CustomError(400, 'Raw', 'Unable to update session', null, error);
          return next(customError);
        }
      },
    );
};
