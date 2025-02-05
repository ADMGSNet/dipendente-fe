import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../session.service';
import { IDomanda, StateEnum } from '../../interfaces/dati-richiesti.interface';
import { TableColumn } from '../../interfaces/table-column.interface';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowRight, faAngleDown, faAngleUp, faAngleRight, faAngleLeft, faSort, faSortUp, faSortDown,  } from '@fortawesome/free-solid-svg-icons';
import { ChipsComponent } from '../chips/chips.component';
import { ButtonComponent } from '../button/button.component';

import { FormsModule } from '@angular/forms';
import { FilterTableComponent } from './filter-table/filter-table.component';

@Component({
    selector: 'app-table',
    imports: [FontAwesomeModule, CommonModule, ChipsComponent, ButtonComponent, FormsModule, FilterTableComponent],
    templateUrl: './table.component.html',
    styleUrl: './table.component.scss',
    standalone: true

})
export class TableComponent {

  faArrowRight = faArrowRight;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  faSort = faSort;
  faSortUp = faSortUp;
  faSortDown = faSortDown;

  @Input() columns: TableColumn[] = [];
  @Input() rows: IDomanda[] = [];

  @Input() paginated = false;
  @Input() itemPerPage = 10;
  currentPage = 1;
  totalPages = 1;
  
  sortedColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  searchTerm: string = "";
  filteredRows: IDomanda[] = [];

  @Input() filtered = false;
  tags: string[] = [];

  constructor(public sessionService: SessionService, private router: Router) {}

  ngOnInit() {
    this.rows = this.sessionService.domande;
    this.filteredRows = this.rows;
    this.tags = [...new Set(this.rows.map(row => row.state))];

    this.calculateTotalPages();
    
    const sortableColumn = this.columns.find(col => col.sortable);
    if (sortableColumn) {
      if (this.sortedColumn) {
        this.sortByColumn(this.sortedColumn); 
      }
    }
  }
  
  vaiAllaDomanda(row: IDomanda) {
    this.sessionService.navigateToDomanda(row);
    window.scrollTo(0,0);
  }

  toggle(i: number) {
    this.sessionService.domande[i].isVisible = !this.sessionService.domande[i].isVisible;
  }

  calculateTotalPages() {
    if (this.paginated) {
      this.totalPages = Math.ceil(this.filteredRows.length / this.itemPerPage);
    } else {
      this.totalPages = 1;
    }
  }
  
  getVisibleRows(): any[] {
    const filteredRows = this.rows.filter(row => 
      Object.values(row).some(value => String(value).toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
    
    if (this.paginated) {
      const startIndex = (this.currentPage - 1) * this.itemPerPage;
      const endIndex = Math.min(startIndex + this.itemPerPage, filteredRows.length);
      return filteredRows.slice(startIndex, endIndex);
    } else {
      return filteredRows;
    }
  }
  
  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  sortByColumn(columnKey: keyof IDomanda | string | 'action' | 'button') {
    if (this.columns.some(col => col.key === columnKey && col.sortable)) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      this.sortedColumn = columnKey;
  
      console.log('sortedColumn:', this.sortedColumn);
      console.log('First row:', this.rows[0]);
  
      if (this.sortedColumn && this.rows[0] && this.sortedColumn in this.rows[0]) {
        
        this.rows.sort((a, b) => {
          const aValue = a[this.sortedColumn as keyof IDomanda];
          const bValue = b[this.sortedColumn as keyof IDomanda];
  
          if (aValue instanceof Date && bValue instanceof Date) {
            return (aValue.getTime() - bValue.getTime()) * (this.sortDirection === 'asc' ? 1 : -1);
          } else if (typeof aValue === 'number' && typeof bValue === 'number') {
            return (aValue - bValue) * (this.sortDirection === 'asc' ? 1 : -1);
          } else if (typeof aValue === 'string' && typeof bValue === 'string') {
            return aValue.localeCompare(bValue) * (this.sortDirection === 'asc' ? 1 : -1);
          } else {
            return 0;
          }
        });
      }
      this.currentPage = 1;
    this.calculateTotalPages();
    }
  }
  
  

  search(term: string) {
    this.searchTerm = term;
    this.filteredRows = this.rows.filter(row => 
      Object.values(row).some(value => String(value).toLowerCase().includes(term.toLowerCase()))
    );
    this.currentPage = 1;
    this.calculateTotalPages();
  }

}