import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../session.service';
import { IDomanda } from '../../interfaces/dati-richiesti.interface';
import { ButtonComponent } from '../../shared/button/button.component';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faAngleDown, faPrint } from '@fortawesome/free-solid-svg-icons';
import { ChipsComponent } from '../../shared/chips/chips.component';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { TableComponent } from '../../shared/domande-table/domande-table.component';
import { TableColumn } from '../../interfaces/table-column.interface';

@Component({
    selector: 'app-dashboard',
    imports: [CommonModule, ButtonComponent, FontAwesomeModule, ChipsComponent, BreadcrumbComponent, TableComponent, ButtonComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
    standalone: true

})
export class DashboardComponent {

  isOpenedModalPrintDomandeRegione = false
  
  faArrowRight = faArrowRight;
  faAngleDown = faAngleDown;
  faPrint = faPrint

  rowsToDisplay!: IDomanda[];

  columns: TableColumn[]  = [
    { key: 'isSelected', header: '', class: 'checkbox', isCheckbox: true, sortable: false },
    { key: 'fullName', header: 'Beneficiario', class: 'full-name', sortable: true },
    { key: 'date', header: 'Data di apertura', class: 'date', sortable: true },
    { key: 'import', header: 'Importo', class: 'import', sortable: true },
    { key: 'state', header: 'Stato richiesta', class: 'state', sortable: true },
    { key: 'note', header: 'Note', class: 'note', sortable: true },
    { key: 'goQuestion', header: 'Vai alla domanda', class: 'go-question', isActionColumn: false, sortable: false },
    { key: 'button', header: '', class: 'button', isActionColumn: false, sortable: false },
  ];

  ngOnInit() {
    this.rowsToDisplay = this.sessionService.domande;
  }
  
  breadcrumbs = [
    { label: 'Home', url: 'https://www.comune.roma.it/web/it/home.page?r=n' },
    { label: 'Servizi online', url: 'https://www.comune.roma.it/web/it/servizi.page' },
    { label: 'Dashboard', url: '/dashboard' }
  ];

  constructor(public sessionService :SessionService, private router: Router){}

  inviaDomanda(){
    this.router.navigateByUrl('/invia-domanda');
    window.scrollTo(0,0);
  }
  backToDescrizioneServizio() {
    this.router.navigateByUrl('/descrizione-servizio');
    window.scrollTo(0,0);
  }

  openModalPrintDomandeRegione() {
    this.isOpenedModalPrintDomandeRegione = true
  }

  stampaListaDomande() {
    const xmlContent = this.convertArrayToXml(this.sessionService.printDomandeRegione);
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xml';
    a.click();

    window.URL.revokeObjectURL(url);

    this.isOpenedModalPrintDomandeRegione = false
  }

  closeModalPrintDomandeRegione() {
    this.isOpenedModalPrintDomandeRegione = false
  }

  convertArrayToXml(data: any[]): string {
    const rootElement = 'items';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootElement}>\n`;
  
    data.forEach((item) => {
      xml += `  <item>\n`;
      xml += this.convertValueToXml(item, '    ');
      xml += `  </item>\n`;
    });
  
    xml += `</${rootElement}>\n`;
    return xml;
  }
  
  // Recursively converts any value (object, array, primitive) to XML
  convertValueToXml(value: any, indent: string): string {
    let xml = '';
    
    if (Array.isArray(value)) {
      value.forEach((item) => {
        xml += `${indent}<element>\n`;
        xml += this.convertValueToXml(item, indent + '  ');
        xml += `${indent}</element>\n`;
      });
    } else if (typeof value === 'object' && value !== null) {
      for (const [key, nestedValue] of Object.entries(value)) {
        xml += `${indent}<${key}>\n`;
        xml += this.convertValueToXml(nestedValue, indent + '  ');
        xml += `${indent}</${key}>\n`;
      }
    } else {
      // Primitive value
      xml += `${indent}${value}\n`;
    }
    
    return xml;
  }
}
