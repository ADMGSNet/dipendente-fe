import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { DescrizioneServizioComponent } from './home/descrizione-servizio/descrizione-servizio/descrizione-servizio.component';
import { DettaglioDomandaComponent } from './home/dettaglio-domanda/dettaglio-domanda/dettaglio-domanda.component';
import { HomeComponent } from './home/home.component';
import { InviaDomandaComponent } from './home/invia-domanda/richiedi-domanda/invia-domanda.component';
import { DashboardComponent } from './home/dashboard/dashboard.component';
import { NotFoundComponent } from './home/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirige alla route "home"
    { path: 'dashboard', component: DashboardComponent }, // Add this line for the new route
    { path: 'descrizione-servizio', component: DescrizioneServizioComponent }, // Add this line for the new route
    { path: 'dettaglio-domanda/:id', component: DettaglioDomandaComponent }, // Add this line for the new route
    { path: 'invia-domanda', component: InviaDomandaComponent }, // Add this line for the new route
    { path: '**', component: NotFoundComponent }
];
