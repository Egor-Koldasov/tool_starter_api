import type {Server} from 'http';
import { db } from '../../database/db-connection';
import { startServer } from '../../server';

let server: Server;
export const setupIntegrationTests = async () => {
  server = await startServer();
}
export const cleanupIntegrationTests = async () => {
  await db.destroy();
  const closePromise = new Promise((resolve) => server.once('close', resolve));
  server.close();
  await closePromise;
}