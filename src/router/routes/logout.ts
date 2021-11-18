import { Response } from "express";
import { removeAuthToken } from "../../tokenAuth";
import { Endpoint, Route } from "../Route";

const post: Endpoint = async (params: unknown, user: unknown, req: unknown, res: Response) => {
  await removeAuthToken(res);
}

const route: Route = {post};

export default route;