import crossFetch from 'cross-fetch';
import cookie from 'cookie';
import { toPairs } from 'ramda';
import config from '../../config';

export const makeTestFetch = () => {
  let cookies = {};
  const customFetch = async (input: RequestInfo, init?: RequestInit | undefined): Promise<Response> => {
    const fetchRes = await crossFetch(
      `${config.testHostUrl}/${input}`,
      {
        ...init,
        headers: {
          ...init?.headers,
          cookie: toPairs(cookies).map((pair) => `${pair[0]}=${pair[1]}`).join('; '),
        },
        credentials: 'include'
      }
    );
    const setCookie = fetchRes.headers.get('set-cookie');
    if (setCookie) {
      cookies = cookie.parse(setCookie);
    }
    return fetchRes;
  }
  return customFetch;
}
