import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response } from 'express';
import Container from "typedi";
import UserService from "../services/user";

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.get('/:id', celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      id:Joi.string().required()
    })
  }), async (req: Request, res: Response) => {

    const userService: UserService = Container.get(UserService);
    res.json(await userService.get(req.params.id));

  });

  /**
   * Example of how use service. Don't use it in FE.
   * This api will be deprecated when will be introduced Authentication route/service.
   * 
   * TO USE ONLY FOR DEVELOPMENT PURPOSE
   */
  if(process.env.NODE_ENV === 'development') {
    route.post('/', celebrate({
      [Segments.BODY]: Joi.object().keys({
        username:Joi.string().required(),
        email:Joi.string().required(),
        password:Joi.string().required(),
        salt:Joi.string().required(),
        role: Joi.string().valid('admin', 'moderator', 'user')
      })
    }), async (req: Request, res: Response) => {
      
      const userService: UserService = Container.get(UserService);
      res.json(await userService.create(req.body));
      
    });
  }
};