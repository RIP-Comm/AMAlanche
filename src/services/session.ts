import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import { ICreateSession, ISession, IUpdateSession } from '../interfaces/session';
import Session from '../models/session';

@Service()
export default class SessionService {
  constructor(@Inject('logger') private logger: Logger) {}

  public async get(id: string): Promise<ISession> {
    const sessionRecord: ISession = await Session.findById<ISession>(id);
    this.logger.info(`session found: ${sessionRecord?._id ?? 'not found'}`);
    return sessionRecord;
  }

  public async create(session: ICreateSession): Promise<ISession> {
    const sessionRecord = await new Session(session).save();
    this.logger.info(`session created whit id: ${sessionRecord._id}`);
    return sessionRecord;
  }

  public async delete(id: string): Promise<ISession> {
    const sessionRecord: ISession = await Session.findByIdAndDelete(id);
    this.logger.info(`deleted session whit id: ${sessionRecord._id}`);
    return sessionRecord;
  }

  public async update(id: string, session: IUpdateSession): Promise<ISession> {
    const sessionRecord: ISession = await Session.findByIdAndUpdate(id, session, {
      returnDocument: 'after',
    });
    this.logger.info(`updated session whit id: ${sessionRecord._id}`);
    return sessionRecord;
  }
}
