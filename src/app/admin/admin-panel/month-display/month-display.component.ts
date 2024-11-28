import { Component } from '@angular/core';
import {
  MatCalendar,
  MatDatepickerInputEvent,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CalendarCustomHeader } from '../calendar-custom-header/calendar-custom-header.component';

@Component({
  selector: 'app-month-display',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDatepickerModule],
  templateUrl: './month-display.component.html',
  styleUrl: './month-display.component.scss',
})
export class MonthDisplayComponent {
  readonly customHeader = CalendarCustomHeader;
  selectedDate = new Date('11/30/2024');
  selectedDates = [new Date('11/30/2024'), new Date('11/29/2024')];

  public selectedChange(event: MatDatepickerInputEvent<Date>): void {
    console.log('Teste', event);
  }
}
