import { Component, ViewEncapsulation } from '@angular/core';
import {
  MatCalendarCellClassFunction,
  MatCalendarCellCssClasses,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CalendarCustomHeader } from '../calendar-custom-header/calendar-custom-header.component';

@Component({
  selector: 'app-month-display',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule],
  templateUrl: './month-display.component.html',
  styleUrl: './month-display.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class MonthDisplayComponent {
  readonly customHeader = CalendarCustomHeader;
  selectedDate = new Date('11/30/2024');
  selectedDates = [new Date('11/30/2024'), new Date('11/29/2024')];

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let comparableDates: number[] = [];
    this.selectedDates.forEach((dateElement) => {
      if (dateElement.getMonth() === 10) {
        comparableDates.push(dateElement.getDate());
      }
    });
    if (comparableDates.includes(date.getDate())) return 'highlight-date';
    else return '';
  };

  public selectedChange(event: Date | null): void {
    console.log('Teste', event);
  }
}
