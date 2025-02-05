import { BASE_URL } from '../../env.dev';

export function getGEDLogin(payload: any) {
  let url = BASE_URL + payload.entity + '/login';
  return [url, null, payload.data, 'POST'];
}
