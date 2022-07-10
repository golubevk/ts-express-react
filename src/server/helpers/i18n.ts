import path from 'path';
import i18next from 'i18next';
import FilesystemBackend from 'i18next-node-fs-backend';
// import { Languages } from '@interfaces/languages';

import config from '@config/config';

const i18nMiddleware = require('i18next-http-middleware');

i18next
  .use(FilesystemBackend)
  .use(i18nMiddleware.LanguageDetector)
  .init({
    debug: false,
    backend: {
      loadPath: path.join(
        process.cwd(),
        '/src/server/i18n/{{lng}}/{{ns}}.json'
      ),
    },
    fallbackLng: config.defaultLanguage,
    // whitelist: ['en'],
    preload: [config.defaultLanguage],
  });

export default i18next;
