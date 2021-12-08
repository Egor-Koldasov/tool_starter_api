import { identity } from "ramda";
import { booleanVar, numberVar, stringVar } from "./env/envVar";

const dbConfig = {
  host: stringVar('DB_HOST'),
  port: numberVar('DB_PORT', 5432),
  user: stringVar('DB_USER'),
  password: stringVar('DB_PASSWORD'),
  database: stringVar('DB_NAME'),
  // ssl: { rejectUnauthorized: false },
};

const corsOriginsStr = stringVar('CORS_ORIGINS');
const corsOrigins = corsOriginsStr.split(',').map(o => o.trim()).filter(identity);

const apiPort = numberVar('PORT');
const testHostname = stringVar('TEST_API_HOSTNAME', 'localhost');
const testHostUrl = stringVar('TEST_HOST_URL', `http://${testHostname}:${apiPort}`);

const config = {
  apiPort,
  testHostUrl,
  corsOrigins,
  db: dbConfig,
  logLvl: stringVar('LOG_LVL', 'DEBUG'),
  // auth
  signedCookies: booleanVar('SIGNED_COOKIES', true),
  secureCookies: booleanVar('SECURE_COOKIES', true),
  cookiesSecret: stringVar('COOKIE_SECRET'),
  authCookieName: stringVar('AUTH_COOKIE_NAME'),
  authSalt: stringVar('AUTH_SALT'),
  uuidNamespace: stringVar('UUID_NAMESPACE'),
};
export default config;