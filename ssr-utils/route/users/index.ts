import { BASE_URL } from '../../env.dev';

export function getUserById(payload: any) {
  let url = BASE_URL + payload.entity + '/' + payload.data.id;
  return [url, null, null, 'GET'];
}

export function loginUserIAM(payload: any) {
  let url = BASE_URL + payload.entity + '/login';
  return [url, null, payload.data, 'POST'];
}