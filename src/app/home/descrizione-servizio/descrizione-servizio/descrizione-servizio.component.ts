import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../session.service';
import { ButtonComponent } from '../../../shared/button/button.component';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';

@Component({
    selector: 'app-descrizione-servizio',
    imports: [CommonModule, ButtonComponent, BreadcrumbComponent],
    templateUrl: './descrizione-servizio.component.html',
    styleUrl: './descrizione-servizio.component.scss',
    standalone: true

})
export class DescrizioneServizioComponent {

  breadcrumbs = [
    { label: 'Home', url: 'https://www.comune.roma.it/web/it/home.page?r=n' },
    { label: 'Servizi online', url: 'https://www.comune.roma.it/web/it/servizi.page' },
    { label: 'Legge 13/89', url: '/' },
    {label : 'Descrizione servizio' , url :'/descrizione-servizio'}
  ];

  constructor(private sessionService: SessionService, private router: Router){}

  backToHomePage(){
    //this.sessionService.isRichiedi=false
    this.router.navigateByUrl('');
    window.scrollTo(0,0);
  }

  inviaRichiesta(){
    //this.sessionService.inviaRichiestaPage=true
    this.router.navigateByUrl('/dashboard');
    window.scrollTo(0,0);
  }
}
