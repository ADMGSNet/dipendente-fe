import { CommonModule } from '@angular/common';
import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SessionService } from '../../../session.service';
import { IDomanda, StateEnum } from '../../../interfaces/dati-richiesti.interface';
import { InputFileButtonComponent } from '../../../shared/input-file-button/input-file-button.component';
import { ButtonComponent } from '../../../shared/button/button.component';
import { faChevronDown, faCircleDown, faPaperPlane, faCircleRight, faCircleCheck, faTriangleExclamation, faCircleMinus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChipsComponent } from '../../../shared/chips/chips.component';
import { ExpandableSectionComponent } from '../../../shared/expandable-section/expandable-section.component';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PROVINCE, REGEX_ALPHABETIC_TEXT, REGEX_CAP, REGEX_CF, REGEX_CONTRIBUTO, REGEX_DATE_FORMAT, REGEX_EMAIL, REGEX_PHONE_NUMBER, REGEX_ROMAN_NUMBER } from '../../../utils/const';
import { ProvideHttpClientService } from '../../../services/provide-http-client.service';
import { resolve } from 'node:path';
import { HttpStatusCode } from '@angular/common/http';
import { HTTP_STATUS_CODE } from '../../../../../ssr-utils/http.code';
import { Subject } from 'rxjs';
import { InviaDomandaStatusStepComponent } from '../../../shared/invia-domanda-status-step/invia-domanda-status-step.component';
import { SimpleAlertService } from '../../../shared/simple-alert/simple-alert.service';

@Component({
  selector: 'app-dettaglio-domanda',
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
  templateUrl: './dettaglio-domanda.component.html',
  styleUrls: ['./dettaglio-domanda.component.scss'],
  standalone: true

})
export class DettaglioDomandaComponent implements OnInit {

  isCallingServer = false

  updateDomandaWithAllegati$ = new Subject()

  faCircleMinus = faCircleMinus
  faTriangleExclamation = faTriangleExclamation
  faCircleCheck = faCircleCheck
  faChevronDown = faChevronDown;
  faCircleDown = faCircleDown;
  faCircleRight = faCircleRight;
  faPaperPlane = faPaperPlane
  faCheckCircle = faCheckCircle
  //dataAggiornamentoTemplate: string = '10/10/2018';
  inputFiles: File[] | any[] = [];
  inputFurtherFiles: any[] = [];


  stateDocumentEnum = StateDocumentEnum
  stateDocumentEnumValue = Object.values(StateDocumentEnum)

  prioritaQuestiontEnum = PrioritaQuestiontEnum
  prioritaQuestiontEnumValue = Object.values(PrioritaQuestiontEnum)


  domandaStateEnum = DomandaStateEnum
  notaDocumentRequest: string = ""
  stateDocumentValue: string = StateDocumentEnum.VERIFICATO
  prioritaValue: string = PrioritaQuestiontEnum.ALTA
  graduatoriaValue: any
  isInvalidAttachment: boolean = false

  currentPath = window.location.pathname;
  id = this.currentPath.split('/').pop(); 
 

  breadcrumbs = [
    { label: 'Home', url: 'https://www.comune.roma.it/web/it/home.page?r=n' },
    { label: 'Servizi online', url: 'https://www.comune.roma.it/web/it/servizi.page' },
    { label: 'Dashboard', url: '/dashboard' },
    {label : 'Dettaglio domanda' , url:  `/dettaglio-domanda/${this.id}`}
  ];

  province = PROVINCE

  selectedRow: IDomanda | null | any = null;
  form: FormGroup | any;

  campoObbligatorioMessage: string = "Campo obbligatorio.";
  isServoScalaValid: boolean = true;
  isAscensoreValid: boolean = true;
  isL_non_pubblicaValid: boolean = true;
  isM_non_futura_residenzaValid: boolean = true;
  isN_approvate_condominioValid: boolean = true;
  isO_dichiarazioni_veritiereValid: boolean = true;
  isP_acceptance_privacyValid: boolean = true
  currentStep: number = 1;

