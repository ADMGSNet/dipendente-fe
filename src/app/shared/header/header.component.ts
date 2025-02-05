import { Component } from '@angular/core';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SessionService } from '../../session.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [FontAwesomeModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    standalone: true

})
export class HeaderComponent {
  faBell = faBell
  isOpenActionList = true

  constructor(public sessionService: SessionService) {}

  getUserFullname() {
    let fullname = "non loggato"
    if(this.sessionService.user) {
      fullname = this.sessionService.user.firstName + " " + this.sessionService.user.lastName
    }

    return fullname
  }

  toggleActionList() {
    this.isOpenActionList = !this.isOpenActionList
  }

  closeActionList() {
    this.isOpenActionList = false
  }

  goToDettaglioDomanda(id: string) {
    return "/dettaglio-domanda/"+id
  }
}
