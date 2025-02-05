import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-expandable-section',
    imports: [CommonModule, FontAwesomeModule],
    templateUrl: './expandable-section.component.html',
    styleUrl: './expandable-section.component.scss',
    standalone: true

})
export class ExpandableSectionComponent {

  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  @Input() typeSummary: boolean = false;
  @Input() title: string = '';
  isExpanded = false;

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
  
}
