import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  MatCalendar,
  MatCalendarCellCssClasses,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CalendarCustomHeader } from '../calendar-custom-header/calendar-custom-header.component';
import { DateDataService } from '../../../services/date-data.service';

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
  activeMonth = 10;
  selectedDate = new Date('11/30/2024');
  selectedDates = inject(DateDataService);

  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let comparableDates: number[] = this.getComparableDates(
      this.selectedDates.selectedDates
    );
    if (comparableDates.includes(date.getDate())) return 'highlight-date';
    else return '';
  };

  public selectedChange(event: Date | null): void {
    let comparableDates: number[] = this.getComparableDates(
      this.selectedDates.selectedDates
    );
    if (event && !comparableDates.includes(event.getDate())) {
      this.selectedDates.selectedDates.push(event);
    } else if (event && comparableDates.includes(event.getDate())) {
      let index = this.selectedDates.selectedDates.findIndex(
        (dateElement) => dateElement.getDate() === event.getDate()
      );
      this.selectedDates.selectedDates.splice(index, 1);
    }
    this.calendar?.updateTodaysDate();
  }

  private getComparableDates(dates: Date[]): number[] {
    let comparableDates: number[] = [];
    dates.forEach((dateElement) => {
      if (dateElement.getMonth() === this.activeMonth) {
        comparableDates.push(dateElement.getDate());
      }
    });
    return comparableDates;
  }
}
