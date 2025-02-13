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
import { RefreshCalendarStateService } from '../../../services/refresh-calendar-state.service';
import { MatDialog } from '@angular/material/dialog';
import { TakenWarningComponent } from '../dialog/taken-warning/taken-warning.component';

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
  @Input() allowEdit?: boolean;
  readonly customHeader = CalendarCustomHeader;
  userDates = inject(DateDataService);
  dateFormatter = inject(DateFormatterService);
  refreshCalendarService = inject(RefreshCalendarStateService);
  @Input() inputMonth?: Date;
  minDate: Date = new Date();
  startingMonth: Date = new Date();
  activeMonth = this.startingMonth.getMonth();
  activeYear = this.startingMonth.getFullYear();
  refreshTrigger = this.refreshCalendarService
    .getTrigger()
    .subscribe((trigger) => {
      this.refreshCalendar();
    });

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.inputMonth) this.startingMonth = this.inputMonth;
    this.activeMonth = this.startingMonth.getMonth();
    this.activeYear = this.startingMonth.getFullYear();
  }

  ngOnDestroy(): void {
    this.refreshTrigger.unsubscribe();
  }

  @ViewChild(MatCalendar) calendar?: MatCalendar<Date>;

  dateClass = (date: Date): MatCalendarCellCssClasses => {
    let markedDates: number[] = this.getComparableDates('marked');
    let plannedDates: number[] = this.getComparableDates('planned');
    let takenDates: number[] = this.getComparableDates('taken');
    if (takenDates.includes(date.getDate())) {
      return 'taken-date';
    }
    if (
      plannedDates.includes(date.getDate()) &&
      !markedDates.includes(date.getDate())
    ) {
      if (this.allowEdit) return 'planned-allowed';
      return 'planned-date';
    }
    if (markedDates.includes(date.getDate())) {
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
    if (!event) return;
    let comparableDates: number[] = this.getComparableDates('selected');
    let markedDates: number[] = this.getComparableDates('marked');
    let plannedDates: number[] = this.getComparableDates('planned');
    let takenDates: number[] = this.getComparableDates('taken');
    if (
      !plannedDates.includes(event.getDate()) &&
      !takenDates.includes(event.getDate())
    ) {
      if (
        comparableDates.includes(event.getDate()) &&
        !markedDates.includes(event.getDate())
      ) {
        this.userDates.markedToEdit.push(event);
      } else if (
        comparableDates.includes(event.getDate()) &&
        markedDates.includes(event.getDate())
      ) {
        this.unmarkDate(event);
      }
    } else if (
      plannedDates.includes(event.getDate()) &&
      !takenDates.includes(event.getDate())
    ) {
      this.handlePlanned(event, markedDates);
    } else if (takenDates.includes(event.getDate())) {
      this.handleTaken(event);
    }
    this.calendar?.updateTodaysDate();
  }

  handlePlanned(date: Date, markedDates: number[]) {
    if (this.allowEdit) {
      if (!markedDates.includes(date.getDate())) {
        this.userDates.markedToEdit.push(date);
      } else this.unmarkDate(date);
    }
    this.calendar?.updateTodaysDate();
  }

  handleTaken(date: Date) {
    const dialogRef = this.dialog.open(TakenWarningComponent, {
      panelClass: 'custom-dialog-panel',
      data: { userDates: this.userDates, date: date },
    });
  }

  unmarkDate(date: Date) {
    let index = this.userDates.markedToEdit.findIndex(
      (marked) =>
        this.dateFormatter.getStringFromDate(marked) ===
        this.dateFormatter.getStringFromDate(date)
    );
    this.userDates.markedToEdit.splice(index, 1);
  }

  getComparableDates(
    selection: 'selected' | 'taken' | 'marked' | 'planned'
  ): number[] {
    if (selection === 'selected')
      return this.userDates.getComparableDates(
        this.userDates.selected,
        this.activeMonth,
        this.activeYear
      );
    else if (selection === 'taken')
      return this.userDates.getComparableDates(
        this.userDates.taken,
        this.activeMonth,
        this.activeYear
      );
    else if (selection === 'planned')
      return this.userDates.getComparableDates(
        this.userDates.planned,
        this.activeMonth,
        this.activeYear
      );
    else
      return this.userDates.getComparableDates(
        this.userDates.markedToEdit,
        this.activeMonth,
        this.activeYear
      );
  }

  checkMatchForDateGroup(comparableDates: number[], date: Date): boolean {
    if (comparableDates.includes(date.getDate())) return true;
    return false;
  }

  refreshCalendar() {
    this.calendar?.updateTodaysDate();
  }
}
