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
  MatDialog,
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

    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './edit-timeslots.component.html',
  styleUrl: './edit-timeslots.component.scss',
})
export class EditTimeslotsComponent {
  startHours = new FormControl<Time | null>(null, Validators.required);
  startMinutes = new FormControl<Time | null>(null, Validators.required);
  endHours = new FormControl<Time | null>(null, Validators.required);
  endMinutes = new FormControl<Time | null>(null, Validators.required);
  intervalFormControl = new FormControl<Time | null>(null, Validators.required);
  hours: Time[] = [
    { timevalue: '0' },
    { timevalue: '1' },
    { timevalue: '2' },
    { timevalue: '3' },
    { timevalue: '4' },
    { timevalue: '5' },
    { timevalue: '6' },
    { timevalue: '7' },
    { timevalue: '8' },
    { timevalue: '9' },
    { timevalue: '10' },
    { timevalue: '11' },
    { timevalue: '12' },
    { timevalue: '13' },
    { timevalue: '14' },
    { timevalue: '15' },
    { timevalue: '16' },
    { timevalue: '17' },
    { timevalue: '18' },
    { timevalue: '19' },
    { timevalue: '20' },
    { timevalue: '21' },
    { timevalue: '22' },
    { timevalue: '23' },
  ];
  minutes: Time[] = [];
  editTimeslotForm = new FormGroup({
    startHours: this.startHours,
    startMinutes: this.startMinutes,
    endHours: this.endHours,
    endMinutes: this.endMinutes,
  });

  constructor(public dialogRef: MatDialogRef<EditTimeslotsComponent>) {
    for (let min = 0; min < 60; min++) {
      let minuteString = '';
      if (min < 10) {
        minuteString = '0' + min.toString();
      } else {
        minuteString = min.toString();
      }
      this.minutes.push({ timevalue: minuteString });
    }
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

  closeDialog(event: Event) {
    event.preventDefault();
    this.dialogRef.close();
  }
}
