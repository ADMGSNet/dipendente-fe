import { Component, Input } from '@angular/core';
import { SimpleAlertService } from './simple-alert.service';
import { ButtonComponent } from '../button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-simple-alert',
  imports: [ButtonComponent,CommonModule],
  templateUrl: './simple-alert.component.html',
  styleUrl: './simple-alert.component.scss'
})
export class SimpleAlertComponent {

  constructor(public simpleAlertService :SimpleAlertService){
  }

}
