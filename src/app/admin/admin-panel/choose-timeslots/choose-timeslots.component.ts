import {
  Component,
  inject,
  Input,
  OnDestroy,
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
export class ChooseTimeslotsComponent implements OnDestroy {
  readonly customHeader = CalendarCustomHeader;
  userDates = inject(DateDataService);
  dateFormatter = inject(DateFormatterService);
  @Input() inputMonth?: Date;
  minDate: Date = new Date();
  startingMonth: Date = new Date();
  activeMonth = this.startingMonth.getMonth();
  activeYear = this.startingMonth.getFullYear();
  refreshTriger = this.userDates.refreshCounter$.subscribe((trigger) => {
    this.refreshCalendar();
  });

  ngOnInit(): void {
    if (this.inputMonth) this.startingMonth = this.inputMonth;
    this.activeMonth = this.startingMonth.getMonth();
    this.activeYear = this.startingMonth.getFullYear();
  }

  ngOnDestroy(): void {
    this.refreshTriger.unsubscribe();
  }

  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let comparableDates: number[] = this.userDates.getComparableDates(
      this.userDates.markedToEdit,
      this.activeMonth,
      this.activeYear
    );
    if (comparableDates.includes(date.getDate())) {
      return 'marked-date';
    } else {
      return '';
    }
  };

  dateFilter = (d: Date | null): boolean => {
    const comparableDates: number[] = this.userDates.getComparableDates(
      this.userDates.selected,
      this.activeMonth,
      this.activeYear
    );
    const day = (d || new Date()).getDate();
    return comparableDates.includes(day);
  };

  selectedChange(event: Date | null): void {
    let comparableDates: number[] = this.userDates.getComparableDates(
      this.userDates.selected,
      this.activeMonth,
      this.activeYear
    );
    let markedDates: number[] = this.userDates.getComparableDates(
      this.userDates.markedToEdit,
      this.activeMonth,
      this.activeYear
    );
    if (
      event &&
      comparableDates.includes(event.getDate()) &&
      !markedDates.includes(event.getDate())
    ) {
      this.userDates.markedToEdit.push(event);
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
    let index = this.userDates.markedToEdit.findIndex(
      (marked) =>
        this.dateFormatter.getStringFromDate(marked) ===
        this.dateFormatter.getStringFromDate(date)
    );
    this.userDates.markedToEdit.splice(index, 1);
  }

  refreshCalendar() {
    this.calendar?.updateTodaysDate();
  }
}
