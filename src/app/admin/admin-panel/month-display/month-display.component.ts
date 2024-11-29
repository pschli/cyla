import {
  Component,
  inject,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
  @Input() inputMonth?: Date;
  startingMonth: Date = new Date();
  activeMonth = this.startingMonth.getMonth();
  userDates = inject(DateDataService);

  ngOnInit(): void {
    if (this.inputMonth) this.startingMonth = this.inputMonth;
    this.activeMonth = this.startingMonth.getMonth();
  }

  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let comparableDates: number[] = this.userDates.getComparableDates(
      this.userDates.selected,
      this.activeMonth
      // fix activeYear!
    );
    if (comparableDates.includes(date.getDate())) return 'highlight-date';
    else return '';
  };

  public selectedChange(event: Date | null): void {
    let comparableDates: number[] = this.userDates.getComparableDates(
      this.userDates.selected,
      this.activeMonth
    );
    if (event && !comparableDates.includes(event.getDate())) {
      this.userDates.selected.push(event);
    } else if (event && comparableDates.includes(event.getDate())) {
      let index = this.userDates.selected.findIndex(
        (dateElement) => dateElement.getDate() === event.getDate()
      );
      this.userDates.selected.splice(index, 1);
    }
    this.userDates.updateDates();
    this.calendar?.updateTodaysDate();
  }
}
