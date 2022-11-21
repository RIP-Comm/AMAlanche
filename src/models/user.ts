import { model, Schema, Model } from 'mongoose';
import { IUser } from '../interfaces/user';

const userCollection = 'users'

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'moderator', 'user'], default: 'user' },
  email: { type: String, required: true },
  isVerified: { type: Boolean, required: true, default: false },
  password: { type: String, required: true },
  salt: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() }
});

const User: Model<IUser> = model('User', UserSchema, userCollection) as Model<IUser>;

export default User;