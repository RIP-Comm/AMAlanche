import { celebrate, Joi, Segments } from 'celebrate';
import { Router, Request, Response } from 'express';
import Container from "typedi";
import UserService from "../services/user";

const route = Router();

export default (app: Router) => {
  app.use('/users', route);

  route.post('/test', celebrate({
    [Segments.BODY]: Joi.object().keys({
      id:Joi.string().required()
    })
  }), (req: Request, res: Response) => {

    const userService: UserService = Container.get(UserService);
    res.json(userService.get(req.body.id));

  });

};