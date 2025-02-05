import { Injectable } from '@angular/core';
import {
  idChiamante,
  pwdchiamante,
  codicefiscale,
  token,
} from '../../ssr-utils/env.dev';
import { ProvideHttpClientService } from './services/provide-http-client.service';
import { HTTP_STATUS_CODE } from '../../ssr-utils/http.code';
import { SessionService } from './session.service';

@Injectable({
  providedIn: 'root',
})
export class GedService {
  datiUtente: any;

  constructor(private httpService: ProvideHttpClientService, private sessionService: SessionService) { }

  login() {
    let data: any = {
      idchiamante: idChiamante,
      pwdchiamante: pwdchiamante,
      codicefiscale: codicefiscale,
      token: token,
      errorCode: '000', //TODO:remove it
    };

    let payload: any = {
      entity: 'ged',
      endpoint: 'gedLogin',
      data: data,
    };

    this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe((result: any) => {
      console.log(result);
      let errorMessage: any;
      if (result.http_code == gedHttpCode.OK) {
        this.datiUtente = result.data.datiUtente;
        console.log(this.datiUtente);
      } else if (result.data.apiWsResponse) {
        errorMessage = result.data.apiWsResponse;
      } else {
        errorMessage = {
          errorCode: 500,
          errorMessage: 'errore nella chiamata con il server',
        };
      }
    });
  }
}

export enum gedHttpCode {
  OK = '000',
  UTENTE_NON_TROVATO = '700',
  NON_CENSITA = '800',
  PASSWORD_ERRATA = '801',
  UTENTE_NON_ABILITATO = '802',
  PARAMETRI_INPUT_NON_VALIDI = '803',
  ERRORE_GENERICO = '999',
  LA_RICERCA_NON_HA_PRODOTTO_RISULTATI = '20046',
  DESTINATARIO_NON_TROVATO = '20180',
}
