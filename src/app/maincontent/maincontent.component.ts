import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DATE_LOCALE,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { ChooseTimeComponent } from './choose-time/choose-time.component';
import { ChooseDateComponent } from './choose-date/choose-date.component';
import { AppointmentInfoService } from '../services/appointment-info.service';

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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './maincontent.component.html',
  styleUrl: './maincontent.component.scss',
})
export class MaincontentComponent {
  scheduledMeeting = inject(AppointmentInfoService);

  addTime(time: string) {
    this.scheduledMeeting.scheduledMeeting.time = time;
  }
}
