import { pick } from "ramda";
import { Opaque } from "type-fest";
import User from "../database/User";

// make it opaque so that "User" type does not cast into this type
export type PublicUser = Opaque<Omit<User, 'password'>>

export const userPublicProps = ['id', 'email'] as const;

// this function is required to be called for anything that returns PublicUser
export const pickUserPublicValues = (user: User): PublicUser => pick(userPublicProps, user) as PublicUser;
