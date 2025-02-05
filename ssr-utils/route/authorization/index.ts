// export function generateAccesToken(payload: any) {
//   let accesToken;
import jwt from 'jsonwebtoken';
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_LIFETIME,
  REFRESH_TOKEN_LIFETIME,
  REFRESH_TOKEN_SECRET,
  refreshTokens,
} from '../../env.dev';

//   return ['generateAccessToken', null, accesToken, 'POST'];
// }
export function generateAccessToken(payload: any): any[] {
  try {
    const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
    console.log(ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFETIME);
    return ['generateAccessToken', null, accessToken, 'POST'];
  } catch (error) {
    console.error('Errore nella generazione del token di accesso:', error);
    return ['generateAccessToken', error, null, 'POST'];
  }
}

export function generateRefreshToken(payload: any): any[] {
  try {
    const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_LIFETIME,
    });
    refreshTokens.push(refreshToken);
    return ['generateRefreshToken', null, refreshToken, 'POST'];
  } catch (error) {
    console.error('Errore nella generazione del token di refresh:', error);
    return ['generateRefreshToken', error, null, 'POST'];
  }
}
