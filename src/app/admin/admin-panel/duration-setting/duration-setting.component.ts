import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { merge } from 'rxjs';
import { DurationsService } from '../../../services/durations.service';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { DurationPipe } from '../../../pipes/duration.pipe';

interface Time {
  timevalue: string;
}

@Component({
  selector: 'app-duration-setting',
  standalone: true,
  imports: [
    DurationPipe,
    NgIf,
    AsyncPipe,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormField,
    MatInputModule,
    MatLabel,
    MatOption,
    MatError,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './duration-setting.component.html',
  styleUrl: './duration-setting.component.scss',
})
export class DurationSettingComponent {
  durationsService = inject(DurationsService);
  intervalHours = new FormControl<Time | null>(null, Validators.required);
  intervalMinutes = new FormControl<Time | null>(null, Validators.required);
  intervalName = new FormControl<string | null>(null);
  selectDuration = new FormGroup({
    intervalHours: this.intervalHours,
    intervalMinutes: this.intervalMinutes,
    intervalName: this.intervalName,
  });
  hours: Time[] = [];
  minutes: Time[] = [];
  durations$ = this.durationsService.getValues();

  constructor() {
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
    merge(this.selectDuration.controls.intervalHours.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.checkDuration();
      });
    merge(this.selectDuration.controls.intervalMinutes.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.checkDuration();
      });
  }

  addDuration() {
    const duration = this.getDurationString();
    const durationName = this.getDurationName();
    const durationPayload = {
      duration: duration,
      name: durationName,
    };
    if (duration) {
      this.durationsService.addValue(duration, durationPayload);
      this.selectDuration.reset();
    }
  }

  deleteEntry(entry: string) {
    this.durationsService.removeValue(entry);
  }

  getDurationString() {
    let hour: string;
    let minutes: string;
    if (
      this.selectDuration.controls.intervalHours.value !== null &&
      this.selectDuration.controls.intervalMinutes.value !== null
    ) {
      hour = this.selectDuration.controls.intervalHours.value.timevalue;
      minutes = this.selectDuration.controls.intervalMinutes.value.timevalue;
      return hour + ':' + minutes;
    }
    return '';
  }

  getDurationName() {
    if (this.selectDuration.controls.intervalName.value !== null) {
      return this.selectDuration.controls.intervalName.value;
    } else return '';
  }

  checkDuration() {
    let hourValue = this.getNumberValue(
      this.selectDuration.controls.intervalHours.value?.timevalue
    );
    let minuteValue = this.getNumberValue(
      this.selectDuration.controls.intervalMinutes.value?.timevalue
    );
    if (hourValue === null || minuteValue === null) return;
    if (hourValue + minuteValue === 0) {
      this.selectDuration.controls.intervalMinutes.setErrors({
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
}
