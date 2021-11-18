import { Request, Response } from "express";
import { Entries, RequireAtLeastOne } from "type-fest";
import { Asserts, BaseSchema } from "yup";
import User from "../database/User";

type AssertsOptional<Schema extends (BaseSchema | undefined)> = Schema extends undefined ? undefined : Schema extends BaseSchema ? Asserts<Schema> : never

export type Endpoint<Result extends (StringKeyObject | void) = void, Schema extends (BaseSchema | undefined) = undefined> = {
  (params: AssertsOptional<Schema>, user: User | null, req: Request, res: Response): Promise<Result> | Result,
} & (Schema extends BaseSchema ? {schema: Schema} : {schema?: Schema})

export type UnknownEndpoint = Endpoint<(StringKeyObject | void), (BaseSchema | undefined)>

export interface RouteAllOptional {
  get?: UnknownEndpoint,
  post?: UnknownEndpoint,
  put?: UnknownEndpoint,
  delete?: UnknownEndpoint,
}

export type Route = RequireAtLeastOne<RouteAllOptional, keyof RouteAllOptional>
