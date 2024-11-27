import { Component } from '@angular/core';
import { MatCalendar, MatDatepickerModule } from '@angular/material/datepicker';
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
}
