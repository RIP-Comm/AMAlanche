import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import { Logger } from 'winston';
import Container from 'typedi';

@EventSubscriber()
export default class APILoad {
  @On(events.test.onCall)
  public onAPICall(s: string) {
    const logger: Logger = Container.get('logger');
    logger.info(s);
  }
}
