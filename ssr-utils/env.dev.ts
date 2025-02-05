export const BASE_URL = 'http://3.78.61.196:3000/v1/';
export const ACCESS_TOKEN_SECRET =
  'b6138e6d6844d32a229892bb0da2daa14e865f501b8c2b8444e41f0a36bfe9f4';
export const REFRESH_TOKEN_SECRET =
  '0e11cda8533a2056e68f4dbd89511d1c0e78d45078412d12ce100f9e813dd9fb';
export const ACCESS_TOKEN_LIFETIME = '1d';
export const REFRESH_TOKEN_LIFETIME = '7d';
export var refreshTokens: string[] = [];
export function getRefreshTokens() {
  return refreshTokens
}

export function setRefreshTokens(tokens: string[]) {
   refreshTokens = tokens
}

var accessTokens: string[] = [];
export function getAccessTokens() {
  return accessTokens
}

export function setAccessTokens(tokens: string[]) {
  accessTokens = tokens
}

export const idChiamante = "APILIBROFIRMA"
export const pwdchiamante = "SVILUPPO"
export const codicefiscale = "KRRSKK92H22Y302M"
export var token = "AAAAAAAAAAAAAAHHHHH"
