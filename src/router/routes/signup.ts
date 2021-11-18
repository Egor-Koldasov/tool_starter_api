import bcrypt from 'bcrypt'
import util from 'util';
import { Endpoint, Route } from '../Route';
import { object, string } from 'zod';
import { MeRes } from './me';
import { badRequest } from './error';
import { pickUserPublicValues } from '../../lib/publicUser';
import User from '../../database/User';
import { db } from '../../database/db-connection';
import { addAuthToken } from '../../tokenAuth';

const schema = object({
  email: string().email(),
  password: string(),
})
const post: Endpoint<MeRes, typeof schema> = async (params, user, req, res) => {
  const existingUser: User = (await db('app_user').where({email: params.email}))[0];
  if (existingUser) throw badRequest('This email is already in use');
  const passwordHash = await util.promisify(bcrypt.hash)(params.password, 10);
  await db('app_user').insert({email: params.email, password: passwordHash});
  const registeredUser: User = (await db('app_user').where({email: params.email}))[0];
  await addAuthToken(registeredUser, res);
  return {user: pickUserPublicValues(registeredUser)};
}
post.schema = schema;

const route: Route = {post};
export default route