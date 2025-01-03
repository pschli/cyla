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
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { merge } from 'rxjs';

interface Time {
  timevalue: string;
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
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  animations: [
    trigger('addSelection', [
      transition('* => *', [
        query(':self', [style({ height: 0, width: '280px' })]),
        query(':enter', [style({ opacity: 0, scale: 0.9 })], {
          optional: true,
        }),
        query(
          ':leave',
          [
            style({ opacity: 1, scale: 1 }),
            animate('125ms ease-in', style({ opacity: 0, scale: 0.9 })),
          ],
          { optional: true }
        ),
        group([
          query(':self', [
            animate('0.3s ease-in', style({ height: '*', width: '*' })),
          ]),
          query(
            ':enter',
            stagger(100, [
              animate('125ms ease-in', style({ opacity: 1, scale: 1 })),
            ]),
            { optional: true }
          ),
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
  endHours = new FormControl<Time | null>(null, Validators.required);
  endMinutes = new FormControl<Time | null>(null, Validators.required);
  intervalFormControl = new FormControl<Time | null>(null, Validators.required);
  hours: Time[] = [];
  minutes: Time[] = [];

  editTimeslotForm = new FormGroup({
    intervalHours: this.intervalHours,
    intervalMinutes: this.intervalMinutes,
    startHours: this.startHours,
    startMinutes: this.startMinutes,
    endHours: this.endHours,
    endMinutes: this.endMinutes,
  });

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
      .subscribe(() => this.checkDuration());
    merge(this.editTimeslotForm.controls.intervalMinutes.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.checkDuration());
    merge(
      this.editTimeslotForm.controls.endHours.valueChanges,
      this.editTimeslotForm.controls.startHours.valueChanges,
      this.editTimeslotForm.controls.endMinutes.valueChanges,
      this.editTimeslotForm.controls.startMinutes.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateTimeslots());
  }

  updateTimeslots() {
    if (this.editTimeslotForm.valid) {
      console.log(
        'updating',
        this.editTimeslotForm.controls.startHours.value?.timevalue,
        this.editTimeslotForm.controls.startMinutes.value?.timevalue,
        this.editTimeslotForm.controls.endHours.value?.timevalue,
        this.editTimeslotForm.controls.endMinutes.value?.timevalue
        // Interval
      );
    }
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
