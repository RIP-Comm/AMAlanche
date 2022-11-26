import { model, Schema, Model } from 'mongoose';
import { ISession } from '../interfaces/session';

const sessionCollection = 'sessions';

const SessionSchema: Schema = new Schema({
  url: { type: String, required: true, unique: true },
  owner: { type: Schema.Types.ObjectId, require: true, ref: 'User' },
  quesiton: { type: String, required: true },
  title: { type: String, required: true },
});

const Session: Model<ISession> = model(
  'Session',
  SessionSchema,
  sessionCollection,
) as Model<ISession>;

export default Session;
