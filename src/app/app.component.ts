import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
//import { TemplateFormComponent } from './template-form/template-form.component';
//import { LoginComponent } from "./login/login.component";
//import { HomeComponent } from './home/home.component';
//import { DescrizioneServizioComponent } from "./home/descrizione-servizio/descrizione-servizio/descrizione-servizio.component";
//import { DettaglioDomandaComponent } from "./home/dettaglio-domanda/dettaglio-domanda/dettaglio-domanda.component";
import { SessionService } from './session.service';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SimpleAlertService } from './shared/simple-alert/simple-alert.service';
import { SimpleAlertComponent } from './shared/simple-alert/simple-alert.component';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent,SimpleAlertComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true
})
export class AppComponent {

  constructor(public sessionService:SessionService){

  }
}
