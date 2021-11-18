import { pick } from "ramda";
import { pickUserPublicValues, PublicUser } from "../../lib/publicUser";
import { Endpoint, Route } from "../Route";

export type MeRes = {user: PublicUser | null};
const get: Endpoint<MeRes> = (params, user) => ({
  user: user == null ? null : pickUserPublicValues(user),
});

const route: Route = {get};
export default route;
