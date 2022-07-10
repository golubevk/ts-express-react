import { Languages } from '../../interfaces/languages';
import type { IConfig } from './interfaces';
const config: IConfig = {
  redis: {
    port: 6379,
    host: 'localhost',
    db: 1,
  },
  db: {
    host: 'localhost',
    name: 'test',
    port: 27017,
  },
  defaultLanguage: Languages.en,
};

export default config;
