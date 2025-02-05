import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildBERQ } from '../ssr-utils/build-be-rq';
import { BASE_URL, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFETIME, refreshTokens, getRefreshTokens, setAccessTokens, setRefreshTokens, getAccessTokens } from '../ssr-utils/env.dev';
import { logger } from '../ssr-utils/logger';
import jwt from 'jsonwebtoken';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

const cors = require('cors')

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));
app.use(cors())

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req: any, res: any) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */

app.post('/api', async (req: any, res: any) => {
  let response: any = {};
  let request: any[] = buildBERQ(req.body, req.headers['accesstoken'], req.headers['refreshtoken']);

  console.log(req.body)

  if (request[0] && request[0].includes(BASE_URL)) {
    let requestURL: any = request[0];
    let requestHeader: any = request[1];
    let requestBody: any = request[2];
    let requestMethod: any = request[3];

    const headers = new Headers([
      ['method', requestMethod],
      ['Content-Type', 'application/json'],
      ['Authorization', 'Bearer token'],
      ['isDipendente', 'true']
    ]);
    console.log(requestURL, requestBody);
    try {
      let data
      if (requestMethod == "POST") {

        data = await fetch(requestURL, {
          method: requestMethod,
          body: JSON.stringify(requestBody),
          headers: headers,
        });
      } else {
        data = await fetch(requestURL, {
          method: requestMethod,
          headers: headers,
        })
      }

      if (!data) {
        throw new Error('Network response was not ok');
      }

      response = await data.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  } else if (request[0] && request[0].includes('generate')) {
    response = { data: request[2] };
  } else {
    response = request[2];
  }
  // console.log(response, response.body);
  // logger.info(
  //   req.body.endpoint +
  //   ' ' +
  //   'request : ' +
  //   JSON.stringify(req.body) +
  //   ' ' +
  //   'response : ' +
  //   JSON.stringify(response)
  // );
  return res.json(response);
});

//TEST
app.post('/login', async (req: any, res: any) => {
  const { username, password } = req.body;

  // Verifica username e password
  if (req.body.loginIAM.data.cf || username === 'admin' && password === 'password') {
    const requestMethod = "POST"

    const headers = new Headers([
      ['method', requestMethod],
      ['Content-Type', 'application/json'],
      ['Authorization', 'Bearer token'],
    ]);

    console.log(JSON.stringify(req.body.loginIAM))


    const responseLoginIAM = await fetch("http://localhost:4100/api", {
      method: requestMethod,
      body: JSON.stringify(req.body.loginIAM),
      headers: headers,
    });

    if (!responseLoginIAM.ok) {
      throw new Error(`HTTP error! status: ${responseLoginIAM.status}`);
    }

    const user: any = await responseLoginIAM.json();

    console.log("dd", user)

    // Crea access token
    const accessToken = jwt.sign(user.data, ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_LIFETIME,
    });
    let accessTokens = getAccessTokens()
    accessTokens.push(accessToken)
    setAccessTokens(accessTokens)

    // Crea refresh token
    const refreshToken = jwt.sign(user.data, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_LIFETIME,
    });
    let refreshTokens = getRefreshTokens()
    refreshTokens.push(refreshToken)
    setRefreshTokens(refreshTokens)

    res.json({ accessToken, refreshToken, user: user["data"] });
  } else {
    res.status(401).send('Username o password errati');
  }
});

app.post('/regenerateAccessToken', (req: any, res: any) => {
  let refreshToken = req.headers["refreshtoken"]; //prenderlo dall header
  let status_code = 200;
  let response_body;
  if (!refreshToken || !refreshTokens.includes(refreshToken)) {
    // return res.status(403).send('Refresh token non valido');
    status_code = 403;
    response_body = 'Refresh token non valido';
  }

  console.log(req.headers)

  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err: any, user: any) => {
    if (err) {
      status_code = 403;
      response_body = 'Refresh token non valido';
    }
    console.log(user);

    if (!user || !user.username) {
      status_code = 403;
      response_body = 'Invalid user data in token';
    }

    const accessToken = jwt.sign(
      { username: user.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_LIFETIME }
    );

    response_body = accessToken;
    status_code = 200;
  });
  return res.status(status_code).send(response_body);
});

app.post('/logout', (req: any, res: any) => {
  const { refreshToken } = req.body;

  const index = refreshTokens.indexOf(refreshToken);
  if (index > -1) {
    refreshTokens.splice(index, 1);
  }

  res.status(204).send();
});

app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use('/**', (req: any, res: any, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4100.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4100;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
