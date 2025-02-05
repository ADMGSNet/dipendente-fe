import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'template-form',
    imports: [ReactiveFormsModule],
    templateUrl: './template-form.component.html',
    styleUrl: './template-form.component.scss',
    standalone: true

})
export class TemplateFormComponent {
  public firstName = new FormControl('');
  public lastName = new FormControl('');
  public birthDay = new FormControl('');
  public is18Older = new FormControl(false);
  public law1518 = new FormControl(true);


  public editField(formField: string, e?: any) {
    if (formField == "law1518") {
      (this as any)[formField].setValue(!(this as any)[formField].value)
    } else if (formField == "is18Older") {
      (this as any)[formField].setValue(e.target.value)
    }
  }  
}
