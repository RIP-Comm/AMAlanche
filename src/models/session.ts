import { model, Schema, Model } from 'mongoose';
import { ISession } from '../interfaces/session';
import autopopulate_plugin from 'mongoose-autopopulate';

const sessionCollection = 'sessions';

const SessionSchema: Schema = new Schema({
  url: { type: String, required: true, unique: true },
  owner: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: 'User',
    autopopulate: { select: '_id username role' },
  },
  quesiton: { type: String, required: true },
  title: { type: String, required: true },
});

SessionSchema.plugin(autopopulate_plugin);

const Session: Model<ISession> = model(
  'Session',
  SessionSchema,
  sessionCollection,
) as Model<ISession>;

export default Session;
