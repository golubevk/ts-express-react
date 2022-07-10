import moment from 'moment';
import { createLogger, format, transports } from 'winston';

import type {
  LoggerServiceClass,
  HandleLogType,
  LoggerType,
} from './interfaces';

const { combine, timestamp, printf, colorize, prettyPrint } = format;

const combineFormat = combine(
  timestamp({ format: 'M/D/YYYY, h:mm:ss A' }),
  colorize(),
  prettyPrint(),
  printf(({ level, message, timestamp: timestampData }) => {
    return `${timestampData} ${level} - ${message}`;
  })
);

const handleLog: HandleLogType = (func) => {
  return (message, ...meta) => {
    let realMessage = message;

    if (meta.length) {
      meta.forEach((i: string) => {
        realMessage += ` ${i}`;
      });
    }

    return func(realMessage);
  };
};

class LoggingService implements LoggerServiceClass {
  private static _instance: LoggingService;

  info: LoggerType;

  error: LoggerType;

  warn: LoggerType;

  verbose: LoggerType;

  debug: LoggerType;

  silly: LoggerType;

  addConsole: (logLevel?: string) => void;

  addFile: (value: string, logLevel?: string) => void;

  constructor() {
    const logger = createLogger({
      exitOnError: false,
      transports: [],
    });

    this.info = handleLog(logger.info);
    this.error = handleLog(logger.error);
    this.warn = handleLog(logger.warn);
    this.verbose = handleLog(logger.verbose);
    this.debug = handleLog(logger.debug);
    this.silly = handleLog(logger.silly);

    this.addConsole = (logLevel) => {
      console.log(`Adding logger for console, level = ${logLevel}`);
      logger.add(
        new transports.Console({
          level: logLevel,
          handleExceptions: true,
          format: combineFormat,
        })
      );
    };

    this.addFile = (value, logLevel) => {
      const filename = `${value}.${moment().format('YYYY-MM-DD')}`;

      logger.add(
        new transports.File({
          level: logLevel,
          filename,
          handleExceptions: true,
          format: combineFormat,
        })
      );
    };
  }

  static getInstance(): LoggingService {
    // eslint-disable-next-line no-underscore-dangle
    if (!LoggingService._instance) {
      // eslint-disable-next-line no-underscore-dangle
      LoggingService._instance = new LoggingService();
    }
    // eslint-disable-next-line no-underscore-dangle
    return LoggingService._instance;
  }
}

export default LoggingService.getInstance();
