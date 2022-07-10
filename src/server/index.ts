/* eslint-disable no-underscore-dangle */
import express, {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo';
import cors from 'cors';
import methodOverride from 'method-override';
import passport from 'passport';
import path from 'path';
import serveStatic from 'serve-static';
import fs from 'fs';
import md5 from 'md5';
import useragent from 'express-useragent';
import i18nMiddleware from 'i18next-http-middleware';

import '../config/aliases';
import '../config/db';

import routes from './routes';

import i18next from './helpers/i18n';
import mongoUrl from '../config/db/url';
import logger from '../config/logger';
import passportFunc from '../config/passport';
import '../config/redis_config';

const PUBLIC_DIR = path.resolve(process.cwd(), 'build');

const logLevel = 'info';
logger.addConsole(logLevel);

const serverUniqueId = md5(Date.now().toString());
let serverUniqueCount = 1;

const app = express();

app.use(serveStatic(PUBLIC_DIR));

passportFunc(passport);

const initRequestDebugging: RequestHandler = (req, res, next) => {
  const url = req.originalUrl || req.url;

  // eslint-disable-next-line no-plusplus
  req._requestId = serverUniqueId + serverUniqueCount++;
  logger.info(req.method, url, 'requestId:', req._requestId);

  next();
};

app.use(initRequestDebugging);

app.use(useragent.express());

app.use(i18nMiddleware.handle(i18next));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization'
  );
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

// eslint-disable-next-line func-names
process.addListener('uncaughtException', function (err) {
  logger.error(err.toString());
  if (err.name === 'RangeError') process.exit(1);
});

process.on('unhandledRejection', (err) => {
  logger.warn(`Unhandled promise rejection. \n${err}`);
});

app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: false,
    credentials: false,
  })
);

app.use(
  methodOverride((req) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      // look in urlencoded POST bodies and delete it
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(cookieParser());
app.use(
  session({
    store: MongoStore.create({
      mongoUrl,
      touchAfter: 24 * 3600,
    }),
    saveUninitialized: false, // don't create session until something stored
    resave: false, // don't save session if unmodified
    secret: 'estimates-app',
  })
);

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || '3001';

app.set('port', port);
logger.info('checking port', port);

app.listen(port, () => {
  if (process.env.DYNO) {
    logger.info('Running on Heroku...');
    fs.openSync('/tmp/app-initialized', 'w');
  } else logger.info(`Server now listening on port: ${port}`);
});

Object.values(routes).forEach((route: any) => route(app));

// eslint-disable-next-line func-names
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  const errors = [];

  const status = err.status || 500;
  const type = 'error;';

  let message = req.t(err.message) || 'Something went wrong';

  const log = err.log || '';

  if (status === 500) {
    const user = req.user ? req.user._id.toString() : 'guest';
    const userEmail = req.user ? req.user.email : '';
    const url = req.originalUrl || 'unknown';

    logger.error(
      // eslint-disable-next-line sonarjs/no-nested-template-literals
      `User: ${user}${userEmail && ` (${userEmail})`}; Url: ${url}; ${log}: ${
        err.stack
      }. Request body: ${JSON.stringify(req.body)}`
    );
  } else {
    logger.warn(`${log}; Url: ${req.originalUrl}`);
  }

  if (err.errors) {
    message = err.errors[0].msg;
    err.errors.forEach(
      (error: {
        value: string;
        msg: string;
        param: string;
        location: string;
      }) => {
        errors.push({
          message: req.t(error.msg),
          status,
          type,
        });
      }
    );
  } else {
    errors.push({
      status,
      message,
      type,
    });
  }

  res.status(status).json({ errors });
  next();
});
