import './database/env/load-dev';
import type {Server} from 'http';
import express from 'express';
import cookieParser from 'cookie-parser';
import config from './config';
import { routerMiddleware } from './router/router';
import bodyParser from 'body-parser';
import cors from 'cors';

interface ListenParams {port: number};

export const startServer = async () => {
  process.on('unhandledRejection', (error) => {
    console.error('unhandledRejection', error);
  });
  const port = config.graphqlPort;
  const app = express();
  app.use(cors({origin: config.corsOrigins, credentials: true}))
  app.use(cookieParser(config.cookiesSecret));
  app.use(bodyParser.json())
  app.use(routerMiddleware());
  // for cookies to work in apollo explorer
  const listen = async (params: ListenParams) => new Promise<Server> ((resolve) => {
    const server: Server = app.listen(params, () => resolve(server));
  });
  const server = await listen({port});
  console.log(`Graphql server started: localhost:${port} (db: ${process.env.DB_NAME})`);
  server.on('close', () => console.log('API server closing'));
  server.on('error', (error: any) => console.log('API server error', error));
  return server;
}
