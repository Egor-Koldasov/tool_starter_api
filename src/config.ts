import { identity } from "ramda";

const envToString = (env: string | undefined) => env ? env : ''

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(envToString(process.env.DB_PORT)),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: { rejectUnauthorized: false },
};

const corsOriginsStr = envToString(process.env.CORS_ORIGINS) || 'https://studio.apollographql.com,http://localhost:3000,http://dev.local:3000';
const corsOrigins = corsOriginsStr.split(',').map(o => o.trim()).filter(identity);

const apiPort = parseInt(envToString(process.env.API_PORT)) || 4000;
const hostname = process.env.API_HOSTNAME || 'localhost';
const hostUrl = process.env.HOST_URL || (`http://${hostname}:${apiPort}`);

const config = {
  apiPort,
  hostUrl,
  corsOrigins,
  db: dbConfig,
  logLvl: envToString(process.env.LOG_LVL) || 'DEBUG',
  // auth
  signedCookies: process.env.SIGNED_COOKIES === 'FALSE' ? false : true,
  secureCookies: process.env.SECURE_COOKIES === 'FALSE' ? false : true,
  cookiesSecret: process.env.COOKIE_SECRET || '37e87192-1de4-4595-b317-cdf0ead367a7',
  authCookieName: process.env.AUTH_COOKIE_NAME || 'imhucauen',
  authSalt: process.env.AUTH_SALT || 'iuquoigiungcoiue',
  uuidNamespace: process.env.UUID_NAMESPACE || '4caeabca-8f4d-4488-8388-ae7fe46bd59e',
};
export default config;