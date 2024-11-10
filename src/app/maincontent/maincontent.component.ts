import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChooseTimeComponent } from './choose-time/choose-time.component';
import { ChooseDateComponent } from './choose-date/choose-date.component';
import { AppointmentInfoService } from '../services/appointment-info.service';
import { DateFormatterService } from '../services/date-formatter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormstepperComponent } from './formstepper/formstepper.component';

@Component({
  selector: 'app-maincontent',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ChooseTimeComponent,
    ChooseDateComponent,
    FormstepperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './maincontent.component.html',
  styleUrl: './maincontent.component.scss',
})
export class MaincontentComponent {
  scheduledMeeting = inject(AppointmentInfoService);
  dateFormatter = inject(DateFormatterService);
  dateSelected?: boolean;
  localDate: string = '';

  private _formBuilder = inject(FormBuilder);

  firstFormGroup: FormGroup = this._formBuilder.group({ firstCtrl: [''] });

  constructor(private ref: ChangeDetectorRef) {}

  addTime(time: string) {
    this.scheduledMeeting.data.time = time;
    this.localDate = this.dateFormatter.getLocalDate(
      this.scheduledMeeting.data.date
    );
  }

  checkDateValidity(valid: boolean) {
    this.dateSelected = valid;
    this.ref.detectChanges();
  }

  getTimeslots(chosenDate: string) {
    this.dateSelected = true;
    this.scheduledMeeting.data.time = '';
  }
}
