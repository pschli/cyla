import { Component, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DateFormatterService } from '../../services/date-formatter.service';
import { DateDataService } from '../../services/date-data.service';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgClass, NgFor } from '@angular/common';
import { Timeslot } from '../../interfaces/timeslot';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDetailDialogComponent } from '../admin-panel/dialog/appointment-detail-dialog/appointment-detail-dialog.component';
import { AppointmentSettingsComponent } from '../admin-panel/dialog/appointment-settings/appointment-settings.component';

@Component({
  selector: 'app-dates-info',
  standalone: true,
  imports: [MatExpansionModule, MatButtonModule, NgClass, NgFor, AsyncPipe],
  templateUrl: './dates-info.component.html',
  styleUrl: './dates-info.component.scss',
})
export class DatesInfoComponent {
  readonly panelOpenState = signal(false);
  dateFormatter = inject(DateFormatterService);
  userDates = inject(DateDataService);

  constructor(public dialog: MatDialog) {}

  formatDate(day: string): string {
    return this.dateFormatter.getLocalDate(day);
  }

  editTimeslot(date: string, time: Timeslot) {
    if (time.taken) {
      this.openAppointmentDetails(date, time);
    } else {
      this.changeAppointmentSettings(date, time);
    }
  }

  openAppointmentDetails(date: string, time: Timeslot) {
    const dialogRef = this.dialog.open(AppointmentDetailDialogComponent, {
      panelClass: 'custom-dialog-panel',
      data: { userDates: this.userDates, date: date, time: time },
    });
  }

  changeAppointmentSettings(date: string, time: Timeslot) {
    const dialogRef = this.dialog.open(AppointmentSettingsComponent, {
      panelClass: 'custom-dialog-panel',
      data: { userDates: this.userDates, date: date, time: time },
    });
  }
}
