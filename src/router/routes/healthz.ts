import { Endpoint, Route } from '../Route';

export type HealthzRes = {
  status: 'ok',
}

const get: Endpoint<HealthzRes> = async () => {
  return {status: 'ok'}
}

const route: Route = {get}
export default route