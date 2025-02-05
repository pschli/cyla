import {
  animate,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, Inject, inject, ViewEncapsulation } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { merge } from 'rxjs';
import { DateDataService } from '../../../../services/date-data.service';
import { TimeslotSavedHandlerService } from '../../../../services/timeslot-saved-handler.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DurationsService } from '../../../../services/durations.service';

interface Time {
  timevalue: string;
}

interface AppointmentPeriod {
  start: string;
  end: string;
  duration: string;
  times: Time[];
}

interface TimeslotData {
  time: string;
  duration: string;
  reserved: boolean;
  blocked: boolean;
  taken: boolean;
  appointment?: {
    token: string | null;
  };
}

@Component({
  selector: 'app-edit-timeslots',
  standalone: true,
  imports: [
    AsyncPipe,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgIf,
    NgFor,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatExpansionModule,
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('addSelection', [
      transition('* => true', [
        query(':self', [style({ height: 0, width: '280px' })]),
        query(':enter', [style({ opacity: 0, scale: 0.9 })], {
          optional: true,
        }),
        query(
          ':leave',
          [
            style({ opacity: 1, scale: 1 }),
            animate('125ms ease-in-out', style({ opacity: 0, scale: 0.9 })),
          ],
          { optional: true }
        ),
        group([
          query(':self', [
            animate('0.3s ease-in-out', style({ height: '*', width: '392px' })),
          ]),
          query(
            ':enter',
            stagger(100, [
              animate(
                '125ms 100ms ease-in-out',
                style({ opacity: 1, scale: 1 })
              ),
            ]),
            { optional: true }
          ),
        ]),
      ]),
    ]),
    trigger('addText', [
      transition('* => true', [
        query(':self', [
          style({ height: 0, opacity: 0 }),
          animate('0.3s ease-in-out', style({ height: '*', opacity: 1 })),
        ]),
      ]),
    ]),
  ],
  templateUrl: './edit-timeslots.component.html',
  styleUrl: './edit-timeslots.component.scss',
})
export class EditTimeslotsComponent {
  dateservice: any;
  durationService = inject(DurationsService);
  durations$ = this.durationService.getValues();
  tsh = inject(TimeslotSavedHandlerService);
  private _snackBar = inject(MatSnackBar);
  duration = new FormControl<{ duration: string; name: string } | null>(
    null,
    Validators.required
  );
  startHours = new FormControl<Time | null>(null, Validators.required);
  startMinutes = new FormControl<Time | null>(null, Validators.required);
  endHours = new FormControl<Time | null>(
    { value: null, disabled: true },
    Validators.required
  );

  intervalFormControl = new FormControl<Time | null>(null, Validators.required);
  hours: Time[] = [];
  minutes: Time[] = [];
  durationDigits: Array<string> = [];
  endTimes: Time[] = [];
  selectedTimes: Time[] = [];
  deactivatedTimes: string[] = [];
  appointmentPeriods: AppointmentPeriod[] = [];

  editTimeslotForm = new FormGroup({
    duration: this.duration,
    startHours: this.startHours,
    startMinutes: this.startMinutes,
    endHours: this.endHours,
  });

  animationEnded: boolean = false;
  cancelHoverIndex: number = -1;

