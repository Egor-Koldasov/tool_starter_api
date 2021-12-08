import { Request, Response } from "express";
import config from "./config";
import { db } from "./database/db-connection";
import User from "./database/User";
import { v4 as uuidv4 } from 'uuid';


const getUserFromToken = async (token: string) => {
  const auth = (await db('auth').where({token}))[0];
  const user: User | null = !auth ? null : (await db('app_user').where({id: auth.user_id}))[0];
  return user;
}

const getCookie = (req: Request, cookieName: string) => config.signedCookies ? req.signedCookies[cookieName] : req.cookies[cookieName];
const getAuthCookie = (req: Request) => getCookie(req, config.authCookieName);

export const getReqUser = async (req: Request) => {
  const authCookie = getAuthCookie(req);
  return authCookie ? await getUserFromToken(authCookie) : null;
}

export const addAuthToken = async (user: User, res: Response) => {
  const token = uuidv4();
  await db('auth').insert({token, user_id: user.id});
  res.cookie(config.authCookieName, token, {sameSite: 'none', secure: config.secureCookies, signed: config.signedCookies});
}
export const removeAuthToken = async (res: Response) => {
  res.clearCookie(config.authCookieName);
}
