import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeIDomanda, domanda as domande } from './dati-richieste.data';
import { IUser, IDomanda, StateEnum } from './interfaces/dati-richiesti.interface';
import { ProvideHttpClientService } from './services/provide-http-client.service';
import { refreshTokens } from '../../ssr-utils/env.dev';
import { Subject } from 'rxjs';
import { HTTP_STATUS_CODE } from '../../ssr-utils/http.code';
import { SimpleAlertService } from './shared/simple-alert/simple-alert.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  selectedRow: IDomanda | null = null;
  domande: IDomanda[] = [];
  printDomandeRegione: IDomanda[] = []
  notification: any[] = []
  user: any;

  accessToken: string = ""
  refreshToken: string = ""

  user$ = new Subject()

  isFirstCalled = false

  loginIAMMock: any = {
    "data": { "cf": "RSSMRA80A01L219M" },
    "entity": "users",
    "endpoint": "loginUserIAM"
  }

  constructor(private router: Router, public httpService: ProvideHttpClientService,public simpleAlertService : SimpleAlertService) {
    let payload: any = {
      "username": "admin",
      "password": "password",
      "loginIAM": this.loginIAMMock
    }

    
    if(!this.isFirstCalled && (!this.accessToken || !this.refreshToken || !this.user || this.user._id)) {

      this.httpService.login(payload).subscribe({
        next: (result: any) => {
          this.accessToken = result.accessToken
          this.refreshToken = result.refreshToken
          this.user = result.user
    
          if(this.accessToken) {
            this.user$.next(true)
          }

          if (!this.domande || this.domande.length == 0) {
            let payload: any = {
              "entity": "questions",
              "endpoint": "getQuestionsByDipendente",
              "data": { "id": this.user._id, "currentPage": 0, "itemPerPage": 0, "isPaginated": false }
            }
      
            this.httpService.postData(payload, this.accessToken, this.refreshToken).subscribe((result) => {
                    if (result.statusCode == HTTP_STATUS_CODE.AUTHENTICATION_ERROR) {
        
                      this.simpleAlertService.isOpenedModal=true
                      this.simpleAlertService.message= "Accesso non consentito"
                      // window.location.href = "/login"
                    }
                    this.domande = result.list
                    this.printDomandeRegione = this.domande.filter((domanda: IDomanda) => domanda.state == StateEnum.VERIFICA && domanda.currentStep == 5)

                    this.notification = this.domande.filter((domanda: IDomanda) => domanda.state == StateEnum.DOCUMENTI && domanda.statoAllegati.allegati)
            
            
                    // this.getDomande()
                  })
          }
        },
        error: (err: any) => {
   
          this.simpleAlertService.isOpenedModal=true
          this.simpleAlertService.message= "Errore nella comunicazione con il server"
        }
  
        
      })
    }

    // Inizializza i dati richiesti
    initializeIDomanda(this);
    this.domande = domande;
  }

  navigateToDomanda(row: IDomanda) {
    this.selectedRow = row;
    this.router.navigate(['/dettaglio-domanda/' + row._id]);
  }
}
