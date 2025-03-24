import { AfterViewInit, Component, inject, model, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs/operators';
import { MonthDisplayComponent } from './month-display/month-display.component';
import { DateDataService } from '../../services/date-data.service';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChooseTimeslotsComponent } from './choose-timeslots/choose-timeslots.component';
import { MatDividerModule } from '@angular/material/divider';
import { DateFormatterService } from '../../services/date-formatter.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTimeslotsComponent } from './dialog/edit-timeslots/edit-timeslots.component';
import { RefreshCalendarStateService } from '../../services/refresh-calendar-state.service';
import { TimeslotSavedHandlerService } from '../../services/timeslot-saved-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { DurationSettingComponent } from './duration-setting/duration-setting.component';
import { MatButton, MatFabButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { EditPlannedWarningComponent } from './dialog/edit-planned-warning/edit-planned-warning.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

type Weekday = 'mo' | 'di' | 'mi' | 'do' | 'fr' | 'sa' | 'so';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    MatCardModule,
    MatButton,
    MatCheckbox,
    MatFabButton,
    MonthDisplayComponent,
    MatIconModule,
    ChooseTimeslotsComponent,
    MatDividerModule,
    MatTabsModule,
    DurationSettingComponent,
    MatButtonToggleModule,
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
    if (trigger && trigger !== 0) {
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
    ['mo', 'Montag'],
    ['di', 'Dienstag'],
    ['mi', 'Mittwoch'],
    ['do', 'Donnerstag'],
    ['fr', 'Freitag'],
    ['sa', 'Samstag'],
    ['so', 'Sonntag'],
  ];

  allowEdit = model(false);
  warningShown = false;

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
        data: { dateservice: this.userDates },
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
    this.updateCalendars();
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
      if (
        date.getDay() === this.dayNumber[day] &&
        this.dateIsNotMarked(date) &&
        this.dateCanBeMarked(date)
      ) {
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
    this.toggleAll('off');
    this.updateCalendars();
    this.tsh.resetTrigger();
  }

  dateIsNotMarked(date: Date) {
    let result = this.userDates.markedToEdit.some((markedDate) => {
      this.compareDateByString(markedDate, date);
    });
    return !result;
  }

  dateCanBeMarked(date: Date) {
    let taken = this.userDates.taken.some((takenDate) => {
      return this.compareDateByString(takenDate, date);
    });
    if (taken) return false;
    if (this.allowEdit()) return true;
    let result = this.userDates.planned.some((plannedDate) => {
      return this.compareDateByString(plannedDate, date);
    });
    return !result;
  }

  compareDateByString(first: Date, second: Date) {
    return (
      this.dateFormatter.getStringFromDate(first) ===
      this.dateFormatter.getStringFromDate(second)
    );
  }

  tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.setActiveMode(tabChangeEvent.index);
  }

  showWarning() {
    if (!this.allowEdit || this.warningShown) return;
    this.warningShown = true;
    const dialogRef = this.dialog.open(EditPlannedWarningComponent, {});
  }

  updateCalendars() {
    setTimeout(() => {
      this.refreshCalendarService.requestUpdate();
    }, 100);
  }
}
