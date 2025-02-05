import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-breadcrumb',
    imports: [CommonModule],
    templateUrl: './breadcrumb.component.html',
    styleUrl: './breadcrumb.component.scss',
    standalone: true

})
export class BreadcrumbComponent {
  
  @Input() breadcrumbs: { label: string, url: string }[] = [];

}