  isOpenModalDocumentRequest = false

  isCheckedModuliIstruttoria = false
  isCheckedInvalidAttachment = false

  isP_acceptance_privacyDisabled = true

  get filesWithOffset(): any[] {

    let offset = this.selectedRow && this.selectedRow.furtherAllegati && this.selectedRow.furtherAllegati.length? this.selectedRow.furtherAllegati.length : 0

    return this.inputFurtherFiles.slice(offset);
  }

  constructor(public sessionService: SessionService,
    public simpleAlertService : SimpleAlertService,
    private router: Router,
    private route: ActivatedRoute,
    private httpService: ProvideHttpClientService) {


  }

  ngOnInit(): void {
    this.updateDomandaWithAllegati$.subscribe((result: any) => {
      let data: any = result[0]
      let allegati: any = result[1]

      data["allegati"] = allegati
      let payload = {
        "user": {
          "_id": this.sessionService.user._id
        },
        "data": data,
        "entity": "questions",
        "endpoint": "updateQuestionById",
      }

      //Rieffettuo l'operazione dopo aver caricato tutti gli allegati
      this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe(async (response: any) => {
        this.isCallingServer = false
        if (response.code == HttpStatusCode.Ok || response.code == HttpStatusCode.NotModified) {
        
           this.simpleAlertService.isOpenedModal=true
          this.simpleAlertService.message= "La domanda è stata aggiornata"
          window.location.reload()
        } else {
        
           this.simpleAlertService.isOpenedModal=true
          this.simpleAlertService.message= "La bozza della domanda non è stata aggiornata. Riprova oppure contattare l'assistenza."
        }
      })
    })
  }

  ngAfterViewInit() {
    if (this.sessionService.user && this.sessionService.user._id) {
      this.getData()
    } else {
      this.sessionService.user$.subscribe((result) => {
        if (result) {
          this.getData()
        }
      })
    }
  }

  isDisabledFieldGeneralitaLavori(controlNameTextArea : string){
    let result : any
    if(!(this.form.controls['generalitaLavori']).controls [controlNameTextArea].disabled){

      result= true
    }else{
      (this.form.controls['generalitaLavori']).controls [controlNameTextArea].setValue("")
    }
    //console.log(result)
    return result
  }

  toggleEditFieldGeneralitaLavori(event: any, controlNameCheck: string, controlNameTextArea: string){
  
      if(this.selectedRow){
        (this.form.controls['generalitaLavori']).controls [controlNameCheck].setValue(event.target.checked)
        if((this.form.controls['generalitaLavori']).controls [controlNameCheck].getRawValue()){
          (this.form.controls['generalitaLavori']).controls [controlNameTextArea].enable()
        }else{
          // (this.form.controls['generalitaLavori']).controls ['text'].setValue("")
          (this.form.controls['generalitaLavori']).controls [controlNameTextArea].disable()
        }
      }
   }
  // funziona !!
  //  toggleEditField(groupName :string ,controlName : string , conditionField: string ){

  //     if(this.selectedRow){

