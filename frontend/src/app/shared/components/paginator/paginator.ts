import { Component, computed, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

export interface PaginatorState {
  pageIndex: number;
  pageSize: number;
}

@Component({
    selector: 'app-paginator',
    imports: [MatPaginatorModule],
    template: `
        <mat-paginator
            [length]="length()"
            [pageSize]="pageSize()"
            [pageIndex]="materialPageIndex()"
            [pageSizeOptions]="pageSizeOptions()"
            [showFirstLastButtons]="true"
            (page)="onPageEvent($event)"
            class="custom-paginator"
            aria-label="Select page"
        >
        </mat-paginator>
    `,
    styles: ``,
})
export class Paginator {
  length = input.required<number>();      
  pageSize = input.required<number>();
  pageIndex = input<number>(1);           
  pageSizeOptions = input<number[]>([20, 40, 80]); // default values for pageSize
  pageChange = output<PaginatorState>();
  materialPageIndex = computed(() => this.pageIndex() - 1);
  onPageEvent(e: PageEvent) {
    this.pageChange.emit({
      pageIndex: e.pageIndex + 1, 
      pageSize: e.pageSize
    });
  }
}
