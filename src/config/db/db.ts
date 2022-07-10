import mongoose from 'mongoose';

import logger from '../logger';

import mongoUrl from './url';

const options = {
  socketTimeoutMS: 3e4,
  keepAlive: true,
};

mongoose.connection.on('open', function () {
  logger.info('Connected to mongo server!');
});

mongoose.connection.on('error', function (err) {
  logger.warn('Could not connect to mongo server, err' + err);

  logger.info(err.message);
});

const connectWithRetry = function () {
  mongoose.connect(mongoUrl, options, function (err) {
    if (err) {
      logger.warn(
        'Failed to connect to mongo on startup - retrying in 1 sec',
        err
      );
      setTimeout(connectWithRetry, 1e3);
    }
  });
};

connectWithRetry();

mongoose.Error.ValidationError.prototype.toString = function () {
  const wrongs: string[] = [];

  Object.keys(this.errors).forEach((key) => {
    const error = this.errors[key];
    wrongs.push(`${key}: ${error}`);
  });

  return `${this.message} - ${wrongs.join(', ')}`;
};

mongoose.Error.CastError.prototype.toString = function () {
  if (this.kind === 'date') this.message = 'Invalid date';
  return this.message;
};
