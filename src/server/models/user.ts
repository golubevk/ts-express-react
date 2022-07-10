import mongoose, { Schema, Model } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt-nodejs';

import logger from '@config/logger';

import IUser from '../../interfaces/user';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
      lowercase: true,
    },

    name: {
      first: {
        type: String,
        default: '',
      },
      last: {
        type: String,
        default: '',
      },
    },

    phone: String,

    password: {
      select: false,
      type: {
        hash: String,
        resetToken: String,
        resetExpires: Date,
      },
    },

    isActivate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// generating a hash
// eslint-disable-next-line func-names
UserSchema.methods.generateHash = function (password: string) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// checking if password is valid
// eslint-disable-next-line func-names
UserSchema.methods.validPassword = function (password: string) {
  try {
    return bcrypt.compareSync(password, (this as IUser).password.hash);
  } catch (err) {
    logger.warn(`Error in validating the password: ${err}`);

    return false;
  }
};

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.plugin(uniqueValidator, {
  message: 'Error, unique value violation',
});

export type IUserModel = Model<IUser>;

export default mongoose.model<IUser, IUserModel>('User', UserSchema);
