import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { User } from "../interfaces/user";

@Service()
export default class UserService {

  constructor(
    @Inject('logger') private logger: Logger,
  ) {
  }


  public get(id: string): User {

    const user: User = {
      id: id,
      name:'test',
      email: 'test@test.it',
      creationDate: new Date()
    };

    this.logger.info(user);

    return user;
  }

}