import { Component, inject, Inject, model, ModelSignal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateDataService } from '../../../../services/date-data.service';
import { Timeslot } from '../../../../interfaces/timeslot';
import { MatButton } from '@angular/material/button';
import { DateFormatterService } from '../../../../services/date-formatter.service';
import { UserDates } from '../../../../interfaces/user-dates';
import { FirestoreService } from '../../../../services/firestore.service';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

interface dataType {
  userDates: DateDataService;
  date: string;
  day: UserDates;
  time: Timeslot;
}

@Component({
  selector: 'app-appointment-settings',
  standalone: true,
  imports: [MatSlideToggleModule, MatButton, FormsModule],
  templateUrl: './appointment-settings.component.html',
  styleUrl: './appointment-settings.component.scss',
})
export class AppointmentSettingsComponent {
  userDates: DateDataService;
  fs = inject(FirestoreService);
  dateFormatter = inject(DateFormatterService);
  private _snackBar = inject(MatSnackBar);
  date: string;
  time: Timeslot;
  day: UserDates;
  slider: ModelSignal<boolean> = model<boolean>(false);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    public dialogRef: MatDialogRef<AppointmentSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataType
  ) {
    this.userDates = data.userDates;
    this.day = data.day;
    this.date = data.date;
    this.time = data.time;
    this.slider.set(!this.time.blocked);
  }

  async toggleBlock(blocked: boolean) {
    let result = await this.updateAppointment(
      this.day,
      this.date,
      this.time.time,
      !blocked
    );
    if (result === 'cancelled') this.showResult(!blocked);
    else this.showResult(!blocked, 'error');
  }

  async updateAppointment(
    day: UserDates,
    date: string,
    time: string,
    block: boolean
  ) {
    if (day.date !== date) return 'error';
    let sourceTimes: Timeslot[] = day.times;
    let targetTimes: Timeslot[] = [];
    if (sourceTimes.length > 0) {
      sourceTimes.forEach((timeElement: Timeslot) => {
        let newTimeElement: Timeslot = timeElement;
        if (timeElement.time === time) {
          newTimeElement.blocked = block;
        }
        targetTimes.push(newTimeElement);
      });
    }
    if (targetTimes.length === 0) return 'error';
    let result = await this.fs.updateTimes(date, targetTimes);
    return result;
  }

  showResult(block: boolean, result: string = 'success') {
    let message = '';
    if (result === 'success') {
      return;
    } else {
      message = block
        ? 'Fehler: Termin konnte nicht geblockt werden'
        : 'Fehler: Termin konnte nicht freigegeben werden';
    }
    this.showSnackbar(message);
  }

  showSnackbar(message: string) {
    this._snackBar.open(message, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  formatDate(day: string): string {
    return this.dateFormatter.getShortDate(day);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
