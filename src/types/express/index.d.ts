import type IUser from '../../interfaces/user';

declare global {
  namespace Express {
    interface User extends IUser {}
    interface Request {
      _requestId: string;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    user?: IUser;
    isSU?: boolean;
  }
}
