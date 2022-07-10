import authConfig from '../config';
const {
  db: { host, name, port },
} = authConfig;

export default process.env.DB_CONN || `mongodb://${host}:${port}/${name}`;
