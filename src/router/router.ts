import requireAll from "require-all";
import path from 'path';
import { NextFunction, Response, Request } from "express";
import { Endpoint, Route, UnknownEndpoint } from "./Route";
import { getReqUser } from "../tokenAuth";
import get from "../lib/get";
import { identity, indexOf } from "ramda";
import { debug, logRequest } from "../lib/log";
import { ApiError, getErrorMessage } from "./routes/error";


export const getModules = (relPath: string) => {
  const queries = requireAll({
    dirname: path.resolve(__dirname, relPath),
    filter: /(.+)\.ts/,
    resolve: (module) => module.default,
  });
  return queries;
}
const getRoutes = () => getModules('./routes');
const routes = getRoutes();

type CrudMethod = 'get' | 'post' | 'put' | 'delete';
const crudMethods = ['get', 'post', 'put', 'delete'] as const;

const execEndpoint = async (endpoint: UnknownEndpoint, req: Request, res: Response) => {
  const passedParams = req.method === 'GET' ? req.query : req.body;
  debug({passedParams});
  const params = endpoint.schema ? await endpoint.schema.parse(passedParams) : undefined;
  const user = await getReqUser(req);
  const result = await endpoint(params, user, req, res);
  res.send(result);
}

const isCrudMethod = (method: string): method is CrudMethod => indexOf(method, crudMethods) >= 0;

const notFound = () => new Error('Not found');

export const routerMiddleware = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const routePath = req.path.split('/').filter(identity).join('.');
    logRequest(routePath, req);
    const route: Route | undefined = get(routes, routePath);
    if (!route) throw notFound();
    const method = req.method.toLowerCase();
    if (!isCrudMethod(method)) throw notFound();
    const endpoint: UnknownEndpoint | undefined = route[method];
    if (!endpoint) throw notFound();
    await execEndpoint(endpoint, req, res);
  } catch (error) {
    if (!(error instanceof Error)) {
      res.status(502);
      res.send({message: getErrorMessage(error)});
      return
    }
    if (error.name === 'ZodError') {
      res.status(400);
      res.send({message: getErrorMessage(error)});
    }
    if (error instanceof ApiError) {
      res.status(error.status);
      res.send({message: getErrorMessage(error)});
    }
  }

  next();
}