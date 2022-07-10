import { LeveledLogMethod, Logger } from 'winston';

export type LoggerType = (message: unknown, ...meta: any[]) => Logger;

export type HandleLogType = (func: LeveledLogMethod) => LoggerType;

export abstract class LoggerServiceClass {
  abstract info: LoggerType;

  abstract error: LoggerType;

  abstract warn: LoggerType;

  abstract verbose: LoggerType;

  abstract debug: LoggerType;

  abstract silly: LoggerType;

  abstract addConsole(logLevel?: string): void;

  abstract addFile(value: string, logLevel?: string): void;
}
