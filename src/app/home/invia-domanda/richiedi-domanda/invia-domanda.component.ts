import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../session.service';
import { IDomanda, StateEnum } from '../../../interfaces/dati-richiesti.interface';
import { InputFileButtonComponent } from '../../../shared/input-file-button/input-file-button.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { faChevronDown, faCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChipsComponent } from '../../../shared/chips/chips.component';
import { ExpandableSectionComponent } from '../../../shared/expandable-section/expandable-section.component';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

import { FormGroup, FormControl, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { PROVINCE, REGEX_ALPHABETIC_TEXT, REGEX_CAP, REGEX_CF, REGEX_CONTRIBUTO, REGEX_DATE_FORMAT, REGEX_EMAIL, REGEX_PHONE_NUMBER, REGEX_ROMAN_NUMBER } from '../../../utils/const';
import { ProvideHttpClientService } from '../../../services/provide-http-client.service';
import { resolve } from 'node:path';
import { HttpStatusCode } from '@angular/common/http';
import { HTTP_STATUS_CODE } from '../../../../../ssr-utils/http.code';
import { Subject } from 'rxjs';
import { InviaDomandaStatusStepComponent } from '../../../shared/invia-domanda-status-step/invia-domanda-status-step.component';
import { SimpleAlertService } from '../../../shared/simple-alert/simple-alert.service';

@Component({
  selector: 'app-invia-domanda',
  imports: [
    CommonModule,
    InputFileButtonComponent,
    ButtonComponent,
    FontAwesomeModule,
    ChipsComponent,
    ExpandableSectionComponent,
    BreadcrumbComponent,
    ReactiveFormsModule,
    InviaDomandaStatusStepComponent
  ],
  templateUrl: './invia-domanda.component.html',
  styleUrls: ['./invia-domanda.component.scss'],
  standalone: true

})

//da rimettere implements OnInit
export class InviaDomandaComponent {

  isCallingServer = false

  createDomandaWithAllegati$ = new Subject()

  faChevronDown = faChevronDown;
  faCircleDown = faCircleDown;
  //dataAggiornamentoTemplate: string = '10/10/2018';
  inputFiles: File[] | any[] = [];

  domandaStateEnum = DomandaStateEnum

  breadcrumbs = [
    { label: 'Home', url: '/' },
    { label: 'Servizi online', url: '#' },
    { label: 'Legge 13/89', url: '#' },
    { label: 'Dettaglio domanda', url: '#' },
  ];

  province = PROVINCE

  //selectedRow: IDomanda | null | any = null;
  //form: FormGroup | any;

  campoObbligatorioMessage: string = "Campo obbligatorio.";
  isServoScalaValid: boolean = true;
  isAscensoreValid: boolean = true;
  isL_non_pubblicaValid: boolean = true;
  isM_non_futura_residenzaValid: boolean = true;
  isN_approvate_condominioValid: boolean = true;
  isO_dichiarazioni_veritiereValid: boolean = true;
  isP_acceptance_privacyValid: boolean = true
  isP_acceptance_privacyDisabled = true

  currentStep: number = 1;

  constructor(public sessionService: SessionService,
    public simpleAlertService : SimpleAlertService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: ProvideHttpClientService) {
    this.sessionService.user$.subscribe((result) => {
      if (result) {
        this.form = this.initForm()
      }
    })

  }

  //TEST DA CANCELLARE


  backToRichiestaDomanda() {
    this.router.navigateByUrl('/dashboard');
    window.scrollTo(0, 0);
  }
  form: any = this.initForm()


  initForm() {
    return new FormGroup({
      richiedente: new FormGroup({
        firstNameRichiedente: new FormControl(
          { value: this.sessionService.user?.firstName, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        lastNameRichiedente: new FormControl(
          { value: this.sessionService.user?.lastName, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        birthDayRichiedente: new FormControl(
          { value: this.sessionService.user?.birthDay, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_DATE_FORMAT),
          ]
        ),
        birthPlaceRichiedente: new FormControl(
          { value: this.sessionService.user?.birthPlace, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        birthProvinceRichiedente: new FormControl(
          { value: this.sessionService.user?.birthProvince, disabled: false },
          [
            Validators.required,
          ]
        ),
        residentInRichiedente: new FormControl(
          { value: this.sessionService.user?.residentIn, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        residentStreetRichiedente: new FormControl(
          { value: this.sessionService.user?.residentStreet, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        residentCivicRichiedente: new FormControl(
          { value: this.sessionService.user?.residentCivic, disabled: false },
          [
            Validators.required,
            // Validators.pattern(/^\d{1,4}(\s?[A-Za-z]{1,4}(\/\w{1,2})?)?$/),
          ]
        ),
        residenceCapRichiedente: new FormControl(
          { value: this.sessionService.user?.residenceCap, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_CAP),
          ]
        ),
        townHallRichiedente: new FormControl(
          { value: this.sessionService.user?.townHall, disabled: false },
          [
            // Validators.required,
            Validators.pattern(REGEX_ROMAN_NUMBER),
          ]
        ),
        emailRichiedente: new FormControl(
          { value: this.sessionService.user?.email, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_EMAIL),
          ]
        ),
        pecRichiedente: new FormControl(
          { value: this.sessionService.user?.pec, disabled: false },
          [
            // Validators.required,
            Validators.pattern(REGEX_EMAIL),
          ]
        ),
        cfRichiedente: new FormControl(
          { value: this.sessionService.user?.cf, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_CF),
          ]
        ),
        phoneNumberRichiedente: new FormControl(
          { value: this.sessionService.user?.phoneNumber, disabled: false },
          [
            Validators.required,
            Validators.pattern(REGEX_PHONE_NUMBER),
          ]
        ),
      },
        { updateOn: "blur" }),
      beneficiario: new FormGroup({
        isRichiedente: new FormControl(
          false
        ),
        firstNameBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        lastNameBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        birthDayBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_DATE_FORMAT),
          ]
        ),
        birthPlaceBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        birthProvinceBeneficiario: new FormControl(
          "",
          [
            Validators.required,
          ]
        ),
        residentInBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        residentStreetBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_ALPHABETIC_TEXT),
          ]
        ),
        residentCivicBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            // Validators.pattern(/^\d{1,4}(\s?[A-Za-z]{1,4}(\/\w{1,2})?)?$/),
          ]
        ),
        residenceCapBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_CAP),
          ]
        ),
        townHallBeneficiario: new FormControl(
          "",
          [
            // Validators.required,
            Validators.pattern(REGEX_ROMAN_NUMBER),
          ]
        ),
        emailBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_EMAIL),
          ]
        ),
        pecBeneficiario: new FormControl(
          "",
          [
            // Validators.required,
            Validators.pattern(REGEX_EMAIL),
          ]
        ),
        cfBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_CF),
          ]
        ),
        phoneNumberBeneficiario: new FormControl(
          "",
          [
            Validators.required,
            Validators.pattern(REGEX_PHONE_NUMBER),
          ]
        ),
      }, { updateOn: "blur" }),
      generalitaLavori: new FormGroup({

        contributo: new FormControl(

          "",
          [
            Validators.required,
            Validators.pattern(REGEX_CONTRIBUTO),
          ]
        ),

        rampaAccesso: new FormControl(
          false
        ),
        servoscala: new FormControl(
          false
        ),
        piattaforma: new FormControl(
          false
        ),
        poltroncina: new FormControl(
          false
        ),
        piattaformaElevatore: new FormControl(
          false
        ),
        ascensore: new FormControl(
          false
        ),
        installazipne: new FormControl(
          false
        ),
        adeguamento: new FormControl(
          false
        ),
        ampliamentoPorteIngresso: new FormControl(
          false
        ),
        adeguamentoPercorsiOrizzontali: new FormControl(
          false
        ),
        installazioneDispositiviPer_non_vedenti: new FormControl(
          false
        ),
        installazioneDispositiviPerPorta: new FormControl(
          false
        ),
        acquistoBenePerImpedimenti: new FormControl(
          false
        ),
        altro: new FormControl(
          false
        ),
        text: new FormControl(
          { value: "", disabled: true }
        ),
        adeguamentoSpaziInterniAlloggio: new FormControl(
          false
        ),
        adeguamentoPercorsiOrizzontaliFruibilita: new FormControl(
          false
        ),
        altroFruibilita: new FormControl(
          false
        ),
        textFruibilita: new FormControl(
          { value: "", disabled: true }
        ),
      }, { updateOn: "blur" }),
      dichiara: new FormGroup({
        potestaTutela: new FormControl(
          false
        ),
        aCaricoPortatoHandicap: new FormControl(
          false
        ),
        unicoProprietario: new FormControl(
          false
        ),

        amministratoreCondominioCheck: new FormControl(
          false
        ),
        amministratoreCondominio: new FormControl(
          { value: "", disabled: true }
        ),
        amministratoreCondominioRecapito: new FormControl(
          { value: "", disabled: true }
        ),
        responsabileCentroIstituto: new FormControl(
          false
        ),
        B_barriereArchitettonicheCheck: new FormControl(
          false
        ),
        B_barriereArchitettonicheDescrizione: new FormControl(
          { value: "", disabled: true }
        ),
        C_difficoltaCheck: new FormControl(
          false
        ),
        C_difficoltaDescrizione: new FormControl(
          { value: "", disabled: true }
        ),
        D_operePerRimuovereOstacoliCheck: new FormControl(
          false
        ),
        D_operePerRimuovereOstacoliDescrizione: new FormControl(
          { value: "", disabled: true }
        ),

        E_opereNonEsistenzaOInEsecuzione: new FormControl(
          false
        ),
        F_realizzazione: new FormControl(
          false
        ),
        G_rispetto_normative: new FormControl(
          false
        ),
        H_regolare_licenza_ediliziaCheck: new FormControl(
          false
        ),
        H_regolare_licenza_ediliziaNumero: new FormControl(
          { value: "", disabled: true }
        ),
        H_regolare_licenza_ediliziaData: new FormControl(
          { value: "", disabled: true },
          [
            Validators.pattern(REGEX_DATE_FORMAT),
          ]
        ),
        I_concessione_in_sanatoriaCheck: new FormControl(
          false
        ),
        I_concessione_in_sanatoriaNumero: new FormControl(
          { value: "", disabled: true }
        ),
        I_concessione_in_sanatoriaData: new FormControl(
          { value: "", disabled: true },
          [
            Validators.pattern(REGEX_DATE_FORMAT),
          ]
        ),
        L_non_pbblica: new FormControl(
          false
        ),
        M_non_futura_residenza: new FormControl(
          false
        ),
        N_approvate_condominio: new FormControl(
          false
        ),
        O_dichiarazioni_veritiere: new FormControl(
          false
        ),
        P_acceptance_privacy: new FormControl(
          false
        ),
      }),
    },
    )
    //FINE TEST DA CANCELLARE
  }


  ngOnInit(): void {
    this.createDomandaWithAllegati$.subscribe((result: any) => {
      let data: any = result[0]
      let allegati: any = result[1]

      data["allegati"] = allegati
      let payload = {
        "user": {
          "_id": this.sessionService.user?._id
        },
        "data": data,
        "entity": "questions",
        "endpoint": "updateQuestionById", //la domanda è stata creata per cui deve aggiornare essa
      }

      //Rieffettuo l'operazione dopo aver caricato tutti gli allegati
      this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe(async (response: any) => {
        this.isCallingServer = false
        if (response.code == HttpStatusCode.Ok || response.code == HttpStatusCode.NotModified) {
          if (data.state == StateEnum.BOZZA) {
           
              this.simpleAlertService.isOpenedModal=true
              this.simpleAlertService.message= "La bozza della domanda è stata aggiornata"
          } else if(data.state == StateEnum.VERIFICA) {
            
              this.simpleAlertService.isOpenedModal=true
              this.simpleAlertService.message= "La domanda è stata inviata"
          }
          window.location.href = "/dashboard"
        } else {
          if (data.state == StateEnum.BOZZA) {
         
              this.simpleAlertService.isOpenedModal=true
              this.simpleAlertService.message= "La bozza della domanda non è stata aggiornata. Riprova oppure contattare l'assistenza."
          } else if(data.state == StateEnum.VERIFICA) {
           
              this.simpleAlertService.isOpenedModal=true
              this.simpleAlertService.message= "La bozza della domanda non è stata inviata. Riprova oppure contattare l'assistenza."  
          }
        }
      })
    })
  }

  ngAfterViewInit() {

  }

  isDisabledFieldGeneralitaLavori(controlNameTextArea: string) {
    let result: any
    if (!(this.form.controls['generalitaLavori'] as any).controls[controlNameTextArea].disabled) {

      result = true
    } else {
      (this.form.controls['generalitaLavori'] as any).controls[controlNameTextArea].setValue("")
    }
    //console.log(result)
    return result
  }

  toggleEditFieldGeneralitaLavori(event: any, controlNameCheck: string, controlNameTextArea: string) {

    (this.form.controls['generalitaLavori'] as any).controls[controlNameCheck].setValue(event.target.checked)
    if ((this.form.controls['generalitaLavori'] as any).controls[controlNameCheck].getRawValue()) {
      (this.form.controls['generalitaLavori'] as any).controls[controlNameTextArea].enable()
    } else {
      // (this.form.controls['generalitaLavori']).controls ['text'].setValue("")
      (this.form.controls['generalitaLavori'] as any).controls[controlNameTextArea].disable()
    }

  }

  toggleEditField(groupName: string, controlName: string | string[], conditionField: string) {

    const groupControls = this.form.controls[groupName].controls
    if (groupControls) {

      const conditionValue = groupControls[conditionField].getRawValue()
      const controlsName = Array.isArray(controlName) ? controlName : [controlName]
      console.log(controlsName)
      controlsName.forEach(controlName => {
        const targetControl = groupControls[controlName]
        if (!targetControl) {
          return
        }
        if (conditionValue) {
          targetControl.enable()
        } else {
          targetControl.disable()
          targetControl.setValue("")
        }
      })
    }
  }

  onCheckboxChange(event: any) {
    const isChecked = event.target.checked;
    this.form?.controls['beneficiario'].get('isRichiedente')?.setValue(isChecked);
    this.toggleEditRichiedente();
  }


  toggleEditRichiedente() {

    const richiedenteValues = (this.form?.controls['richiedente'] as any).getRawValue();
    const beneficiarioControls = (this.form?.controls['beneficiario'] as any).controls;

    if ((this.form?.controls['beneficiario'] as any).controls['isRichiedente'].getRawValue()) {
      for (let fieldRaw of Object.keys(richiedenteValues)) {
        if (typeof fieldRaw === 'string') {
          const field = fieldRaw.replace('Richiedente', 'Beneficiario');
          beneficiarioControls[field]?.setValue(richiedenteValues[fieldRaw]);
        }
      }
    } else {
      for (let fieldRaw of Object.keys(richiedenteValues)) {
        console.log('no-check')
        if (typeof fieldRaw === 'string') {
          const field = fieldRaw.replace('Richiedente', 'Beneficiario');
          beneficiarioControls[field]?.setValue('');
        }
      }
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      window.scrollTo(0, 0);
    }
  }

  nextStep() {
    if (this.currentStep < 5) {
      this.currentStep++;
      window.scrollTo(0, 0);
    }
  }


  uploadAllAllegati(index: number, data: any, allegati: any[]) {
    let allegatoRaw = this.inputFiles[index]
    if (allegatoRaw && !allegatoRaw._id) {
      let payload: any = {
        "entity": "questions",
        "endpoint": "uploadAllegatoDomanda",
        "data": {
          "questionId": data["_id"],
          "allegato": allegatoRaw
        }

      }
      this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe((response: any) => {
        allegati.push(response[0])

        if (index == this.inputFiles.length - 1) {
          this.createDomandaWithAllegati$.next([data, allegati])
        } else {
          this.uploadAllAllegati(index + 1, data, allegati)
        }

      })
    } else if (allegatoRaw && allegatoRaw._id) {
      allegati.push(allegatoRaw)
      if (index == this.inputFiles.length - 1) {
        this.createDomandaWithAllegati$.next([data, allegati])
      } else {
        this.uploadAllAllegati(index + 1, data, allegati)
      }
    }

    if (this.inputFiles.length == 0) {
      allegati = []
      this.createDomandaWithAllegati$.next([data, allegati])

    }

  }

  isValidAttachment() {
    let result = false

    if (this.inputFiles) {
      let isUploadedCertificatoASL = this.inputFiles.filter((inputFile: any) => inputFile.name == "certificato_invalidita_deambulazione_cecita_totale" || inputFile.name == "certificato_invalidita_parziale").length > 0
      let isUploadedIDCard = this.inputFiles.filter((inputFile: any) => inputFile.name == "documento_identita").length > 0
      let isUploadedPreventivo = this.inputFiles.filter((inputFile: any) => inputFile.name == "preventivo_spesa_dettaglio_opere").length > 0
      let isUploadedVerbaleAssemblea = this.inputFiles.filter((inputFile: any) => inputFile.name == "verbale_assemblea_condominiale").length > 0
      let isUploadedMarcaDaBollo = this.inputFiles.filter((inputFile: any) => inputFile.name == "ricevuta_marca_da_bollo").length > 0

      result = isUploadedCertificatoASL && isUploadedIDCard && isUploadedPreventivo && isUploadedVerbaleAssemblea && isUploadedMarcaDaBollo
    }

    return result
  }

  isValidForm(data: any) {
    this.isServoScalaValid = data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["servoscala"].isChecked ? data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["servoscala"]["piattaforma"].isChecked || data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["servoscala"]["poltroncina"].isChecked : true
    this.isAscensoreValid = data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["ascensore"].isChecked ? data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["ascensore"]["installazipne"].isChecked || data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["ascensore"]["adeguamento"].isChecked : true

    this.isL_non_pubblicaValid = data["dichiara"]["L_non_pbblica"].isChecked == true
    this.isM_non_futura_residenzaValid = data["dichiara"]["M_non_futura_residenza"].isChecked == true
    this.isN_approvate_condominioValid = data["dichiara"]["N_approvate_condominio"].isChecked == true
    this.isO_dichiarazioni_veritiereValid = data["dichiara"]["O_dichiarazioni_veritiere"].isChecked == true
    this.isP_acceptance_privacyValid = data["dichiara"]["P_acceptance_privacy"].isChecked == true

    return this.form?.valid && this.isServoScalaValid && this.isAscensoreValid && this.isL_non_pubblicaValid && this.isM_non_futura_residenzaValid && this.isO_dichiarazioni_veritiereValid && this.isP_acceptance_privacyValid
  }

  getFile(file: any, name: string) {
    if (file) {
      file["name"] = name
      console.log(file);

      if (this.inputFiles.filter((inputFile: any) => inputFile.name == name).length == 0) this.inputFiles.push(file);
    } else {
      this.inputFiles = this.inputFiles.filter((inputFile: any) => inputFile.name != name)
    }
  }

  removeAllOccurrences(inputString: string, targetWord: string) {
    // Escapare il target per i caratteri speciali e creare un'espressione regolare globale
    const escapedTarget = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedTarget, 'g'); // Flag 'g' per tutte le occorrenze

    return JSON.parse(inputString.replace(regex, ''))
  }


  createDomanda(state?: string) {
    let data: any = this.form?.getRawValue()
    data["richiedente"]["_id"] = this.sessionService.user?._id
    // data["beneficiario"]["_id"] = this.selectedRow!.beneficiario._id //TODO: user._id

    data = this.removeAllOccurrences(JSON.stringify(data), "Beneficiario")
    data = this.removeAllOccurrences(JSON.stringify(data), "Richiedente")

    data["date"] = new Date()

    data["generalitaLavori"] = {
      "contributo": data["generalitaLavori"]["contributo"],
      "accessoImmobileSingolaUnitaImmobiliare": {
        "rampaAccesso": {
          "isChecked": data["generalitaLavori"]["rampaAccesso"]
        },
        "servoscala": {
          "isChecked": data["generalitaLavori"]["servoscala"],
          "piattaforma": {
            "isChecked": data["generalitaLavori"]["piattaforma"]
          },
          "poltroncina": {
            "isChecked": data["generalitaLavori"]["poltroncina"]
          }
        },
        "piattaformaElevatore": {
          "isChecked": data["generalitaLavori"]["piattaformaElevatore"]
        },
        "ascensore": {
          "isChecked": data["generalitaLavori"]["ascensore"],
          "installazipne": {
            "isChecked": data["generalitaLavori"]["installazipne"]
          },
          "adeguamento": {
            "isChecked": data["generalitaLavori"]["adeguamento"]
          }
        },
        "ampliamentoPorteIngresso": {
          "isChecked": data["generalitaLavori"]["ampliamentoPorteIngresso"]
        },
        "adeguamentoPercorsiOrizzontali": {
          "isChecked": data["generalitaLavori"]["adeguamentoPercorsiOrizzontali"]
        },
        "installazioneDispositiviPer_non_vedenti": {
          "isChecked": data["generalitaLavori"]["installazioneDispositiviPer_non_vedenti"]
        },
        "installazioneDispositiviPerPorta": {
          "isChecked": data["generalitaLavori"]["installazioneDispositiviPerPorta"]
        },
        "acquistoBenePerImpedimenti": {
          "isChecked": data["generalitaLavori"]["acquistoBenePerImpedimenti"]
        },
        "altro": {
          "isChecked": data["generalitaLavori"]["altro"],
          "text": data["generalitaLavori"]["text"]
        }
      },
      "fruibilitaVisitabilitaAlloggio": {
        "adeguamentoSpaziInterniAlloggio": {
          "isChecked": data["generalitaLavori"]["adeguamentoSpaziInterniAlloggio"]
        },
        "adeguamentoPercorsiOrizzontali": {
          "isChecked": data["generalitaLavori"]["adeguamentoPercorsiOrizzontali"]
        },
        "altro": {
          "isChecked": data["generalitaLavori"]["altroFruibilita"],
          "text": data["generalitaLavori"]["textFruibilita"]
        }
      }

    }
    data["dichiara"] = {
      "isRichiedente": {
        "isChecked": data["dichiara"]["isRichiedente"]
      },
      "inQualitaDi": {
        "potestaTutela": {
          "isChecked": data["dichiara"]["potestaTutela"]
        },
        "aCaricoPortatoHandicap": {
          "isChecked": data["dichiara"]["aCaricoPortatoHandicap"]
        },
        "unicoProprietario": {
          "isChecked": data["dichiara"]["unicoProprietario"]
        },
        "amministratoreCondominio": {
          "isChecked": data["dichiara"]["amministratoreCondominioCheck"],
          "condominio": data["dichiara"]["amministratoreCondominio"],
          "recapito": data["dichiara"]["amministratoreCondominioRecapito"]
        },
        "responsabileCentroIstituto": {
          "isChecked": data["dichiara"]["responsabileCentroIstituto"]
        }
      },
      "B_barriereArchitettoniche": {
        "isChecked": data["dichiara"]["B_barriereArchitettonicheCheck"],
        "descrizione": data["dichiara"]["B_barriereArchitettonicheDescrizione"]
      },
      "C_difficolta": {
        "isChecked": data["dichiara"]["C_difficoltaCheck"],
        "descrizione": data["dichiara"]["C_difficoltaDescrizione"]
      },
      "D_operePerRimuovereOstacoli": {
        "isChecked": data["dichiara"]["D_operePerRimuovereOstacoliCheck"],
        "descrizione": data["dichiara"]["D_operePerRimuovereOstacoliDescrizione"]
      },
      "E_opereNonEsistenzaOInEsecuzione": {
        "isChecked": data["dichiara"]["E_opereNonEsistenzaOInEsecuzione"]
      },
      "F_realizzazione": {
        "isChecked": data["dichiara"]["F_realizzazione"]
      },
      "G_rispetto_normative": {
        "isChecked": data["dichiara"]["G_rispetto_normative"]
      },
      "H_regolare_licenza_edilizia": {
        "isChecked": data["dichiara"]["H_regolare_licenza_ediliziaCheck"],
        "numero": data["dichiara"]["H_regolare_licenza_ediliziaNumero"],
        "del": data["dichiara"]["H_regolare_licenza_ediliziaData"]
      },
      "I_concessione_in_sanatoria": {
        "isChecked": data["dichiara"]["I_concessione_in_sanatoriaCheck"],
        "numero": data["dichiara"]["I_concessione_in_sanatoriaNumero"],
        "del": data["dichiara"]["I_concessione_in_sanatoriaData"]
      },
      "L_non_pbblica": {
        "isChecked": data["dichiara"]["L_non_pbblica"]
      },
      "M_non_futura_residenza": {
        "isChecked": data["dichiara"]["M_non_futura_residenza"]
      },
      "N_approvate_condominio": {
        "isChecked": data["dichiara"]["N_approvate_condominio"]
      },
      "O_dichiarazioni_veritiere": {
        "isChecked": data["dichiara"]["O_dichiarazioni_veritiere"]
      },
      "P_acceptance_privacy": {
        "isChecked": data["dichiara"]["P_acceptance_privacy"]
      },
    }

    if (state) data["state"] = state


    if (state == StateEnum.VERIFICA && !this.isValidAttachment()) {
     
      this.simpleAlertService.isOpenedModal=true
      this.simpleAlertService.message= "Inserire i documenti obbligatori: certificato di invalidità totale o parziale, documento di identità, verbale dell'assemblea, ricevuta pagamento bollo."
    } else if (this.isValidForm(data)) {

      this.isCallingServer = true

      let payload = {
        "user": {
          "_id": this.sessionService.user?._id
        },
        "data": data,
        "entity": "questions",
        "endpoint": "createQuestion",
      }

      this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe(async (response: any) => {
        if (response._id) {

          let allegati: File[] = []

          data = response
          this.uploadAllAllegati(0, data, allegati)


        } else {
        this.simpleAlertService.isOpenedModal=true
        this.simpleAlertService.message= "La bozza della domanda non è stata aggiornata. Riprova oppure contattare l'assistenza."
        }
      })
    } else {

      this.simpleAlertService.isOpenedModal=true
      this.simpleAlertService.message= "La bozza della domanda non è stata aggiornata. Controllare di aver compilato correttamente la domanda."
   
    }
  }

  downloadFile(moduleNameChecked: string) {
    let filename = ""
    if (moduleNameChecked == "isCheckedModuliIstruttoria") {
      filename = "privacy"
      this.isP_acceptance_privacyDisabled = false
    }


    let data: any = {}
    data[moduleNameChecked] = true


    let payload = {
      "user": {
        "_id": this.sessionService.user._id
      },
      "data": data,
      "entity": "questions",
      "endpoint": "downloadAttachment",
    }

    //Rieffettuo l'operazione dopo aver caricato tutti gli allegati
    this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe(async (response: any) => {
      const byteCharacters = atob(response.base64); // Decode Base64
      const byteNumbers = Array.from(byteCharacters).map(char => char.charCodeAt(0));
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' }); // Change type based on file format

      // Create a URL for the Blob and trigger download
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Revoke the object URL to free up memory
      URL.revokeObjectURL(blobUrl);
    })
  }


}





export enum DomandaStateEnum {
  APPROVATA = "Approvata",
  BOZZA = "Bozza",
  VERIFICA = "Verifica",
  DOCUMENTI = "Documenti",
  RESPINTA = "Respinta"
}