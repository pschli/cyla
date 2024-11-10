import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChooseTimeComponent } from '../choose-time/choose-time.component';
import { ChooseDateComponent } from '../choose-date/choose-date.component';
import { AppointmentInfoService } from '../../services/appointment-info.service';
import { DateFormatterService } from '../../services/date-formatter.service';

@Component({
  selector: 'app-formstepper',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ChooseTimeComponent,
    ChooseDateComponent,
  ],
  templateUrl: './formstepper.component.html',
  styleUrl: './formstepper.component.scss',
})
export class FormstepperComponent {
  scheduledMeeting = inject(AppointmentInfoService);
  dateFormatter = inject(DateFormatterService);
  dateSelected?: boolean;
  localDate: string = '';
  dateFormCompleted = false;

  constructor(private ref: ChangeDetectorRef) {}

  addTime(time: string) {
    this.scheduledMeeting.data.time = time;
    this.localDate = this.dateFormatter.getLocalDate(
      this.scheduledMeeting.data.date
    );
    this.dateFormCompleted = true;
  }

  checkDateValidity(valid: boolean) {
    this.dateSelected = valid;
    this.dateFormCompleted = false;
    this.ref.detectChanges();
  }

  getTimeslots(chosenDate: string) {
    this.dateSelected = true;
    this.scheduledMeeting.data.time = '';
  }
}
