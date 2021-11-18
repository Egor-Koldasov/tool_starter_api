import requireAll from "require-all";
import path from 'path';
import { NextFunction, Response, Request } from "express";
import { Endpoint, Route, UnknownEndpoint } from "./Route";
import { getReqUser } from "../tokenAuth";
import get from "../lib/get";
import { indexOf } from "ramda";
import { identity } from "lodash";
import { logRequest } from "../lib/log";
import { ApiError } from "./routes/error";


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
  console.log({passedParams});
  const params = endpoint.schema ? await endpoint.schema.validate(passedParams) : undefined;
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
    console.error(error);
    if (!(error instanceof Error)) {
      res.status(502);
      res.end(String(error));
      return
    }
    if (error.name === 'ValidationError') {
      res.status(400);
      res.end(String(error));
    }
    if (error instanceof ApiError) {
      res.status(error.status);
      res.end(String(error));
    }
  }

  next();
}