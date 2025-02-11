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
  minDate: Date = new Date();
  startingMonth: Date = new Date();
  activeMonth = this.startingMonth.getMonth();
  activeYear = this.startingMonth.getFullYear();
  userDates = inject(DateDataService);

  ngOnInit(): void {
    if (this.inputMonth) this.startingMonth = this.inputMonth;
    this.activeMonth = this.startingMonth.getMonth();
    this.activeYear = this.startingMonth.getFullYear();
  }

  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let comparableDates: number[] = this.getComparableDates('taken');
    let matchesTaken = this.checkMatchForDateGroup(comparableDates, date);
    if (matchesTaken) return 'warning-date';
    comparableDates = this.getComparableDates('selected');
    let matchesSelected = this.checkMatchForDateGroup(comparableDates, date);
    if (matchesSelected) return 'highlight-date';
    else return '';
  };

  public selectForChange(event: Date | null): void {
    if (!event) return;
    let comparableTaken: number[] = this.getComparableDates('taken');
    let matchesTaken = this.checkMatchForDateGroup(comparableTaken, event);
    if (matchesTaken) this.takenChangeDialog(event);
    else this.selectedChange(event);
  }

  selectedChange(date: Date) {
    let comparableSelected: number[] = this.getComparableDates('selected');
    let matchesSelected = this.checkMatchForDateGroup(comparableSelected, date);
    if (!matchesSelected) {
      this.userDates.addToSelected(date);
    } else if (matchesSelected) {
      this.userDates.removeFromSelected(date);
    }
    this.calendar?.updateTodaysDate();
  }

  takenChangeDialog(date: Date) {
    console.log('taken change dialog open:', date);
  }

  getComparableDates(selection: 'selected' | 'taken'): number[] {
    if (selection === 'selected')
      return this.userDates.getComparableDates(
        this.userDates.selected,
        this.activeMonth,
        this.activeYear
      );
    else
      return this.userDates.getComparableDates(
        this.userDates.taken,
        this.activeMonth,
        this.activeYear
      );
  }

  checkMatchForDateGroup(comparableDates: number[], date: Date): boolean {
    if (comparableDates.includes(date.getDate())) return true;
    return false;
  }
}
