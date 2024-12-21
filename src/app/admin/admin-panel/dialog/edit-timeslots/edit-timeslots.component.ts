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
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
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
    MatDivider,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './edit-timeslots.component.html',
  styleUrl: './edit-timeslots.component.scss',
})
export class EditTimeslotsComponent {
  startControl = new FormControl<Time | null>(null, Validators.required);
  endControl = new FormControl<Time | null>(null, Validators.required);
  intervalFormControl = new FormControl<Time | null>(null, Validators.required);
  times: Time[] = [
    { timevalue: '0:00 Uhr' },
    { timevalue: '1:00 Uhr' },
    { timevalue: '2:00 Uhr' },
    { timevalue: '3:00 Uhr' },
    { timevalue: '4:00 Uhr' },
    { timevalue: '5:00 Uhr' },
    { timevalue: '6:00 Uhr' },
    { timevalue: '7:00 Uhr' },
    { timevalue: '8:00 Uhr' },
    { timevalue: '9:00 Uhr' },
    { timevalue: '10:00 Uhr' },
    { timevalue: '11:00 Uhr' },
    { timevalue: '12:00 Uhr' },
    { timevalue: '13:00 Uhr' },
    { timevalue: '14:00 Uhr' },
    { timevalue: '15:00 Uhr' },
    { timevalue: '16:00 Uhr' },
    { timevalue: '17:00 Uhr' },
    { timevalue: '18:00 Uhr' },
    { timevalue: '19:00 Uhr' },
    { timevalue: '20:00 Uhr' },
    { timevalue: '21:00 Uhr' },
    { timevalue: '22:00 Uhr' },
    { timevalue: '23:00 Uhr' },
  ];
  intervals: Time[] = [
    { timevalue: '10 Minuten' },
    { timevalue: '15 Minuten' },
    { timevalue: '20 Minuten' },
    { timevalue: '30 Minuten' },
    { timevalue: '45 Minuten' },
    { timevalue: '1 Stunde' },
    { timevalue: '1,5 Stunden' },
    { timevalue: '2 Stunden' },
    { timevalue: '4 Stunden' },
    { timevalue: '8 Stunden' },
  ];
  editTimeslotForm = new FormGroup({
    start: this.startControl,
    end: this.endControl,
    interval: this.intervalFormControl,
  });

  constructor(public dialog: MatDialog) {
    merge(
      this.editTimeslotForm.controls.end.valueChanges,
      this.editTimeslotForm.controls.start.valueChanges,
      this.editTimeslotForm.controls.interval.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateTimeslots());
  }

  updateTimeslots() {
    if (
      this.startControl.valid &&
      this.endControl.valid &&
      this.intervalFormControl.valid
    ) {
      console.log(
        'updating',
        this.editTimeslotForm.controls.start.value?.timevalue,
        this.editTimeslotForm.controls.end.value?.timevalue,
        this.editTimeslotForm.controls.interval.value?.timevalue
      );
    }
  }
}
