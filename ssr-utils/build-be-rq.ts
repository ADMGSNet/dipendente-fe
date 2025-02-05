import { getUserById, loginUserIAM } from './route/users';
import { HTTP_STATUS_CODE } from './http.code';
import {
  generateAccessToken,
  generateRefreshToken,
} from './route/authorization';
import { createQuestion, downloadAttachment, getQuestionById, getQuestionsByDipendente, updateQuestionById, uploadAllegatoDomanda } from './route/questions';
import { getGEDLogin } from './route/ged';
import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_LIFETIME, ACCESS_TOKEN_SECRET, getAccessTokens, getRefreshTokens, REFRESH_TOKEN_SECRET, setAccessTokens, setRefreshTokens } from './env.dev';

function existToken(token: string, listToken: any[]) {
  return token && listToken.filter(elem => token == elem).length > 0
}

export function buildBERQ(payload: any, accessToken?: string, refreshToken?: string) {
  let request: any;

  let isAuthorized = false

  if(payload.endpoint == "loginUserIAM" || payload.isTesting) {
    isAuthorized = true
  } else if ( existToken(accessToken!, getAccessTokens()) && existToken(refreshToken!, getRefreshTokens()) ) {
    //CONTROLLA ACCESS TOKEN
    jwt.verify(accessToken!, ACCESS_TOKEN_SECRET, (err: any, user: any) => {
      //SE ACCESS TOKEN NON VALIDO VERIFICA REFRESH TOKEN
      console.log("STATO ACCESS TOKEN", err, user)

      if (err || !user || !user._id) {
        jwt.verify(refreshToken!, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
          //REFRESH TOKEN NON VALIDO
          console.log("STATO REFRESH TOKEN", err, user)
          if (err || !user || !user._id) {
            //ELIMINA ACCESS E REFRESH TOKEN
            let refreshTokens = getRefreshTokens().filter(token => refreshToken != token)
            setRefreshTokens(refreshTokens)

            let accessTokens = getAccessTokens().filter(token => accessToken != token)
            setAccessTokens(accessTokens)

            request = [
              null,
              null,
              { statusCode: HTTP_STATUS_CODE.AUTHENTICATION_ERROR },
            ]
          } else { //AGGIORNA ACCESS TOKEN
            console.log(user);
        
            let accessTokens = getAccessTokens().filter(token => accessToken != token)
            const accessToken = jwt.sign(
              { username: user.username },
              ACCESS_TOKEN_SECRET,
              { expiresIn: ACCESS_TOKEN_LIFETIME }
            );
      
            if(!accessTokens.includes(accessToken)) accessTokens.push(accessToken)
            setAccessTokens(accessTokens)
            isAuthorized = true
          }
        });
      } else { //OK ACCESS TOKEN
        isAuthorized = true
      }
    });
  } else if (refreshToken && !jwt.verify(refreshToken, REFRESH_TOKEN_SECRET)) {
    let refreshTokens = getRefreshTokens().filter(token => refreshToken != token)

    setRefreshTokens(refreshTokens)
    isAuthorized = false

    request = [
      null,
      null,
      { statusCode: HTTP_STATUS_CODE.AUTHENTICATION_ERROR },
    ]
  } else {
    isAuthorized = false

    request = [
      null,
      null,
      { statusCode: HTTP_STATUS_CODE.AUTHENTICATION_ERROR },
    ]
  }
  
  if(isAuthorized) {
    switch (payload.endpoint) {
      case 'loginUserIAM': {
        request = loginUserIAM(payload);
        break;
      }
      case 'getUserById': {
        request = getUserById(payload);
        break;
      }
      case 'getQuestionsByDipendente': {
        request = getQuestionsByDipendente(payload);
        break;
      }
      case 'getQuestionById': {
        request = getQuestionById(payload);
        break;
      }
      case 'createQuestion': {
        request = createQuestion(payload);
        break;
      }
      case 'updateQuestionById': {
        request = updateQuestionById(payload);
        break;
      }
      case 'uploadAllegatoDomanda': {
        request = uploadAllegatoDomanda(payload);
        break;
      }
      case 'gedLogin': {
        request = getGEDLogin(payload);
        break;
      }
      case 'downloadAttachment': {
        request = downloadAttachment(payload)
        break
      }
      default: {
        request = [
          null,
          null,
          { statusCode: HTTP_STATUS_CODE.NOT_FOUND_ENDPOINT },
        ];
      }
    }
  }

  return request; // STRUTTURA DELLA RICHIESTA[URL,HEADER,BODY]
}




