import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
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
import { AddContactDataComponent } from '../add-contact-data/add-contact-data.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

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
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    ChooseTimeComponent,
    ChooseDateComponent,
    AddContactDataComponent,
  ],
  templateUrl: './formstepper.component.html',
  styleUrl: './formstepper.component.scss',
})
export class FormstepperComponent {
  scheduledMeeting = inject(AppointmentInfoService);
  dateFormatter = inject(DateFormatterService);
  dateSelected?: boolean;
  localDate: string = '';
  contactFormCompleted = false;
  dateFormCompleted = false;

  legalCheck = new FormGroup({
    checked: new FormControl(false, [Validators.required]),
  });

  constructor(private ref: ChangeDetectorRef) {}

  setContactStepValidity(event: boolean) {
    this.contactFormCompleted = event;
  }

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

  submitData() {
    console.log(this.scheduledMeeting.data);
  }
}
