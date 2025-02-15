import { Component, Inject, inject, model } from '@angular/core';
import { DateFormatterService } from '../../../../services/date-formatter.service';
import { DateDataService } from '../../../../services/date-data.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

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
  imports: [
    MatButton,
    FormsModule,
    MatCheckbox,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
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
        duration: string;
        email: string;
        name: string;
        token: string | null;
      }
    | undefined = undefined;

  allowCancel = model(false);
  omitMessage = model(false);
  topic = new FormControl({ value: '', disabled: this.omitMessage() }, [
    Validators.required,
  ]);
  message = new FormControl({ value: '', disabled: this.omitMessage() }, [
    Validators.required,
  ]);

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<AppointmentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dataType
  ) {
    this.userDates = data.userDates;
    this.date = data.date;
    this.time = data.time;
    this.getAppointment();
    this.topic.setValue(`Terminabsage: ${this.formatDate(this.date)}`);
    this.message.setValue(`Hallo ${this.timeslot!.name},
Leider müssen wir deinen Termin am ${this.formatDate(this.date)} um ${
      this.time.time
    } Uhr absagen. Vereinbare gerne einen neuen Termin. 
Mit freundlichen Grüßen
`);
  }

  getAppointment() {
    if (this.time.appointment?.email && this.time.appointment?.name) {
      this.timeslot = structuredClone({
        date: this.date,
        time: this.time.time,
        duration: this.time.duration,
        email: this.time.appointment.email,
        name: this.time.appointment?.name,
        token: this.time.appointment.token,
      });
    }
  }

  async cancelAppointment() {
    if (this.timeslot?.date && this.timeslot.time) {
      let result = await this.userDates.removeAppointment(
        this.timeslot.date,
        this.timeslot.time
      );
      if (result === 'cancelled') {
        let response = await this.handleTokenAndMessage(this.omitMessage());
      }
    }
    this.closeDialog();
  }

  async handleTokenAndMessage(omit: boolean) {
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/cancelbyuser';
    if (
      this.timeslot?.token &&
      this.timeslot?.email &&
      this.topic.value &&
      this.message.value
    ) {
      let params = {
        token: this.timeslot?.token,
        email: this.timeslot?.email,
        topic: this.topic.value,
        message: this.message.value,
        omit: omit ? 'true' : 'false',
      };
      console.log(omit);
      console.log(this.timeslot?.email);
      console.log(this.timeslot?.token);
      console.log(this.topic.value);
      console.log(this.message.value);
      console.log(params);
      try {
        const response = await firstValueFrom(
          this.http.get(url, {
            params: params,
            responseType: 'json',
          })
        );
        console.log(response);
        return response;
      } catch (err) {
        return 'error';
      }
    }
    return 'error';
  }

  setDisable() {
    this.omitMessage() ? this.topic.disable() : this.topic.enable();
    this.omitMessage() ? this.message.disable() : this.message.enable();
  }

  formatDate(day: string): string {
    return this.dateFormatter.getShortDate(day);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
