import { Component, Inject, inject, model } from '@angular/core';
import { DateFormatterService } from '../../../../services/date-formatter.service';
import { DateDataService } from '../../../../services/date-data.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { RefreshCalendarStateService } from '../../../../services/refresh-calendar-state.service';
import { Timeslot } from '../../../../interfaces/timeslot';
import { animate, style, transition, trigger } from '@angular/animations';

interface dataType {
  userDates: DateDataService;
  date: string;
  time: Timeslot;
}

interface ServerResponse {
  response: string;
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
    MatDialogModule,
  ],
  templateUrl: './appointment-detail-dialog.component.html',
  styleUrl: './appointment-detail-dialog.component.scss',
  animations: [
    trigger('messagePane', [
      transition(':enter', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate('200ms ease-in-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*', overflow: 'hidden' }),
        animate(
          '200ms ease-in-out',
          style({ opacity: 0, height: 0, overflow: 'hidden' })
        ),
      ]),
    ]),
  ],
})
export class AppointmentDetailDialogComponent {
  dateFormatter = inject(DateFormatterService);
  private _snackBar = inject(MatSnackBar);
  refreshCalendarService = inject(RefreshCalendarStateService);
  userDates: DateDataService;
  date: string;
  time: Timeslot;
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

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

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
    } Uhr absagen. Vereinbare gerne einen neuen Termin unter: ${
      this.userDates.userBaseData.publiclink
    }. 
Mit freundlichen Grüßen
${this.userDates.userBaseData.firstname} ${this.userDates.userBaseData.lastname}
${this.userDates.userBaseData.email}
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
        let response: ServerResponse = await this.handleTokenAndMessage(
          this.omitMessage()
        );
        this.showCancelResult(response.response);
      }
    }
    this.refreshCalendarService.requestUpdate();
    this.closeDialog();
  }

  private async handleTokenAndMessage(omit: boolean) {
    let url = 'https://cancelbyuser-rlvuhdpanq-uc.a.run.app';
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
      try {
        const response: ServerResponse = await firstValueFrom(
          this.http.get<ServerResponse>(url, {
            params: params,
            responseType: 'json',
          })
        );
        return response;
      } catch (err) {
        return { response: 'error' };
      }
    }
    return { response: 'error' };
  }

  private showCancelResult(result: string) {
    result === 'ok'
      ? (result = 'Termin gelöscht')
      : (result = 'Fehler beim Löschen');
    this._snackBar.open(result, 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
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
