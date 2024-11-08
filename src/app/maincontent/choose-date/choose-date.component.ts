import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Output,
} from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppointmentInfoService } from '../../services/appointment-info.service';
import { DateFormatterService } from '../../services/date-formatter.service';

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
  dateFormatter = inject(DateFormatterService);

  selectableDates: Date[] = [
    new Date(2024, 10, 3), // 3. November 2024
    new Date(2024, 10, 5), // 5. November 2024
    new Date(2024, 10, 10), // 10. November 2024
    new Date(2024, 10, 15), // 15. November 2024
  ];

  myFilter = (d: Date | null): boolean => {
    if (!d) {
      return false;
    }
    const dateStr = d.toDateString();
    return this.selectableDates.some((date) => date.toDateString() === dateStr);
  };

  @Output() newDatepickerEvent = new EventEmitter<string>();
  @Output() newDateValidatorEvent = new EventEmitter<boolean>();

  constructor(private dateAdapter: DateAdapter<Date>) {}

  ngOnInit(): void {
    this.dateAdapter.setLocale('de');
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
  }

  sendDate(dateString: string) {
    if (!this.date.controls.dateSelected.invalid) {
      this.scheduledMeeting.data.date = dateString;
      this.newDateValidatorEvent.emit(true);
      this.newDatepickerEvent.emit(dateString);
    } else this.handleInvalid();
  }

  handleInput(inputValue: string) {
    let transformedValue: string = this.dateFormatter.fixInput(inputValue);
    this.date.controls.dateSelected.setValue(new Date(transformedValue));
    this.handlePick();
  }

  emptyField() {
    this.date.controls.dateSelected.setValue(null);
    this.scheduledMeeting.data.date = '';
    this.handleInvalid();
  }

  handlePick() {
    this.handleInvalid();
    if (!this.date.controls.dateSelected.invalid) {
      let date = this.date.controls.dateSelected.value;
      if (date) {
        let dateString: string = this.dateFormatter.getStringFromDate(date);
        this.sendDate(dateString);
      }
    }
  }

  handleInvalid() {
    this.newDateValidatorEvent.emit(false);
  }
}
