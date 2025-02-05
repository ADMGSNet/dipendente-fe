import { BASE_URL } from '../../env.dev';

export function getQuestionsByDipendente(payload: any) {
  let url = BASE_URL + payload.entity + '/getQuestionsByDipendente';
  
  return [url, null, payload.data, 'POST'];
}

export function getQuestionById(payload: any) {
  let url = BASE_URL + payload.entity + '/getQuestionById';
  
  return [url, null, payload.data, 'POST'];
}

export function updateQuestionById(payload: any) {
  let url = BASE_URL + payload.entity + '/updateQuestionById';

  console.log(url)
  
  return [url, null, payload, 'POST'];
}

export function createQuestion(payload: any) {
  let url = BASE_URL + payload.entity + '/createQuestion';

  console.log(url)
  
  return [url, null, payload, 'POST'];
}

export function uploadAllegatoDomanda(payload: any) {
  let url = BASE_URL + payload.entity + '/uploadAllegatoDomanda';
  
  console.log(url, payload)
  
  return [url, null, payload, 'POST'];
}

export function downloadAttachment(payload: any) {
  let url = BASE_URL + payload.entity + '/downloadAttachment';
  
  console.log(url, payload)
  
  return [url, null, payload, 'POST'];
}




