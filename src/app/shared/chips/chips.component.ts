import { Component, Input } from '@angular/core';
import { StateEnum } from '../../interfaces/dati-richiesti.interface';

@Component({
    selector: 'app-chips',
    imports: [],
    templateUrl: './chips.component.html',
    styleUrl: './chips.component.scss',
    standalone: true

})
export class ChipsComponent {

  @Input() state!: string;

  stateEnum = StateEnum
}
