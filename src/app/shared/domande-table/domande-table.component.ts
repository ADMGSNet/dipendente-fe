import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SessionService } from '../../session.service';
import { IDomanda, StateEnum } from '../../interfaces/dati-richiesti.interface';
import { TableColumn } from '../../interfaces/table-column.interface';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faAngleDown, faAngleUp, faAngleRight, faAngleLeft, faSort, faSortUp, faSortDown, faCircleCheck, faTriangleExclamation, faCircleMinus, } from '@fortawesome/free-solid-svg-icons';
import { ChipsComponent } from '../chips/chips.component';
import { ButtonComponent } from '../button/button.component';

import { FormsModule } from '@angular/forms';
import { FilterTableComponent } from './filter-table/filter-table.component';
import { ProvideHttpClientService } from '../../services/provide-http-client.service';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HTTP_STATUS_CODE } from '../../../../ssr-utils/http.code';
import { StateDocumentEnum } from '../../home/dettaglio-domanda/dettaglio-domanda/dettaglio-domanda.component';
import { SimpleAlertService } from '../simple-alert/simple-alert.service';

@Component({
  selector: 'app-domande-table',
  imports: [FontAwesomeModule, CommonModule, ChipsComponent, ButtonComponent, FormsModule, FilterTableComponent],
  templateUrl: './domande-table.component.html',
  styleUrl: './domande-table.component.scss',
  standalone: true

})
export class TableComponent implements OnInit {

  faArrowRight = faArrowRight;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;
  faCircleCheck = faCircleCheck;
  faTriangleExclamation = faTriangleExclamation;
  faCircleMinus = faCircleMinus;

  stateDocumentEnum = StateDocumentEnum

  columns: TableColumn[] = [
    { key: 'isSelected', header: '', class: 'checkbox', isCheckbox: true, sortable: false },
    { key: 'progressivo', header: 'Progressivo', class: 'progressivo', sortable: true },
    { key: 'fullName', header: 'Richiedente', class: 'full-name', sortable: true },
    { key: 'date', header: 'Data di apertura', class: 'date', sortable: true },
    { key: 'import', header: 'Importo richiesto', class: 'import', sortable: true },
    { key: 'documenti', header: 'Documenti', class: 'documenti', sortable: true },
    { key: 'priorita', header: 'Livello priorità', class: 'livello-priorita', sortable: true },
    { key: 'state', header: 'Stato domanda', class: 'state', sortable: true },
    { key: 'goQuestion', header: 'Vai alla domanda', class: 'go-question', isActionColumn: false, sortable: false },
    { key: 'button', header: '', class: 'button', isActionColumn: false, sortable: false },
  ];
  ;
  domande: IDomanda[] | any;

  @Input() paginated = false;
  @Input() itemPerPage = 10;
  currentPage = 0;
  totalPages = 1;

  sortedColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = "";
  filteredDomande: IDomanda[] = [];

  @Input() filtered = false;
  tags: any[] = [];

  constructor(@Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    public simpleAlertService : SimpleAlertService,
    public sessionService: SessionService,
    private httpService: ProvideHttpClientService) {
    this.sessionService.user$.subscribe((result) => {
      let payload: any = {
        "entity": "questions",
        "endpoint": "getQuestionsByDipendente",
        "data": { "id": this.sessionService.user._id, "currentPage": this.currentPage, "itemPerPage": this.itemPerPage, "isPaginated": true }
      }

      this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe((result) => {
        if (result.statusCode == HTTP_STATUS_CODE.AUTHENTICATION_ERROR) {
          
          this.simpleAlertService.isOpenedModal=true
          this.simpleAlertService.message= "Accesso non consentito"
       
          // window.location.href = "/login"
        }
        this.domande = result.list
        this.sessionService.domande = result.list
        this.filteredDomande = result.list

        this.totalPages = result.totalPages

        // this.getDomande()

        this.filteredDomande = this.domande;
        this.tags = [...new Set(this.domande.map((domanda: any) => domanda.state))];

        const sortableColumn = this.columns.find(col => col.sortable);
        if (sortableColumn) {
          if (this.sortedColumn) {
            this.sortByColumn(this.sortedColumn);
          }

        }
      })
    })



    if (!this.domande && this.sessionService.accessToken) {
      this.sessionService.user$.next(true)
    }
  }

