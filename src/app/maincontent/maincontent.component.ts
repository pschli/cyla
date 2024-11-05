import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { ChooseTimeComponent } from './choose-time/choose-time.component';
import { ChooseDateComponent } from './choose-date/choose-date.component';

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
  scheduledMeeting = {
    date: '',
    time: '',
    name: '',
    email: '',
  };

  addTime(time: string) {
    this.scheduledMeeting.time = time;
    console.log(time);
  }
}