  //       const groupControls = (this.form?.controls[groupName] as any )?.controls
  //       if(groupControls){
  //         const conditionValue = groupControls[conditionField]?.getRawValue()
  //         if(conditionValue){
  //           groupControls[controlName]?.enable()
  //         }else{
  //           groupControls[controlName]?.disable()
  //           groupControls[controlName]?.setValue("")
  //         }
  //       }
  //     }
  //  }
  toggleEditField(groupName: string, controlName: string | string[], conditionField: string) {

    if (this.selectedRow) {




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
  }

  onCheckboxChange(event: any) {

    if (this.selectedRow) {
    const isChecked = event.target.checked;
    this.form?.controls['beneficiario'].get('isRichiedente')?.setValue(isChecked);
    this.toggleEditRichiedente();
  }}


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


  getData() {
    let payload: any = {
      "entity": "questions",
      "endpoint": "getQuestionById",
      "data": {
        "id": this.route.snapshot.paramMap.get('id'),
        "userId": this.sessionService.user._id
      },
      "isFiltered": true
    }

    this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe((result: any) => {


      if (result.length == 1) {

        this.selectedRow = this.sessionService.selectedRow = result[0];

        if (this.selectedRow && this.selectedRow["allegati"]) this.inputFiles = this.selectedRow["allegati"]
        if (this.selectedRow && this.selectedRow["statoAllegati"] && this.selectedRow["statoAllegati"]["allegati"] && this.selectedRow["statoAllegati"]["allegati"].length) this.inputFurtherFiles = this.selectedRow["statoAllegati"]["allegati"]
        
        if (this.selectedRow) {
          if(this.selectedRow.priorita) this.prioritaValue = this.selectedRow.priorita
          if(this.selectedRow.graduatoria) this.graduatoriaValue = this.selectedRow.graduatoria


          if(this.selectedRow.currentStep) this.currentStep = this.selectedRow.currentStep;


          this.form = new FormGroup({
            richiedente: new FormGroup({
              firstNameRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.firstName, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              lastNameRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.lastName, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              birthDayRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.birthDay, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_DATE_FORMAT),
                ]
              ),
              birthPlaceRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.birthPlace, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              birthProvinceRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.birthProvince, disabled: true},
                [
                  Validators.required,
                ]
              ),
              residentInRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.residentIn, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              residentStreetRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.residentStreet, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              residentCivicRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.residentCivic, disabled: true},
                [
                  Validators.required,
                  // Validators.pattern(/^\d{1,4}(\s?[A-Za-z]{1,4}(\/\w{1,2})?)?$/),
                ]
              ),
              residenceCapRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.residenceCap, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_CAP),
                ]
              ),
              townHallRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.townHall, disabled: true},
                [
                  // Validators.required,
                  Validators.pattern(REGEX_ROMAN_NUMBER),
                ]
              ),
              emailRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.email, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_EMAIL),
                ]
              ),
              pecRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.pec, disabled: true},
                [
                  // Validators.required,
                  Validators.pattern(REGEX_EMAIL),
                ]
              ),
              cfRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.cf, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_CF),
                ]
              ),
              phoneNumberRichiedente: new FormControl(
                {value: this.selectedRow.richiedente.phoneNumber, disabled: true},
                [
                  Validators.required,
                  Validators.pattern(REGEX_PHONE_NUMBER),
                ]
              ),
            },
              { updateOn: "blur" }),
            beneficiario: new FormGroup({
              isRichiedente: new FormControl(
                {value: this.selectedRow.dichiara.isRichiedente.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},

              ),
              firstNameBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.firstName, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              lastNameBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.lastName, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              birthDayBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.birthDay, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_DATE_FORMAT),
                ]
              ),
              birthPlaceBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.birthPlace, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              birthProvinceBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.birthProvince, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                ]
              ),
              residentInBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.residentIn, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              residentStreetBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.residentStreet, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_ALPHABETIC_TEXT),
                ]
              ),
              residentCivicBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.residentCivic, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  // Validators.pattern(/^\d{1,4}(\s?[A-Za-z]{1,4}(\/\w{1,2})?)?$/),
                ]
              ),
              residenceCapBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.residenceCap, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_CAP),
                ]
              ),
              townHallBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.townHall, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  // Validators.required,
                  Validators.pattern(REGEX_ROMAN_NUMBER),
                ]
              ),
              emailBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.email, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_EMAIL),
                ]
              ),
              pecBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.pec, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  // Validators.required,
                  Validators.pattern(REGEX_EMAIL),
                ]
              ),
              cfBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.cf, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_CF),
                ]
              ),
              phoneNumberBeneficiario: new FormControl(
                {value: this.selectedRow.beneficiario.phoneNumber, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_PHONE_NUMBER),
                ]
              ),
            }, { updateOn: "blur" }),
            generalitaLavori: new FormGroup({
              contributo: new FormControl(
                {value: this.selectedRow.generalitaLavori.contributo, disabled: this.selectedRow.state != StateEnum.BOZZA},
                [
                  Validators.required,
                  Validators.pattern(REGEX_CONTRIBUTO),
                ]
              ),
              rampaAccesso: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.rampaAccesso.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              servoscala: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.servoscala.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              piattaforma: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.servoscala.piattaforma.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              poltroncina: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.servoscala.poltroncina.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              piattaformaElevatore: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.piattaformaElevatore.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              ascensore: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.ascensore.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              installazipne: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.ascensore.installazipne.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              adeguamento: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.ascensore.adeguamento.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              ampliamentoPorteIngresso: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.ampliamentoPorteIngresso.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              adeguamentoPercorsiOrizzontali: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.adeguamentoPercorsiOrizzontali.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              installazioneDispositiviPer_non_vedenti: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.installazioneDispositiviPer_non_vedenti.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              installazioneDispositiviPerPorta: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.installazioneDispositiviPerPorta.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              acquistoBenePerImpedimenti: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.acquistoBenePerImpedimenti.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              altro: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.altro.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              text: new FormControl(
                {value: this.selectedRow.generalitaLavori.accessoImmobileSingolaUnitaImmobiliare.altro.text, disabled: this.selectedRow.state != StateEnum.BOZZA},

              ),
              adeguamentoSpaziInterniAlloggio: new FormControl(
                {value: this.selectedRow.generalitaLavori.fruibilitaVisitabilitaAlloggio.adeguamentoSpaziInterniAlloggio.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},

              ),
              adeguamentoPercorsiOrizzontaliFruibilita: new FormControl(
                {value: this.selectedRow.generalitaLavori.fruibilitaVisitabilitaAlloggio.adeguamentoPercorsiOrizzontali.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              altroFruibilita: new FormControl(
                {value: this.selectedRow.generalitaLavori.fruibilitaVisitabilitaAlloggio.altro.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              textFruibilita: new FormControl(
                {value: this.selectedRow.generalitaLavori.fruibilitaVisitabilitaAlloggio.altro.text, disabled: this.selectedRow.state != StateEnum.BOZZA},

              ),
            }, { updateOn: "blur" }),
            dichiara: new FormGroup({
              potestaTutela: new FormControl(
                {value: this.selectedRow.dichiara.inQualitaDi.potestaTutela.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              aCaricoPortatoHandicap: new FormControl(
                {value: this.selectedRow.dichiara.inQualitaDi.aCaricoPortatoHandicap.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              unicoProprietario: new FormControl(
                {value: this.selectedRow.dichiara.inQualitaDi.unicoProprietario.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),

              amministratoreCondominioCheck: new FormControl(
                {value: this.selectedRow.dichiara.inQualitaDi.amministratoreCondominio.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              amministratoreCondominio: new FormControl(
                {value: this.selectedRow.dichiara.inQualitaDi.amministratoreCondominio.condominio, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              amministratoreCondominioRecapito: new FormControl(
                {value: this.selectedRow.dichiara.inQualitaDi.amministratoreCondominio.recapito, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              responsabileCentroIstituto: new FormControl(
                {value: this.selectedRow.dichiara.inQualitaDi.responsabileCentroIstituto.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              B_barriereArchitettonicheCheck: new FormControl(
                {value: this.selectedRow.dichiara.B_barriereArchitettoniche.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},

              ),
              B_barriereArchitettonicheDescrizione: new FormControl(
                {value: this.selectedRow.dichiara.B_barriereArchitettoniche.descrizione, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              C_difficoltaCheck: new FormControl(
                {value: this.selectedRow.dichiara.C_difficolta.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},

              ),
              C_difficoltaDescrizione: new FormControl(
                {value: this.selectedRow.dichiara.C_difficolta.descrizione, disabled: this.selectedRow.state != StateEnum.BOZZA},

              ),
              D_operePerRimuovereOstacoliCheck: new FormControl(
                {value: this.selectedRow.dichiara.D_operePerRimuovereOstacoli.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              D_operePerRimuovereOstacoliDescrizione: new FormControl(
                {value: this.selectedRow.dichiara.D_operePerRimuovereOstacoli.descrizione, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),

              E_opereNonEsistenzaOInEsecuzione: new FormControl(
                {value: this.selectedRow.dichiara.E_opereNonEsistenzaOInEsecuzione.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},

              ),
              F_realizzazione: new FormControl(
                {value: this.selectedRow.dichiara.F_realizzazione.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              G_rispetto_normative: new FormControl(
                {value: this.selectedRow.dichiara.G_rispetto_normative.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              H_regolare_licenza_ediliziaCheck: new FormControl(
                {value: this.selectedRow.dichiara.H_regolare_licenza_edilizia.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              H_regolare_licenza_ediliziaNumero: new FormControl(
                {value: this.selectedRow.dichiara.H_regolare_licenza_edilizia.numero, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              H_regolare_licenza_ediliziaData: new FormControl(
                {value: this.selectedRow.dichiara.H_regolare_licenza_edilizia.del, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              I_concessione_in_sanatoriaCheck: new FormControl(
                {value: this.selectedRow.dichiara.I_concessione_in_sanatoria.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              I_concessione_in_sanatoriaNumero: new FormControl(
                {value: this.selectedRow.dichiara.I_concessione_in_sanatoria.numero, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              I_concessione_in_sanatoriaData: new FormControl(
                {value: this.selectedRow.dichiara.I_concessione_in_sanatoria.del, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              L_non_pbblica: new FormControl(
                {value: this.selectedRow.dichiara.L_non_pbblica.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              M_non_futura_residenza: new FormControl(
                {value: this.selectedRow.dichiara.M_non_futura_residenza.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              N_approvate_condominio: new FormControl(
                {value: this.selectedRow.dichiara.N_approvate_condominio.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              O_dichiarazioni_veritiere: new FormControl(
                {value: this.selectedRow.dichiara.O_dichiarazioni_veritiere.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
              P_acceptance_privacy: new FormControl(
                {value: this.selectedRow.dichiara.P_acceptance_privacy.isChecked, disabled: this.selectedRow.state != StateEnum.BOZZA},
              ),
            }),
          });

        }

      } else {
         this.simpleAlertService.isOpenedModal=true
          this.simpleAlertService.message= "La domanda non è stata trovata."
        //TODO: AGGIUGNERE PAGINA NON TROVATA
      }

    })
  }


  backToRichiestaDomanda() {
    this.router.navigateByUrl('/dashboard');
    window.scrollTo(0, 0);
  }

  getIdInput(index: number) {
    // let index = this.inputFurtherFiles.length + 1

    return "allegato_" + index.toString()
  }

  getFile(file: any, name: string, isAllegatoIntegrativo?: any) {
    if (isAllegatoIntegrativo) {
      if (file) {
        file["name"] = name
        console.log(file);

        for (let index = 0; index < this.inputFurtherFiles.length; index++) {
          let inputFurtherFile = this.inputFurtherFiles[index]

          if (inputFurtherFile.name == name) {
            this.inputFurtherFiles[index] = file
            if(this.selectedRow["statoAllegati"]["allegati"] && this.selectedRow["statoAllegati"]["allegati"].length) {
              this.selectedRow["statoAllegati"]["allegati"][index] = file
            } else {
              this.selectedRow["statoAllegati"]["allegati"] = [file]
            }
            break
          }
        }

        
        console.log(this.inputFurtherFiles)
      } else {
        this.inputFurtherFiles = this.inputFurtherFiles.filter((inputFile: any) => inputFile.name != name)
        this.selectedRow["statoAllegati"]["allegati"] = JSON.parse(JSON.stringify(this.selectedRow["statoAllegati"]["allegati"].filter((inputFile: any) => inputFile.name != name)))
      }
    } else {
      if (file) {
        file["name"] = name
        console.log(file);

        if (this.inputFiles.filter((inputFile: any) => inputFile.name == name).length == 0) this.inputFiles.push(file);
      } else {
        this.inputFiles = this.inputFiles.filter((inputFile: any) => inputFile.name != name)
      }
    }
  }

  removeAllOccurrences(inputString: string, targetWord: string) {
    // Escapare il target per i caratteri speciali e creare un'espressione regolare globale
    const escapedTarget = targetWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escapedTarget, 'g'); // Flag 'g' per tutte le occorrenze

    return JSON.parse(inputString.replace(regex, ''))
  }


  updateDomanda(state?: string, nextStep? : number) {
    let data: any = this.form?.getRawValue()
    data["_id"] = this.route.snapshot.paramMap.get('id')!
    data["richiedente"]["_id"] = this.sessionService.user._id
    data["beneficiario"]["_id"] = this.selectedRow!.beneficiario._id

    data["gedLog"] = this.selectedRow["gedLog"]

    data = this.removeAllOccurrences(JSON.stringify(data), "Beneficiario")
    data = this.removeAllOccurrences(JSON.stringify(data), "Richiedente")


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
      }
    }

    let statoAllegati = this.selectedRow.statoAllegati

    if (this.prioritaValue) {
      data["priorita"] = this.prioritaValue
    }
    
    if (this.graduatoriaValue) {
      data["graduatoria"] = this.graduatoriaValue
    }
    

    if (this.notaDocumentRequest && this.stateDocumentValue) {

      let template: any = {}

      if (this.isCheckedModuliIstruttoria) {
        template["isCheckedModuliIstruttoria"] = this.isCheckedModuliIstruttoria
      }

      if (this.isCheckedInvalidAttachment) {
        template["isCheckedInvalidAttachment"] = this.isCheckedInvalidAttachment
      }

      if (this.selectedRow["statoAllegati"]) {
        statoAllegati = this.selectedRow["statoAllegati"]
      

        statoAllegati["note"] = this.notaDocumentRequest
        statoAllegati["value"] = this.stateDocumentValue
      } else {

        statoAllegati = {
          note: this.notaDocumentRequest,
          value: this.stateDocumentValue,
          hasActionDoneByCittadino: false
        }
      }
      

      if (Object.keys(template).length) {
        statoAllegati["template"] = template
      }
    } 

    data["statoAllegati"] = statoAllegati


    if(nextStep){
      this.currentStep = nextStep;
    }
    data.currentStep = this.currentStep;

    if(this.selectedRow["allegati"]) data["allegati"] = this.selectedRow["allegati"]

    if(state) data["state"] = state


    if (!this.isValidAttachment()) { 
    
        this.simpleAlertService.isOpenedModal=true
        this.simpleAlertService.message= "Inserire i documenti obbligatori: certificato di invalidità totale o parziale, documento di identità, verbale dell'assemblea, ricevuta pagamento bollo."
    } else if (this.isValidForm(data) || true) {

      this.isCallingServer = true

      let payload = {
        "user": {
          "_id": this.sessionService.user._id
        },
        "data": data,
        "entity": "questions",
        "endpoint": "updateQuestionById",
      }
  
      this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe(async (response: any) => {
        if (response.code == HttpStatusCode.Ok || response.code == HttpStatusCode.NotModified) {
  
          let allegati: File[] = []
  
          this.uploadAllAllegati(0, data, allegati)
  
  
        } else {

         this.simpleAlertService.isOpenedModal=true
        this.simpleAlertService.message= "La domanda non è stata aggiornata. Riprova oppure contattare l'assistenza."
        }
      })
    } else {
       this.simpleAlertService.isOpenedModal=true
        this.simpleAlertService.message= "La domanda non è stata aggiornata. Controllare di aver compilato correttamente la domanda."
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
          this.updateDomandaWithAllegati$.next([data, allegati])
        } else {
          this.uploadAllAllegati(index + 1, data, allegati)
        }

      })
    } else if (allegatoRaw && allegatoRaw._id) {
      allegati.push(allegatoRaw)
      if (index == this.inputFiles.length - 1) {
        this.updateDomandaWithAllegati$.next([data, allegati])
      } else {
        this.uploadAllAllegati(index + 1, data, allegati)
      }
    }

    if (this.inputFiles.length == 0) {
      allegati = []
      this.updateDomandaWithAllegati$.next([data, allegati])

    }

  }

  isValidAttachment() {
    let result = false

    if(this.inputFiles) {
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
    this.isServoScalaValid = data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["servoscala"].isChecked? data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["servoscala"]["piattaforma"].isChecked || data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["servoscala"]["poltroncina"].isChecked : true
    this.isAscensoreValid = data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["ascensore"].isChecked? data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["ascensore"]["installazipne"].isChecked || data["generalitaLavori"]["accessoImmobileSingolaUnitaImmobiliare"]["ascensore"]["adeguamento"].isChecked : true
    
    this.isL_non_pubblicaValid = data["dichiara"]["L_non_pbblica"].isChecked == true
    this.isM_non_futura_residenzaValid = data["dichiara"]["M_non_futura_residenza"].isChecked == true
    this.isN_approvate_condominioValid = data["dichiara"]["N_approvate_condominio"].isChecked == true
    this.isO_dichiarazioni_veritiereValid = data["dichiara"]["O_dichiarazioni_veritiere"].isChecked == true
    this.isP_acceptance_privacyValid = data["dichiara"]["P_acceptance_privacy"].isChecked == true

    
    
    

    return this.form?.valid && this.isServoScalaValid && this.isAscensoreValid && this.isL_non_pubblicaValid && this.isM_non_futura_residenzaValid && this.isO_dichiarazioni_veritiereValid && this.isP_acceptance_privacyValid
  }

  openModalDocumentRequest() {
    this.isOpenModalDocumentRequest = true
  }

  closeModalDocumentRequest() {
    this.isOpenModalDocumentRequest = false
  }

  editNotaDocumentRequest(e: any) {
    this.notaDocumentRequest = e.target.value
  }

  onSelectDocumentState(e: any) {
    this.stateDocumentValue = e.target.value
  }

  onSelectPriorita(e: any) {
    this.prioritaValue = e.target.value
  }

  onSelectInvalidAttachment(e: any) {
    this.isInvalidAttachment = e.target.value
  }

  sendDocumentState() {
    if (this.notaDocumentRequest && !this.isCallingServer) {
      let stateDomanda: any = DomandaStateEnum.DOCUMENTI

      if(this.stateDocumentValue == StateDocumentEnum.VERIFICATO) {
        // if (this.currentStep == 2 || this.currentStep == 3 || this.currentStep == 7) {
          stateDomanda = DomandaStateEnum.VERIFICA

        // }
      } else  {
        stateDomanda = DomandaStateEnum.DOCUMENTI
      }


      this.updateDomanda(stateDomanda, this.currentStep)
    } else {
     
      this.simpleAlertService.isOpenedModal=true
      this.simpleAlertService.message= "Inserire una nota"
     
    }
  }

  onSelectCheckboxChange(e: any, module_name: string) {
    if (module_name == "modulo_istruttoria") {
      this.isCheckedModuliIstruttoria = !this.isCheckedModuliIstruttoria
    } else if(module_name == "invalid_attachment") {
      this.isCheckedInvalidAttachment = !this.isCheckedInvalidAttachment
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

  editGraduatoria(e: any) {
    this.graduatoriaValue = e.target.value
  }

  getDisablePriorita() {
    let result

    if (this.selectedRow?.currentStep > 4) {
      result = true
    }

    return result
  }

}


export enum DomandaStateEnum {
  APPROVATA = "Approvata",
  BOZZA = "Bozza",
  VERIFICA = "Verifica",
  DOCUMENTI = "Documenti",
  RESPINTA = "Respinta",
  INVIO = "Inviata"
}

export enum StateDocumentEnum {
  VERIFICATO = "verificato",
  CONTROLLO = "controllo",
  RESPINTO = "respinto"
}

export enum PrioritaQuestiontEnum {
  ALTA = "Alta",
  MEDIA = "Media",
  BASSA = "Bassa"
}