import { Strategy } from 'passport-local';

import User from '../../server/models/user';

export default new Strategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  // eslint-disable-next-line func-names
  function (email, password, done) {
    User.findOne({
      email: email.toLowerCase(),
    })
      .select('+password')
      // eslint-disable-next-line func-names
      .exec(function (err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false, { message: 'Unknown user' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Invalid password' });
        }
        return done(null, user);
      });
  }
);
