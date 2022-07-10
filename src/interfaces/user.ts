import { Document } from 'mongoose';

export interface IName {
  first: string;
  last?: string;
}

interface Methods {
  generateHash: (password: string) => string;
  validPassword: (password: string) => boolean;
}

interface UserDocument extends Document {
  isActivate: boolean;
  email: string;
  name: IName;
  phone?: string;
  password: {
    hash: string;
    resetToken?: string;
    resetExpires?: Date;
  };
  validPassword(password: string): boolean;
}

type IUser = UserDocument & Methods;

export default IUser;
