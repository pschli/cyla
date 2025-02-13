import { Component, Inject, inject } from '@angular/core';
import { DateFormatterService } from '../../../../services/date-formatter.service';
import { DateDataService } from '../../../../services/date-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserDates } from '../../../../interfaces/user-dates';
import { MatButton } from '@angular/material/button';

interface TimeData {
  time: string;
  duration: string;
  reserved: boolean;
  blocked: boolean;
  taken: boolean;
  appointment?:
    | {
        token: string | null;
        name?: string | undefined;
        email?: string | undefined;
      }
    | undefined;
}

interface dataType {
  userDates: DateDataService;
  date: string;
  time: TimeData;
}

@Component({
  selector: 'app-appointment-detail-dialog',
  standalone: true,
  imports: [MatButton],
  templateUrl: './appointment-detail-dialog.component.html',
  styleUrl: './appointment-detail-dialog.component.scss',
})
export class AppointmentDetailDialogComponent {
  dateFormatter = inject(DateFormatterService);
  userDates: DateDataService;
  date: string;
  time: TimeData;
  timeslot:
    | {
        date: string;
        time: string;
        email: string;
        name: string;
      }
    | undefined = undefined;

  constructor(
    public dialogRef: MatDialogRef<AppointmentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataType
  ) {
    this.userDates = data.userDates;
    this.date = data.date;
    this.time = data.time;
    this.getAppointment();
  }

  getAppointment() {
    if (this.time.appointment?.email && this.time.appointment?.name) {
      this.timeslot = {
        date: this.date,
        time: this.time.time,
        email: this.time.appointment.email,
        name: this.time.appointment?.name,
      };
    }
  }

  cancelAppointment() {
    console.log('cancel appointment');
  }

  formatDate(day: string): string {
    return this.dateFormatter.getShortDate(day);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
