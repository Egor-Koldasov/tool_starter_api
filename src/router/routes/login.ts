import bcrypt from 'bcrypt'
import { Endpoint, Route } from '../Route';
import { MeRes } from './me';
import User from '../../database/User';
import { db } from '../../database/db-connection';
import { addAuthToken } from '../../tokenAuth';
import { badRequest } from './error';
import { pickUserPublicValues } from '../../lib/publicUser';
import { object, string } from 'yup';

const schema = object({
  email: string().email().required(),
  password: string().required(),
})

const post: Endpoint<MeRes, typeof schema> = async (params, userAuthorised, req, res) => {
  const user: User = (await db('app_user').where({email: params.email}))[0];
  if (!user) {
    throw badRequest('Email not found');
  }
  const isPasswordCorrect = await bcrypt.compare(params.password, user.password)
  if (!isPasswordCorrect) {
    throw badRequest('Email or password is incorrect');
  }
  await addAuthToken(user, res);
  return {user: pickUserPublicValues(user)}
}
post.schema = schema;

const route: Route = {post}
export default route