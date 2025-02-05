import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-filter-table',
    imports: [CommonModule],
    templateUrl: './filter-table.component.html',
    styleUrl: './filter-table.component.scss',
    standalone: true

})
export class FilterTableComponent {

  @Input() tags: string[] = []; 
  @Output() filterSelected = new EventEmitter<string[]>();

  showDropdown: boolean = false;
  selectedTags: string[] = []

  toggleMenuFilter(){
    this.showDropdown = !this.showDropdown;
  }

  onTagSelect(tag: string) {
    if (this.selectedTags.includes(tag)) {
      this.selectedTags = this.selectedTags.filter(t => t !== tag);
    } else {
      this.selectedTags.push(tag);
    }
    this.filterSelected.emit(this.selectedTags);   
  }


}
