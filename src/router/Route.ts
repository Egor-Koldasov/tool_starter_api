import { Request, Response } from "express";
import { RequireAtLeastOne } from "type-fest";
import { TypeOf, ZodTypeAny } from "zod";
import User from "../database/User";

type AssertsOptional<Schema extends (ZodTypeAny | undefined)> = Schema extends undefined ? undefined : Schema extends ZodTypeAny ? TypeOf<Schema> : never

export type Endpoint<Result extends (StringKeyObject | void) = void, Schema extends (ZodTypeAny | undefined) = undefined> = {
  (params: AssertsOptional<Schema>, user: User | null, req: Request, res: Response): Promise<Result> | Result,
} & (Schema extends ZodTypeAny ? {schema: Schema} : {schema?: Schema})

export type UnknownEndpoint = Endpoint<(StringKeyObject | void), (ZodTypeAny | undefined)>

export interface RouteAllOptional {
  get?: UnknownEndpoint,
  post?: UnknownEndpoint,
  put?: UnknownEndpoint,
  delete?: UnknownEndpoint,
}

export type Route = RequireAtLeastOne<RouteAllOptional, keyof RouteAllOptional>
