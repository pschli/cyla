import { Component, Inject, Input } from '@angular/core';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MatDateFormats,
} from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'calendar-custom-header',
  standalone: true,
  imports: [],
  templateUrl: './calendar-custom-header.component.html',
  styleUrl: './calendar-custom-header.component.scss',
})
export class CalendarCustomHeader<D> {
  monthHeadline: string = '';

  constructor(
    private _calendar: MatCalendar<D>,
    private _dateAdapter: DateAdapter<D>,
    @Inject(MAT_DATE_FORMATS) private _dateFormats: MatDateFormats
  ) {
    this.monthHeadline = this._dateAdapter.format(
      this._calendar.activeDate,
      this._dateFormats.display.monthYearA11yLabel
    );
    console.log(this.monthHeadline);
  }
}
