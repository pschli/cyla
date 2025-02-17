import { HttpClient } from '@angular/common/http';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateDataService } from '../../../../services/date-data.service';
import { Timeslot } from '../../../../interfaces/timeslot';
import { MatButton } from '@angular/material/button';
import { DateFormatterService } from '../../../../services/date-formatter.service';
import { NgIf } from '@angular/common';

interface dataType {
  userDates: DateDataService;
  date: string;
  time: Timeslot;
}

@Component({
  selector: 'app-appointment-settings',
  standalone: true,
  imports: [MatButton, NgIf],
  templateUrl: './appointment-settings.component.html',
  styleUrl: './appointment-settings.component.scss',
})
export class AppointmentSettingsComponent {
  userDates: DateDataService;
  dateFormatter = inject(DateFormatterService);
  date: string;
  time: Timeslot;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AppointmentSettingsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataType
  ) {
    this.userDates = data.userDates;
    this.date = data.date;
    this.time = data.time;
  }

  toggleBlock(blocked: boolean) {
    console.log('toggle to', !blocked);
    this.closeDialog();
  }

  formatDate(day: string): string {
    return this.dateFormatter.getShortDate(day);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
