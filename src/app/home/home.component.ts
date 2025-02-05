import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UserService } from '../login/user.service';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

import { SocialButtonComponent } from '../shared/social-button/social-button.component';
import { ButtonComponent } from '../shared/button/button.component';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';
import { ExpandableSectionComponent } from '../shared/expandable-section/expandable-section.component';
import { GedService } from '../ged-service.service';

@Component({
    selector: 'app-home',
    imports: [
        CommonModule,
        SocialButtonComponent,
        ButtonComponent,
        BreadcrumbComponent,
        ExpandableSectionComponent,
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    standalone: true

})
export class HomeComponent {
  summaryEnum = SummaryEnum;
  tabSummarySelected = this.summaryEnum.DESCRIPTION;

  breadcrumbs = [
    { label: 'Home', url: 'https://www.comune.roma.it/web/it/home.page?r=n' },
    { label: 'Servizi online', url: 'https://www.comune.roma.it/web/it/servizi.page' },
    { label: 'Dashboard', url: '/dashboard' }
  ];

  menuTabSummary: any = {
    summary: {
      isOpened: false,
    },
  };


  constructor(public sessionService: SessionService, private router: Router) {
   
  }

  onTabSelected(summaryTab: any) {
    this.tabSummarySelected = summaryTab;
  }

  toggleSummary() {
    if (this.menuTabSummary[this.summaryEnum.TOGGLE_SUMMARY]['isOpened']) {
      this.menuTabSummary[this.summaryEnum.TOGGLE_SUMMARY]['isOpened'] = false;
    } else {
      this.menuTabSummary[this.summaryEnum.TOGGLE_SUMMARY]['isOpened'] = true;
    }
  }
  goToDescrizione() {
    this.router.navigateByUrl('/descrizione-servizio');
    window.scrollTo(0, 0);
  }
}

export enum SummaryEnum {
  DESCRIPTION = 'descrizione',
  LOREM_IPSUM1 = 'lorem_ipsum1',
  LOREM_IPSUM2 = 'lorem_ipsum2',
  LOREM_IPSUM3 = 'lorem_ipsum3',
  TOGGLE_SUMMARY = 'summary',
}
