import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppointmentInfoService } from '../../services/appointment-info.service';

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

  scheduledMeeting = inject(AppointmentInfoService);

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
    this.dateAdapter.setLocale('de-DE');
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
  }

  showDate() {
    if (!this.date.controls.dateSelected.invalid) {
      console.log(this.date.controls.dateSelected.value);
    }
  }

  handleInput(inputValue: string) {
    console.log(inputValue);
    let transformedValue: string = '';
    let separators: number[] | null = this.findSeparators(inputValue);
    if (separators) {
      transformedValue = this.transformInput(inputValue, separators);
    }
    console.log(transformedValue);
    this.date.controls.dateSelected.setValue(new Date(transformedValue));
    this.showDate();
  }

  transformInput(inputValue: string, separators: number[]) {
    let day = inputValue.substring(0, separators[0]);
    let month = inputValue.substring(separators[0] + 1, separators[1]);
    let year = inputValue.substring(separators[1] + 1);
    if (this.formatIsIncorrect(day, month, year)) {
      return '';
    } else {
      return month + '/' + day + '/' + year;
    }
  }

  formatIsIncorrect(day: string, month: string, year: string) {
    return (
      day.length < 1 ||
      day.length > 2 ||
      month.length < 1 ||
      month.length > 2 ||
      year.length < 2 ||
      year.length > 4
    );
  }

  findSeparators(inputValue: string) {
    let separators = inputValue.match(/[^0-9]/g);
    console.log(separators);
    if (separators && separators.length === 2) {
      let first = inputValue.indexOf(separators[0]);
      let second = inputValue.indexOf(separators[1], first + 1);
      if (first !== -1 && second !== -1) {
        console.log(first, second);
        return [first, second];
      }
    }
    return null;
  }
}
