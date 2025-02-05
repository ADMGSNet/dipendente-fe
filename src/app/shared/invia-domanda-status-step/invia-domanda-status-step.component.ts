import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-invia-domanda-status-step',
    imports: [CommonModule],
    templateUrl: './invia-domanda-status-step.component.html',
    styleUrl: './invia-domanda-status-step.component.scss',
    standalone: true

})
export class InviaDomandaStatusStepComponent {
  
  @Input() step: number = 1;

}
