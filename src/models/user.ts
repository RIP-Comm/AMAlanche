import { model, Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, Role } from '../interfaces/user';

const userCollection = 'users';

export interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  checkIfPasswordMatch: (unencryptedPassword: string) => true | false;
}
export interface IUserModel extends Model<IUserDocument> {
  findByEmail: (email: string) => Promise<IUserDocument>;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: Role, default: Role.USER },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    salt: { type: String }, //mongoose check properties on create, not on save, so with required throw error for missing prop
    createdAt: { type: Date, required: true, default: Date.now() },
  },
  {
    methods: {
      checkIfPasswordMatch(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
      },
      async setPassword(password: string) {
        this.salt = await bcrypt.genSaltSync(10);
        this.password = await bcrypt.hashSync(password, this.salt);
      },
      //override mongoose
      toJSON() {
        const obj = this.toObject();
        delete obj.password;
        delete obj.salt;
        return obj;
      },
    },
    statics: {
      findByEmail(email: string) {
        return this.find({ email });
      },
    },
  },
);

const User = model('User', UserSchema, userCollection);
export default User as IUserDocument & IUserModel;
