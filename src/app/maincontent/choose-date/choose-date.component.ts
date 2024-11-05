import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import {
  FormControl,
  FormGroup,
  NgModel,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-choose-date',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './choose-date.component.html',
  styleUrl: './choose-date.component.scss',
})
export class ChooseDateComponent {
  date = new FormGroup({
    dateSelected: new FormControl<Date | null>(null),
  });

  scheduledMeeting = {
    date: '',
    time: '',
    name: '',
    email: '',
  };

  selectableDates: Date[] = [
    new Date(2024, 10, 3), // 3. Oktober 2024
    new Date(2024, 10, 5), // 5. Oktober 2024
    new Date(2024, 10, 10), // 10. Oktober 2024
    new Date(2024, 10, 15), // 15. Oktober 2024
  ];

  myFilter = (d: Date | null): boolean => {
    if (!d) {
      return false;
    }
    const dateStr = d.toDateString();
    return this.selectableDates.some((date) => date.toDateString() === dateStr);
  };

  constructor(private dateAdapter: DateAdapter<Date>) {}

  ngOnInit(): void {
    //  this.dateAdapter.setLocale('de-DE');
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
  }

  showDate() {
    console.log(this.date.controls.dateSelected.value);
  }
}
