import { ExpressContext } from 'apollo-server-express';
import { AppRequest } from "./AppRequest";

export interface AppContext extends ExpressContext {
  req: AppRequest;
}