  constructor(
    public dialogRef: MatDialogRef<EditTimeslotsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dateservice = data.dateservice;
    for (let hour = 0; hour < 24; hour++) {
      let hourString = '';
      hourString = hour.toString();

      this.hours.push({ timevalue: hourString });
    }
    for (let min = 0; min < 60; min++) {
      let minuteString = '';
      if (min < 10) {
        minuteString = '0' + min.toString();
      } else {
        minuteString = min.toString();
      }
      this.minutes.push({ timevalue: minuteString });
    }
    merge(this.editTimeslotForm.controls.duration.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.updateEndTimeOptions();
        this.setDurationDigits();
      });
    merge(
      this.editTimeslotForm.controls.startHours.valueChanges,
      this.editTimeslotForm.controls.startMinutes.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.checkStartValid(), this.updateEndTimeOptions();
      });
    merge(
      this.editTimeslotForm.controls.startHours.valueChanges,
      this.editTimeslotForm.controls.startMinutes.valueChanges,
      this.editTimeslotForm.controls.duration.valueChanges,
      this.editTimeslotForm.controls.endHours.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        setTimeout(() => {
          this.showTimeslots(); // is this a problem?
        }, 100)
      );
  }

  saveAppointmentData() {
    if (this.editTimeslotForm.valid) this.commitValues();
    this.editTimeslotForm.disable();
    this.sendDataToBackend();
  }

  updateEndTimeOptions() {
    this.editTimeslotForm.controls.endHours.setValue(null);
    if (
      this.editTimeslotForm.controls.startHours.valid &&
      this.editTimeslotForm.controls.startMinutes.valid &&
      this.editTimeslotForm.controls.duration.valid
    ) {
      const timevalues: string[] = this.getTimeValues();
      if (timevalues.length > 0) {
        let endTimes: number[] = this.calculateEndTimes(timevalues);
        let endTimeStrings: string[] = this.convertMinutesToTimeValue(endTimes);
        this.setEndTimes(endTimeStrings);
      }
      this.editTimeslotForm.controls.endHours.enable();
    }
  }

  showTimeslots() {
    this.selectedTimes = [];
    if (this.editTimeslotForm.valid) {
      let timeString =
        this.editTimeslotForm.controls.startHours.value?.timevalue +
        ':' +
        this.editTimeslotForm.controls.startMinutes.value?.timevalue;
      this.selectedTimes.push({ timevalue: timeString });
      this.endTimes.forEach((timeslot) => {
        if (this.isEarlierThanSelectedEnd(timeslot.timevalue)) {
          this.selectedTimes.push(timeslot);
        }
      });
    }
  }

  commitValues() {
    const [hour, minutes] = this.getTimeValues();
    let durationsValue = '';
    if (this.editTimeslotForm.controls.duration.value)
      durationsValue = this.editTimeslotForm.controls.duration.value.duration;
    const appointmentPeriod: AppointmentPeriod = {
      start: hour + ':' + minutes,
      end: this.getEndTime(),
      duration: durationsValue,
      times: this.filterSelectedTimeslots(),
    };
    const endTime: string = this.recalculateEndTime(appointmentPeriod);
    appointmentPeriod.end = endTime;
    this.appointmentPeriods.push(appointmentPeriod);
  }

  recalculateEndTime(appointmentPeriod: AppointmentPeriod): string {
    const lastAppointment = this.getTimeNumber(
      appointmentPeriod.times[appointmentPeriod.times.length - 1].timevalue
    );
    const duration = this.getTimeNumber(appointmentPeriod.duration);
    const endTime = this.convertMinutesToHHMM(lastAppointment + duration);
    return endTime;
  }

  filterSelectedTimeslots(): Time[] {
    const result: Time[] = this.selectedTimes.filter(
      (time) => !this.deactivatedTimes.includes(time.timevalue)
    );
    return result;
  }

  addAppointmentPeriod() {
    this.commitValues();
    this.clearForm();
  }

  deactivateTimeslot(value: string) {
    this.deactivatedTimes.push(value);
  }

  activateTimeslot(value: string) {
    let index = this.deactivatedTimes.indexOf(value);
    this.deactivatedTimes.splice(index, 1);
  }

  setEndTimes(endTimeStrings: string[]) {
    this.endTimes = [];
    endTimeStrings.forEach((value) => {
      this.endTimes.push({ timevalue: value });
    });
  }

  calculateEndTimes(timevalues: string[]) {
    let endTimes: number[] = [];
    let [hour, minute] = timevalues;
    let durationValue = '';
    if (this.editTimeslotForm.controls.duration.value) {
      durationValue = this.editTimeslotForm.controls.duration.value.duration;
    }
    let startNum = parseInt(minute) + parseInt(hour) * 60;
    let durationNum: number = this.getTimeNumber(durationValue);
    let nextNum = startNum + durationNum;
    while (nextNum < 24 * 60) {
      endTimes.push(nextNum);
      nextNum += durationNum;
    }
    return endTimes;
  }

  checkStartValid() {
    if (this.appointmentPeriods.length === 0) return;
    if (
      this.editTimeslotForm.controls.startHours.value &&
      this.editTimeslotForm.controls.startMinutes.value
    ) {
      const endValue = this.getTimeNumber(
        this.appointmentPeriods[this.appointmentPeriods.length - 1].end
      );
      const startHour =
        this.editTimeslotForm.controls.startHours.value.timevalue;
      const startMinutes =
        this.editTimeslotForm.controls.startMinutes.value.timevalue;
      const startValue = this.getTimeNumber(startHour + ':' + startMinutes);
      if (startValue < endValue) this.setStartTimeError();
      else this.removeStartTimeError();
    }
  }

  setStartTimeError() {
    this.editTimeslotForm.controls.startHours.setErrors({
      'too early': true,
    });
    this.editTimeslotForm.controls.startMinutes.setErrors({
      'too early': true,
    });
  }

  removeStartTimeError() {
    this.removeFormControlError(
      this.editTimeslotForm.controls.startHours,
      'too early'
    );
    this.removeFormControlError(
      this.editTimeslotForm.controls.startMinutes,
      'too early'
    );
  }

  convertMinutesToTimeValue(endTimes: number[]) {
    let endTimeStrings: string[] = [];
    endTimes.forEach((value) => {
      let timeString = this.convertMinutesToHHMM(value);
      endTimeStrings.push(timeString);
    });
    return endTimeStrings;
  }

  convertMinutesToHHMM(value: number): string {
    let timeString: string;
    let minutes = value % 60;
    let minuteString = minutes.toString();
    if (minutes < 10) minuteString = '0' + minuteString;
    let hours = (value - minutes) / 60;
    timeString = hours.toString() + ':' + minuteString;
    return timeString;
  }

  getTimeValues() {
    let hour: string;
    let minutes: string;
    if (
      this.editTimeslotForm.controls.startHours.value !== null &&
      this.editTimeslotForm.controls.startMinutes.value !== null &&
      this.editTimeslotForm.controls.duration.value !== null
    ) {
      hour = this.editTimeslotForm.controls.startHours.value.timevalue;
      minutes = this.editTimeslotForm.controls.startMinutes.value.timevalue;

      return [hour, minutes];
    }
    return [];
  }

  getEndTime(): string {
    if (this.editTimeslotForm.controls.endHours.value) {
      return this.editTimeslotForm.controls.endHours.value.timevalue;
    } else return '24:00';
  }

  getNumberValue(value: string | undefined): number | null {
    if (value) return parseInt(value);
    else return null;
  }

  getTimeNumber(value: string): number {
    let numberValue: number = 0;
    let timeArray = this.getHoursAndMinutes(value);
    if (timeArray[0] && timeArray[1]) {
      numberValue = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    }
    return numberValue;
  }

  getHoursAndMinutes(value: string): Array<string> {
    let timeArray = value.split(':');
    return timeArray;
  }

  isEarlierThanSelectedEnd(value: string): boolean {
    if (
      this.editTimeslotForm.controls.endHours.valid &&
      this.editTimeslotForm.controls.endHours.value
    ) {
      let end = this.getTimeNumber(
        this.editTimeslotForm.controls.endHours.value.timevalue
      );
      let valueNumber = this.getTimeNumber(value);
      if (valueNumber < end) return true;
      else return false;
    } else return true;
  }

  setDurationDigits() {
    if (
      this.editTimeslotForm.controls.duration.valid &&
      this.editTimeslotForm.controls.duration.value
    ) {
      let value = this.editTimeslotForm.controls.duration.value.duration;
      this.durationDigits = this.getHoursAndMinutes(value);
    }
  }

  getValueToDisplay(value: string | undefined): number {
    if (value) {
      return parseInt(value);
    } else return 0;
  }

  cancelAppointmentPeriod(period: AppointmentPeriod) {
    let index = this.appointmentPeriods.indexOf(period);
    this.appointmentPeriods.splice(index, 1);
  }

  removeFormControlError(control: AbstractControl, errorName: string) {
    if (control?.errors && control?.errors[errorName]) {
      delete control.errors[errorName];
      if (Object.keys(control.errors).length === 0) {
        control.setErrors(null);
      }
    }
  }

  clearForm() {
    this.editTimeslotForm.reset();
    this.editTimeslotForm.controls.endHours.disable();
  }

  destructureAppointmenteriods(
    periods: AppointmentPeriod[]
  ): Array<TimeslotData> {
    const timesArray: Array<TimeslotData> = [];
    periods.forEach((period) => {
      period.times.forEach((time) => {
        timesArray.push({
          time: time.timevalue,
          duration: period.duration,
          reserved: false,
          blocked: false,
          taken: false,
          appointment: {
            token: null,
          },
        });
      });
    });
    return timesArray;
  }

  getDurations(periods: AppointmentPeriod[]): Array<string> {
    const durations: Array<string> = [];
    periods.forEach((period) => {
      durations.push(period.duration);
    });
    return durations;
  }

  sendDataToBackend() {
    const timesArray: Array<TimeslotData> = this.destructureAppointmenteriods(
      this.appointmentPeriods
    );
    const durations: Array<string> = this.getDurations(this.appointmentPeriods);
    let errors = this.dateservice.updateTimeslots(timesArray, durations);
    if (errors) {
      this._snackBar.open(
        'Fehler beim Speichern. Bitte erneut versuchen',
        'Ok',
        {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 4000,
        }
      );
    } else {
      this.tsh.requestAction();
      this.dialogRef.close();
    }
  }

  closeDialog(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }
}
