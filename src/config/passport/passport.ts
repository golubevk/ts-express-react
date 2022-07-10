import passport from 'passport';

import User from '../../server/models/user';

import local from './local';

import type IUser from '../../interfaces/user';

export default function (passportFunc: typeof passport) {
  // serialize sessions
  passportFunc.serializeUser((user, cb) => cb(null, (user as IUser)._id));

  passportFunc.deserializeUser((id, done) => {
    User.findById(id, (err: Error, user: IUser) => {
      done(err, user);
    });
  });

  // use these strategies
  passport.use(local);
}
