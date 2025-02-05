import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, EventEmitter, Inject, input, Input, Output, PLATFORM_ID, Renderer2, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faDownload, faPaperclip, faPlusCircle, faTimes, } from '@fortawesome/free-solid-svg-icons';
import { DomandaStateEnum } from '../../home/dettaglio-domanda/dettaglio-domanda/dettaglio-domanda.component';
import { ProvideHttpClientService } from '../../services/provide-http-client.service';
import { SessionService } from '../../session.service';
import { SimpleAlertService } from '../simple-alert/simple-alert.service';
@Component({
  selector: 'app-input-file-button',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './input-file-button.component.html',
  styleUrl: './input-file-button.component.scss',
  standalone: true

})
export class InputFileButtonComponent {

  @Output() dataURIE = new EventEmitter()

  faTimes = faTimes
  faPlusCircle = faPlusCircle
  faDownload = faDownload
  faPaperclip = faPaperclip
  @ViewChild('fileName') fileName: ElementRef | any;
  @ViewChild('fileInput') fileInput: ElementRef | any;

  fileAdded: boolean = false;
  inputFile: File | any;

  @Input('isAllegatoIntegrativo') isAllegatoIntegrativo: any
  @Input('isStoredFurtherAllegato') isStoredFurtherAllegato: any

  @Input("emptyInputString") emptyInputString: string = 'Carica';
  // @Input("subString") subString: string = 'Template aggiornato al: ';
  // @Input("dataAggiornamento") dataAggiornamento: string = 'dd/mm/yyyy';
  @Input("idInput") idInput: string = '';

  @Output('fileSelected') fileSelected = new EventEmitter<any>();

  @Input('selectedRow') selectedRow: any[] | any = []

  @Input('fileFormName') fileFormName: string = ""

  storedAllegati: any

  domandaStateEnum = DomandaStateEnum

  isCalled = false
  constructor(private renderer: Renderer2,
    private httpService: ProvideHttpClientService,
    public simpleAlertService : SimpleAlertService,
    private sessionService: SessionService,
    @Inject(PLATFORM_ID) private platformId: any
  ) { }

  ngOnChanges(change: SimpleChanges) {

    
    if (change["selectedRow"] && change["selectedRow"].currentValue) {
      if (this.selectedRow["allegati"] && !this.isAllegatoIntegrativo) this.storedAllegati = this.selectedRow["allegati"]
      if (this.selectedRow["statoAllegati"] && this.selectedRow["statoAllegati"]["allegati"] && this.isAllegatoIntegrativo && !this.isCalled) {
        this.storedAllegati = this.selectedRow["statoAllegati"]["allegati"]
        this.isCalled = true
      }
      if (this.selectedRow["furtherAllegati"] && !this.isAllegatoIntegrativo && !this.isCalled && this.isStoredFurtherAllegato) {
        this.storedAllegati = this.selectedRow["furtherAllegati"]
        this.isCalled = true
      }
      
      if (this.storedAllegati && this.storedAllegati.length) {
        let storedAllegato = this.storedAllegati.filter((storedAllegato: any) => (storedAllegato.name == this.fileFormName && (storedAllegato._id || storedAllegato.dataURI)))

        if (storedAllegato && storedAllegato.length) {
          this.fileAdded = true;

          setTimeout(() => {
            if (isPlatformBrowser(this.platformId)) {
            
              this.fileName.nativeElement.innerHTML = ""
            // Create the new span element
            const newNode = this.renderer.createElement('span');
            const text = this.renderer.createText(this.fileFormName);
            // Append text to the span
            this.renderer.appendChild(newNode, text);

            // Add styles to mimic a clickable link
            this.renderer.setStyle(newNode, 'cursor', 'pointer');
            // this.renderer.setStyle(newNode, 'color', 'blue');
            this.renderer.setStyle(newNode, 'text-decoration', 'underline');

            // Add a click event to the span
            this.renderer.listen(newNode, 'click', () => this.downloadFile());

            // Append the span to the container
            this.renderer.appendChild(this.fileName.nativeElement, newNode); console.log(storedAllegato)

          }
            
          }, 500)
        }
      }
    }
  }

  ngAfterViewInit() {
    

  }

  handleInputChange(event: any) {
    this.fileAdded = true;

    const inputFile = event.target.files[0];
    console.log(inputFile);
    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.fileSelected.emit({
        "name": this.fileFormName,
        "dataURI": event.target.result
      });

    };

    reader.onerror = function (error) {
      console.error("Error reading file:", error);
    };

    // Read the file as a data URL (Base64 encoded string)
    reader.readAsDataURL(inputFile);

    this.fileName.nativeElement.innerHTML = this.fileFormName;
  }

  handleInputClick() {
    if (this.fileName.nativeElement.innerHTML === this.emptyInputString) {
      this.fileAdded = false;

    }
  }

  handleInputCancel(ev: any) {
    this.fileInput.nativeElement.value = '';
    this.fileName.nativeElement.innerHTML = this.emptyInputString;

    //this prevevent the re-opening of the select-file dialog
    ev.preventDefault();
    this.fileAdded = false;

    // reset input
    this.inputFile = null;

    this.fileSelected.emit(null);
  }

  downloadFile() {
    let storedAllegato = this.storedAllegati.filter((storedAllegato: any) => (storedAllegato.name == this.fileFormName))

    if (storedAllegato && storedAllegato.length) {

      let payload = {
        "user": {
          "_id": this.sessionService.user._id
        },
        "data": storedAllegato[0],
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
        a.download = this.fileFormName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoke the object URL to free up memory
        URL.revokeObjectURL(blobUrl);
      })
    } else {
        this.simpleAlertService.isOpenedModal=true
        this.simpleAlertService.message= "Errore nel file. Contattare l'assistenza"
    }


  }
}
