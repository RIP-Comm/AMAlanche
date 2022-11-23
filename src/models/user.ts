import { model, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, Role } from '../interfaces/user';

const userCollection = 'users';

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    role: { type: String, required: true, enum: Role, default: Role.USER },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, required: true, default: false },
    password: { type: String, required: true },
    salt: { type: String }, //mongoose check properties on create, not on save, so with required throw error for missing pops
    createdAt: { type: Date, required: true, default: Date.now() },
  },
  {
    methods: {
      checkIfPasswordMatch(unencryptedPassword: string) {
        return bcrypt.compareSync(unencryptedPassword, this.password);
      },
      toJSON() {
        const obj = this.toObject();
        delete obj.password;
        delete obj.salt;
        return obj;
      },
    },
  },
);

UserSchema.pre('save', async function save(next) {
  if (!this.isModified('password')) return next();
  try {
    this.salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, this.salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

const User: Model<IUser> = model('User', UserSchema, userCollection) as Model<IUser>;

export default User;
