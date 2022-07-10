import path from 'path';
import { addAliases } from 'module-alias';

const prefix = process.env.NODE_ENV === 'production' ? 'build-server' : '';

addAliases({
  '@config': path.resolve(process.cwd(), prefix, 'src/config'),
  '@helpers': path.resolve(process.cwd(), prefix, 'src/server/helpers'),
  '@models': path.resolve(process.cwd(), prefix, 'src/server/models'),
  '@interfaces': path.resolve(process.cwd(), prefix, 'src/interfaces'),
  '@services': path.resolve(process.cwd(), prefix, 'src/server/services'),
  '@i18n': path.resolve(process.cwd(), prefix, 'src/server/i18n'),
});
