import { pick } from "ramda";
import User from "../database/User";

export type PublicUser = Omit<User, 'password'>

export const userPublicProps = ['id', 'email'] as const;

export const pickUserPublicValues = (user: User): PublicUser => pick(userPublicProps, user);
