import { Component } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-not-found',
  imports: [BreadcrumbComponent,CommonModule],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {

  breadcrumbs = [
    { label: 'Home', url: 'https://www.comune.roma.it/web/it/home.page?r=n' },
    { label: 'Servizi online', url: 'https://www.comune.roma.it/web/it/servizi.page' },
    { label: 'Dashboard', url: '/dashboard' },
  ];


}
