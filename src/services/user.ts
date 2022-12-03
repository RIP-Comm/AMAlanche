import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { ICreateUser, IUser } from '../interfaces/user';
import User from '../models/user';

@Service()
export default class UserService {
  constructor(@Inject('logger') private logger: Logger) {}

  public async get(id: string): Promise<IUser> {
    const userRecord: IUser = await User.findById(id);
    this.logger.info(`user found: ${userRecord._id}`);
    return userRecord;
  }

  public async create(user: ICreateUser): Promise<IUser> {
    const userRecord = await new User(user).save();
    this.logger.info(`user created whit id: ${userRecord._id}`);
    return userRecord;
  }
}
