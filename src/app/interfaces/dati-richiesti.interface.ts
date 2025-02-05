export enum StateEnum {
  APPROVATA = 'Approvata',
  VERIFICA = 'Verifica',
  RESPINTA = 'Respinta',
  DOCUMENTI = 'Documenti',
  BOZZA = 'Bozza',
  INVIO = 'Inviata',
}

export interface IUser {
  _id: string
  firstName: string;
  lastName: string;
  birthDay: string;
  birthPlace: string;
  birthProvince: string;
  residentIn: string;
  residentStreet: string;
  residentCivic: string;
  residenceCap: string;
  townHall: string;
  email: string;
  pec: string;
  cf: string;
  phoneNumber: string;
  inQualitaDi?: any;
}

export interface IDomanda {
  currentStep?: number;
  _id?: string,
  id: number;
  isSelected: boolean;
  beneficiario: IUser;
  richiedente: IUser;
  generalitaLavori: {
    contributo: number;
    accessoImmobileSingolaUnitaImmobiliare: {
      rampaAccesso: {
        isChecked: boolean;
      };
      servoscala: {
        isChecked: boolean;
        piattaforma: {
          isChecked: boolean;
        };
        poltroncina: {
          isChecked: boolean;
        };
      };
      piattaformaElevatore: {
        isChecked: boolean;
      };
      ascensore: {
        isChecked: boolean;
        //correggere installazione sul BE
        installazipne: {
          isChecked: boolean;
        };
        adeguamento: {
          isChecked: boolean;
        };
      };
      ampliamentoPorteIngresso: {
        isChecked: boolean;
      };
      adeguamentoPercorsiOrizzontali: {
        isChecked: boolean;
      };
      installazioneDispositiviPer_non_vedenti: {
        isChecked: boolean;
      };
      installazioneDispositiviPerPorta: {
        isChecked: boolean;
      };
      acquistoBenePerImpedimenti: {
        isChecked: boolean;
      };
      altro: {
        isChecked: boolean;
        text: string;
      };
    };
    fruibilitaVisitabilitaAlloggio: {
      adeguamentoSpaziInterniAlloggio: {
        isChecked: boolean;
      };
      adeguamentoPercorsiOrizzontali: {
        isChecked: boolean;
      };
      altro: {
        isChecked: boolean;
        text: string;
      };
    };
  };
  dichiara: {
    isRichiedente: {
      isChecked: boolean;
    };
    inQualitaDi: {
      potestaTutela: {
        isChecked: boolean;
      };
      aCaricoPortatoHandicap: {
        isChecked: boolean;
      };
      unicoProprietario: {
        isChecked: boolean;
      };
      amministratoreCondominio: {
        isChecked: boolean;
        condominio: string;
        recapito: string;
      };
      responsabileCentroIstituto: {
        isChecked: boolean;
      };
    };
    B_barriereArchitettoniche: {
      isChecked: boolean;
      descrizione: string;
    };
    C_difficolta: {
      isChecked: boolean;
      descrizione: string;
    };
    D_operePerRimuovereOstacoli: {
      isChecked: boolean;
      descrizione: string;
    };
    E_opereNonEsistenzaOInEsecuzione: {
      isChecked: boolean;
    };
    F_realizzazione: {
      isChecked: boolean;
    };
    G_rispetto_normative: {
      isChecked: boolean;
    };
    H_regolare_licenza_edilizia: {
      isChecked: boolean;
      numero: string;
      del: string;
    };
    I_concessione_in_sanatoria: {
      isChecked: boolean;
      numero: string;
      del: string;
    };
    L_non_pbblica: {
      isChecked: boolean;
    };
    M_non_futura_residenza: {
      isChecked: boolean;
    };
    N_approvate_condominio: {
      isChecked: boolean;
    };
    O_dichiarazioni_veritiere: {
      isChecked: boolean;
    };
    P_acceptance_privacy: {
      isChecked: boolean;
    };
  };
  gedLog: [
    {
        http_code: string,
        data: {
            apiWsResponse: {
                errorCode: string,
                errorMessage: string;
            },
            listaNumeroProtocollo: [
                {
                    tipoProtocollo: string,
                    annoProtocollo: number,
                    progressivoProtocollo: string,
                    dataProtocollo: number,
                    oraProtocollo: number,
                    codiceMittente: string
                }
            ]
        }
    }
],
statoAllegati: {
    allegati: any[];
    value: string,
    note: string,
    templste: any
},
priorita: string;
  date: Date;
  import: number;
  state: StateEnum;
  note: string;
  isVisible: boolean;
  descrizione: string;
}
