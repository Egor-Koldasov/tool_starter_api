import { Request } from "express";

export const logRequest = (routePath: string, req: Request) => console.log(`[Req] ${routePath} ${req.method}`);
