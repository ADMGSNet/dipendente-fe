import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-button',
    imports: [],
    templateUrl: './button.component.html',
    styleUrl: './button.component.scss',
    standalone: true

})
export class ButtonComponent {

  @Input() option: "default" | "secondary" |"link" = "default";
  @Input() disabled:boolean = false;
  @Input() isActive :boolean =false;

}
