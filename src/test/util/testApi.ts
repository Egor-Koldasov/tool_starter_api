import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import config from '../../config';

export const makeClient = () => {
  const jar = new CookieJar();
  const client = wrapper(axios.create({ jar, withCredentials: true }));
  return client;
}

export const apiUrl = (path: string) => `${config.hostUrl}/${path}`
