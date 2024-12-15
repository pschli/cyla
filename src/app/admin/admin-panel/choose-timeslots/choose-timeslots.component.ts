import {
  Component,
  inject,
  Input,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { CalendarCustomHeader } from '../calendar-custom-header/calendar-custom-header.component';
import { DateDataService } from '../../../services/date-data.service';
import {
  MatCalendar,
  MatCalendarCellCssClasses,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateFormatterService } from '../../../services/date-formatter.service';

@Component({
  selector: 'app-choose-timeslots',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule],
  templateUrl: './choose-timeslots.component.html',
  styleUrl: './choose-timeslots.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ChooseTimeslotsComponent {
  readonly customHeader = CalendarCustomHeader;
  userDates = inject(DateDataService);
  dateFormatter = inject(DateFormatterService);
  @Input() inputMonth?: Date;
  minDate: Date = new Date();
  startingMonth: Date = new Date();
  activeMonth = this.startingMonth.getMonth();
  activeYear = this.startingMonth.getFullYear();

  markedToEdit: Date[] = [];

  ngOnInit(): void {
    if (this.inputMonth) this.startingMonth = this.inputMonth;
    this.activeMonth = this.startingMonth.getMonth();
    this.activeYear = this.startingMonth.getFullYear();
  }

  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let comparableDates: number[] = this.userDates.getComparableDates(
      this.markedToEdit,
      this.activeMonth,
      this.activeYear
    );
    if (comparableDates.includes(date.getDate())) {
      return 'marked-date';
    } else {
      return '';
    }
  };

  public selectedChange(event: Date | null): void {
    let comparableDates: number[] = this.userDates.getComparableDates(
      this.userDates.selected,
      this.activeMonth,
      this.activeYear
    );
    let markedDates: number[] = this.userDates.getComparableDates(
      this.markedToEdit,
      this.activeMonth,
      this.activeYear
    );
    if (
      event &&
      comparableDates.includes(event.getDate()) &&
      !markedDates.includes(event.getDate())
    ) {
      this.markedToEdit.push(event);
    } else if (
      event &&
      comparableDates.includes(event.getDate()) &&
      markedDates.includes(event.getDate())
    ) {
      this.unmarkDate(event);
    }
    this.calendar?.updateTodaysDate();
  }

  unmarkDate(date: Date) {
    let index = this.markedToEdit.findIndex(
      (marked) =>
        this.dateFormatter.getStringFromDate(marked) ===
        this.dateFormatter.getStringFromDate(date)
    );
    this.markedToEdit.splice(index, 1);
  }
}
