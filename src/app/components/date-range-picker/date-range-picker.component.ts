import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarModule],
  template: `
    <p-calendar 
      [(ngModel)]="rangeDates" 
      selectionMode="range" 
      [readonlyInput]="true" 
      [showIcon]="true" 
      [showClear]="true"
      [placeholder]="placeholder" 
      dateFormat="dd/mm/yy"
      [styleClass]="styleClass"
      (onSelect)="onSelect()"
      (onClear)="onClear()"
      appendTo="body">
    </p-calendar>
  `,
  styles: [`
    :host ::ng-deep .p-calendar .p-inputtext {
      width: 100%;
    }
  `]
})
export class DateRangePickerComponent {
  @Input() rangeDates: Date[] | null = null;
  @Input() placeholder: string = 'เลือกช่วงวันที่';
  @Input() styleClass: string = 'w-full md:w-20rem p-inputtext-sm';
  
  @Output() rangeChange = new EventEmitter<Date[] | null>();

  onSelect() {
    // Only emit when both dates are selected or if we want to emit partial?
    // Usually range selection emits [Date, Date] or [Date, null]
    if (this.rangeDates && this.rangeDates[0] && this.rangeDates[1]) {
      this.rangeChange.emit(this.rangeDates);
    }
  }

  onClear() {
    this.rangeDates = null;
    this.rangeChange.emit(null);
  }
}
