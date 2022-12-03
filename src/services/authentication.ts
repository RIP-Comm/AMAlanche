import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { ICreateUser, IUser, Role } from '../interfaces/user';
import { SessionPayload } from '../types/SessionPayload';
import { createJwtToken } from '../utils/createSession';
import { CustomError } from '../utils/response/custom-error/CustomError';

@Service()
export default class AuthenticationService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger: Logger,
  ) {}

  public async signIn(body: { email: string; password: string }): Promise<string> {
    const user = await this.userModel.findByEmail(body.email);
    if (!user) {
      const customError = new CustomError(404, 'General', 'Not Found', [
        'Incorrect email or password',
      ]);
      throw customError;
    }
    const doMatch = user.checkIfPasswordMatch(body.password);
    if (!doMatch) {
      const customError = new CustomError(404, 'General', 'Not Found', [
        'Incorrect email or password',
      ]);
      throw customError;
    }

    const sessionPayload: SessionPayload = {
      id: user._id,
      email: user.email,
      role: user.role as Role,
      createdAt: user.createdAt,
    };
    try {
      const jwt = createJwtToken(sessionPayload);
      return jwt;
    } catch (error) {
      const customError = new CustomError(400, 'Raw', "Token can't be created", null, error);
      throw customError;
    }
  }

  public async signUp(createPayload: ICreateUser): Promise<IUser> {
    const user = new this.userModel({ ...createPayload }).save();
    return user;
  }
}
