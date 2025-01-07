import {
  animate,
  group,
  query,
  stagger,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { merge } from 'rxjs';

interface Time {
  timevalue: string;
}

interface AppointmentPeriod {
  start: string;
  end: string;
  duration: string;
  times: Time[];
}

@Component({
  selector: 'app-edit-timeslots',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
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
  intervalHours = new FormControl<Time | null>(null, Validators.required);
  intervalMinutes = new FormControl<Time | null>(null, Validators.required);
  startHours = new FormControl<Time | null>(null, Validators.required);
  startMinutes = new FormControl<Time | null>(null, Validators.required);
  endHours = new FormControl<Time | null>(
    { value: null, disabled: true },
    Validators.required
  );

  intervalFormControl = new FormControl<Time | null>(null, Validators.required);
  hours: Time[] = [];
  minutes: Time[] = [];
  endTimes: Time[] = [];
  selectedTimes: Time[] = [];
  deactivatedTimes: string[] = [];
  appointmentPeriods: AppointmentPeriod[] = [];

  editTimeslotForm = new FormGroup({
    intervalHours: this.intervalHours,
    intervalMinutes: this.intervalMinutes,
    startHours: this.startHours,
    startMinutes: this.startMinutes,
    endHours: this.endHours,
  });

  animationEnded: boolean = false;

  constructor(public dialogRef: MatDialogRef<EditTimeslotsComponent>) {
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
    merge(this.editTimeslotForm.controls.intervalHours.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.checkDuration();
        this.updateEndTimeOptions();
      });
    merge(this.editTimeslotForm.controls.intervalMinutes.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.checkDuration();
        this.updateEndTimeOptions();
      });
    merge(
      this.editTimeslotForm.controls.startHours.valueChanges,
      this.editTimeslotForm.controls.startMinutes.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEndTimeOptions());
    merge(
      this.editTimeslotForm.controls.startHours.valueChanges,
      this.editTimeslotForm.controls.startMinutes.valueChanges,
      this.editTimeslotForm.controls.intervalMinutes.valueChanges,
      this.editTimeslotForm.controls.intervalHours.valueChanges,
      this.editTimeslotForm.controls.endHours.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() =>
        setTimeout(() => {
          this.showTimeslots(); // is this a problem?
        }, 100)
      );
  }

  updateEndTimeOptions() {
    this.editTimeslotForm.controls.endHours.setValue(null);
    if (
      this.editTimeslotForm.controls.startHours.valid &&
      this.editTimeslotForm.controls.startMinutes.valid &&
      this.editTimeslotForm.controls.intervalHours.valid &&
      this.editTimeslotForm.controls.intervalMinutes.valid
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
    console.log('commiting values');
    let [hour, minutes, durationH, durationMin] = this.getTimeValues();
    let appointmentPeriod: AppointmentPeriod = {
      start: hour + ':' + minutes,
      end: this.getEndTime(),
      duration: durationH + ':' + durationMin,
      times: [],
    };
    console.log(appointmentPeriod);
  }

  addAppointmentPeriod() {
    console.log('addAppointmentPeriod');
    this.commitValues();
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
    let [hour, minute, durationH, durationMin] = timevalues;
    let startNum = parseInt(minute) + parseInt(hour) * 60;
    let durationNum = parseInt(durationMin) + parseInt(durationH) * 60;
    let nextNum = startNum + durationNum;
    while (nextNum < 24 * 60) {
      endTimes.push(nextNum);
      nextNum += durationNum;
    }
    return endTimes;
  }

  convertMinutesToTimeValue(endTimes: number[]) {
    let endTimeStrings: string[] = [];
    endTimes.forEach((value) => {
      let minutes = value % 60;
      let minuteString = minutes.toString();
      if (minutes < 10) minuteString = '0' + minuteString;
      let hours = (value - minutes) / 60;
      endTimeStrings.push(hours.toString() + ':' + minuteString);
    });
    return endTimeStrings;
  }

  getTimeValues() {
    let hour: string;
    let minutes: string;
    let durationH: string;
    let durationMin: string;
    if (
      this.editTimeslotForm.controls.startHours.value !== null &&
      this.editTimeslotForm.controls.startMinutes.value !== null &&
      this.editTimeslotForm.controls.intervalHours.value !== null &&
      this.editTimeslotForm.controls.intervalMinutes.value !== null
    ) {
      hour = this.editTimeslotForm.controls.startHours.value.timevalue;
      minutes = this.editTimeslotForm.controls.startMinutes.value.timevalue;
      durationH = this.editTimeslotForm.controls.intervalHours.value.timevalue;
      durationMin =
        this.editTimeslotForm.controls.intervalMinutes.value.timevalue;
      return [hour, minutes, durationH, durationMin];
    }
    return [];
  }

  getEndTime(): string {
    if (this.editTimeslotForm.controls.endHours.value) {
      return this.editTimeslotForm.controls.endHours.value.timevalue;
    } else return '24:00';
  }

  checkDuration() {
    let hourValue = this.getNumberValue(
      this.editTimeslotForm.controls.intervalHours.value?.timevalue
    );
    let minuteValue = this.getNumberValue(
      this.editTimeslotForm.controls.intervalMinutes.value?.timevalue
    );
    if (hourValue === null || minuteValue === null) return;
    if (hourValue + minuteValue === 0) {
      this.editTimeslotForm.controls.intervalMinutes.setErrors({
        'sum is zero': true,
      });
    }
  }

  getNumberValue(value: string | undefined): number | null {
    if (value) return parseInt(value);
    else return null;
  }

  getTimeNumber(value: string): number {
    let numberValue: number = 0;
    let timeArray = value.split(':');
    if (timeArray[0] && timeArray[1]) {
      numberValue = parseInt(timeArray[0]) * 60 + parseInt(timeArray[1]);
    }
    return numberValue;
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

  getValueToDisplay(value: string | undefined): number {
    if (value) {
      return parseInt(value);
    } else return 0;
  }

  closeDialog(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }
}
