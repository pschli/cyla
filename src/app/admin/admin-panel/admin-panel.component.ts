import {
  AfterViewInit,
  booleanAttribute,
  Component,
  inject,
  signal,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs/operators';
import { MonthDisplayComponent } from './month-display/month-display.component';
import { DateDataService } from '../../services/date-data.service';
import { MatIconModule } from '@angular/material/icon';
import { DatesInfoComponent } from '../dates-info/dates-info.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChooseTimeslotsComponent } from './choose-timeslots/choose-timeslots.component';
import { NgIf } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { DateFormatterService } from '../../services/date-formatter.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTimeslotsComponent } from './dialog/edit-timeslots/edit-timeslots.component';
import { RefreshCalendarStateService } from '../../services/refresh-calendar-state.service';
import { TimeslotSavedHandlerService } from '../../services/timeslot-saved-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';

type Weekday = 'mo' | 'di' | 'mi' | 'do' | 'fr' | 'sa' | 'so';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    DatesInfoComponent,
    MatCardModule,
    MatButtonModule,
    MonthDisplayComponent,
    MatIconModule,
    ChooseTimeslotsComponent,
    NgIf,
    MatDividerModule,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements AfterViewInit {
  authService = inject(AuthService);
  router = inject(Router);
  userDates = inject(DateDataService);
  dateFormatter = inject(DateFormatterService);
  refreshCalendarService = inject(RefreshCalendarStateService);
  tsh = inject(TimeslotSavedHandlerService);
  private _snackBar = inject(MatSnackBar);
  loading: boolean = true;
  username$ = this.authService.user$.pipe(map((user) => user?.displayName));
  successHandlerSub = this.tsh.getTrigger().subscribe((trigger) => {
    if (trigger !== 0) {
      this.handleTimeslotsSaved();
    }
  });
  user: string = '';
  monthsToDisplay: Date[] = [];
  activeMode = signal(0);
  monthLoaded = false;
  dayToggledOn = {
    mo: false,
    di: false,
    mi: false,
    do: false,
    fr: false,
    sa: false,
    so: false,
  };
  dayNumber = {
    mo: 1,
    di: 2,
    mi: 3,
    do: 4,
    fr: 5,
    sa: 6,
    so: 0,
  };
  dayString: [Weekday, string][] = [
    ['mo', 'Mon'],
    ['di', 'Die'],
    ['mi', 'Mit'],
    ['do', 'Don'],
    ['fr', 'Fre'],
    ['sa', 'Sam'],
    ['so', 'Son'],
  ];

  constructor(public dialog: MatDialog) {
    this.userDates.dataLoaded.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => {
        if (!data || this.monthLoaded) return;
        this.loadMonthsNumber();
        this.monthLoaded = true;
      },
    });
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.username$.subscribe((name) => {
      if (name) this.user = name;
    });
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
        this.loading = false;
      } else {
        this.authService.currentUserSig.set(null);
        this.router.navigateByUrl('');
      }
    });
  }

  ngOnDestroy(): void {
    this.successHandlerSub.unsubscribe();
  }

  loadMonthsNumber() {
    let lastDate = new Date();
    if (this.userDates.selected.length > 0) {
      lastDate = this.userDates.selected[this.userDates.selected.length - 1];
    }
    let lastYear = lastDate.getFullYear();
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let yearDiff = lastYear - currentYear;
    let lastMonth = lastDate.getMonth() + yearDiff * 12;
    let monthDiff = lastMonth - currentMonth;
    this.monthsToDisplay = [];
    for (let i = 0; i <= monthDiff; i++) {
      this.monthsToDisplay.push(new Date(currentYear, currentMonth + i));
    }
    return true;
  }

  addMonth() {
    let lastMonth = this.monthsToDisplay[this.monthsToDisplay.length - 1];
    this.monthsToDisplay.push(
      new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1)
    );
  }

  setActiveMode(mode: number) {
    this.activeMode.set(mode);
  }

  openEditTimeslots() {
    if (this.userDates.markedToEdit.length > 0) {
      const dialogRef = this.dialog.open(EditTimeslotsComponent, {
        panelClass: 'custom-dialog-panel',
      });
    }
  }

  toggleAll(toggleState: 'on' | 'off') {
    let switchOn = false;
    if (toggleState === 'on') switchOn = true;
    let allDays: Weekday[] = ['mo', 'di', 'mi', 'do', 'fr', 'sa', 'so'];
    allDays.forEach((day) => {
      this.dayToggledOn[day] = switchOn;
      this.updateMarkedDates(day);
    });
    this.refreshCalendarService.requestUpdate();
  }

  toggleWeekday(weekday: Weekday) {
    this.dayToggledOn[weekday] = !this.dayToggledOn[weekday];
    this.updateMarkedDates(weekday);
    this.refreshCalendarService.requestUpdate();
  }

  updateMarkedDates(day: Weekday) {
    if (this.dayToggledOn[day]) this.markDatesByWeekday(day);
    else this.unmarkDatesByWeekday(day);
  }

  markDatesByWeekday(day: Weekday) {
    this.userDates.selected.forEach((date) => {
      if (date.getDay() === this.dayNumber[day] && this.dateIsNotMarked(date)) {
        this.userDates.markedToEdit.push(date);
      }
    });
  }

  unmarkDatesByWeekday(day: Weekday) {
    let toUnmark = this.userDates.markedToEdit.filter(
      (date) => date.getDay() === this.dayNumber[day]
    );
    toUnmark.forEach((unmark) => {
      let index = this.userDates.markedToEdit.findIndex((marked) => {
        if (this.compareDateByString(unmark, marked)) return true;
        else return false;
      });
      this.userDates.markedToEdit.splice(index, 1);
    });
  }

  handleTimeslotsSaved() {
    this._snackBar.open('Daten gespeichert', 'Ok', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 4000,
    });
    this.userDates.markedToEdit = [];
    this.refreshCalendarService.requestUpdate();
  }

  dateIsNotMarked(date: Date) {
    let result = this.userDates.markedToEdit.some((markedDate) => {
      this.compareDateByString(markedDate, date);
    });
    return !result;
  }

  compareDateByString(first: Date, second: Date) {
    return (
      this.dateFormatter.getStringFromDate(first) ===
      this.dateFormatter.getStringFromDate(second)
    );
  }
}
