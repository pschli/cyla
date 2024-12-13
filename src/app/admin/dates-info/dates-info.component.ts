import { Component, inject, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { DateFormatterService } from '../../services/date-formatter.service';
import { DateDataService } from '../../services/date-data.service';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-dates-info',
  standalone: true,
  imports: [MatExpansionModule, MatButtonModule, NgClass, NgFor, AsyncPipe],
  templateUrl: './dates-info.component.html',
  styleUrl: './dates-info.component.scss',
})
export class DatesInfoComponent {
  readonly panelOpenState = signal(false);
  dateFormatter = inject(DateFormatterService);
  userDates = inject(DateDataService);

  formatDate(day: string): string {
    return this.dateFormatter.getLocalDate(day);
  }

  editTimeslot(date: string, time: {}) {
    console.log(date, time);
  }
}