  ngOnInit() {
    console.log("Hello table")
    const ssrData: any = this.document.getElementById('question-list-ssr-data');
    console.log(ssrData)
    if (!isPlatformBrowser(this.platformId)) {
      this.domande = ssrData.textContent;
    }

  }

  vaiAllaDomanda(row: IDomanda) {
    this.sessionService.navigateToDomanda(row);
    window.scrollTo(0, 0);
  }

  toggle(i: number) {
    this.sessionService.domande[i].isVisible = !this.sessionService.domande[i].isVisible;
  }


  // getDomande() {
  //   console.log("get do,amde")
  //   this.filteredDomande = this.domande
  //       .filter((row: any) => (row["beneficiario"]["firstName"].toLowerCase().includes(this.searchTerm.toLowerCase())) ||
  //                              row["beneficiario"]["lastName"].toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //                              row["date"].toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //                              row["generalitaLavori"]["contributo"].toLowerCase().includes(this.searchTerm.toLowerCase()) ||
  //                              row["state"].toLowerCase().includes(this.searchTerm.toLowerCase()))

  //   // else {
  //   //   this.filteredRows = this.filteredRows;
  //   // }

  //   return this.filteredDomande
  // }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      let payload: any = {
        "entity": "questions",
        "endpoint": "getQuestionsByDipendente",
        "data": { "id": this.sessionService.user._id, "currentPage": this.currentPage, "itemPerPage": this.itemPerPage, "isPaginated": true }
      }

      this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe((result) => {
        if (result.statusCode == HTTP_STATUS_CODE.AUTHENTICATION_ERROR) {
            this.simpleAlertService.isOpenedModal=true
          this.simpleAlertService.message= "Accesso non consentito"
          // window.location.href = "/login"
        }
        this.domande = result.list
        this.sessionService.domande = result.list
        this.filteredDomande = result.list

        this.totalPages = result.totalPages

        // this.getDomande()
      })
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      let payload: any = {
        "entity": "questions",
        "endpoint": "getQuestionsByDipendente",
        "data": { "id": this.sessionService.user._id, "currentPage": this.currentPage, "itemPerPage": this.itemPerPage, "isPaginated": true }
      }

      this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe((result) => {
        if (result.statusCode == HTTP_STATUS_CODE.AUTHENTICATION_ERROR) {
            this.simpleAlertService.isOpenedModal=true
          this.simpleAlertService.message= "Accesso non consentito"
          // window.location.href = "/login"
        }
        this.domande = result.list
        this.sessionService.domande = result.list
        this.filteredDomande = result.list

        this.totalPages = result.totalPages

        // this.getDomande()
      })
    }
  }

  sortByColumn(columnKey: keyof IDomanda | string | 'action' | 'button') {
    if (this.columns.some(col => col.key === columnKey && col.sortable)) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.sortedColumn = columnKey;

      console.log('sortedColumn:', this.sortedColumn);
      console.log('First row:', this.domande[0]);

      // if (this.sortedColumn && this.domande[0] && this.sortedColumn in this.domande[0]) { }

      this.filteredDomande.sort((a: any, b: any) => {
        let result: any

        if (this.sortedColumn == "date") {
          const aValue = a[this.sortedColumn as keyof IDomanda];
          const bValue = b[this.sortedColumn as keyof IDomanda];

          if (new Date(aValue) instanceof Date && new Date(bValue) instanceof Date) {
            result = (new Date(aValue).getTime() - new Date(bValue).getTime()) * (this.sortDirection === 'asc' ? 1 : -1);
          }
        } else if (this.sortedColumn == "state" || this.sortedColumn == "note" || this.sortedColumn == "priorita") {
          let aValue = a[this.sortedColumn as keyof IDomanda];
          if (!aValue) aValue = "nd"
          let bValue = b[this.sortedColumn as keyof IDomanda];
          if (!bValue) bValue = "nd"

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            result = aValue.localeCompare(bValue) * (this.sortDirection === 'asc' ? 1 : -1);
          }
        } else if (this.sortedColumn == "import") {
          const aValue = a["generalitaLavori"]["contributo"];
          const bValue = b["generalitaLavori"]["contributo"];

          if (typeof parseFloat(aValue) === 'number' && typeof parseFloat(bValue) === 'number') {
            result = (parseFloat(aValue) - parseFloat(bValue)) * (this.sortDirection === 'asc' ? 1 : -1);
          }
        } else if (this.sortedColumn == "fullName") {
          const aValue = a["beneficiario"]["firstName"];
          const bValue = b["beneficiario"]["firstName"];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            result = aValue.localeCompare(bValue) * (this.sortDirection === 'asc' ? 1 : -1);
          }
        } else if (this.sortedColumn == "documenti") {
          let aValue = "nd"
          let bValue = "nd"

          if (a["statoAllegati"] && a["statoAllegati"]["value"]) aValue = a["statoAllegati"]["value"];
          if (b["statoAllegati"] && b["statoAllegati"]["value"]) bValue = b["statoAllegati"]["value"];

          if (typeof aValue === 'string' && typeof bValue === 'string') {
            result = aValue.localeCompare(bValue) * (this.sortDirection === 'asc' ? 1 : -1);
          }
        } else if (this.sortedColumn == "progressivo") {
          let aValue = "nd"
          let bValue = "nd"

          if (a["gedLog"] && a["gedLog"][0] && a["gedLog"][0]["data"] && a["gedLog"][0]["data"] &&
            a["gedLog"][0]["data"]["listaNumeroProtocollo"] && a["gedLog"][0]["data"]["listaNumeroProtocollo"].length) {
            aValue = a["gedLog"][0]["data"]["listaNumeroProtocollo"][0].progressivoProtocollo;
          }
          if (b["gedLog"] && b["gedLog"][0] && b["gedLog"][0]["data"] && b["gedLog"][0]["data"] &&
            b["gedLog"][0]["data"]["listaNumeroProtocollo"] && b["gedLog"][0]["data"]["listaNumeroProtocollo"].length) {
            bValue = b["gedLog"][0]["data"]["listaNumeroProtocollo"][0].progressivoProtocollo;
          }

          if (typeof parseFloat(aValue) === 'number' && typeof parseFloat(bValue) === 'number') {
            result = (parseFloat(aValue) - parseFloat(bValue)) * (this.sortDirection === 'asc' ? 1 : -1);
          }
        }

        return result
      });

      this.currentPage = 0;
    }
  }



  search(term: string) {
    this.searchTerm = term;
    let payload: any = {
      "entity": "questions",
      "endpoint": "getQuestionsByDipendente",
      "data": { "id": this.sessionService.user._id, "searchTerm": term.toLowerCase(), "currentPage": this.currentPage, "itemPerPage": this.itemPerPage, "isPaginated": true }
    }

    this.httpService.postData(payload, this.sessionService.accessToken, this.sessionService.refreshToken).subscribe((result) => {
      if (result.statusCode == HTTP_STATUS_CODE.AUTHENTICATION_ERROR) {
      this.simpleAlertService.isOpenedModal=true
          this.simpleAlertService.message= "Accesso non consentito"
        // window.location.href = "/login"
      }
      this.domande = result.list
      this.sessionService.domande = result.list
      this.filteredDomande = result.list

      this.totalPages = result.totalPages

      // this.getDomande()

      this.currentPage = 0
    })
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString().replaceAll("/", "-")
  }

}