import { Component, inject, Input } from '@angular/core';
import { UserDates } from '../../../interfaces/user-dates';
import { DateFormatterService } from '../../../services/date-formatter.service';
import { TimeslotDetailsComponent } from './timeslot-details/timeslot-details.component';

@Component({
  selector: 'app-upcoming-list-element',
  standalone: true,
  imports: [TimeslotDetailsComponent],
  templateUrl: './upcoming-list-element.component.html',
  styleUrl: './upcoming-list-element.component.scss',
})
export class UpcomingListElementComponent {
  @Input() item!: UserDates;

  dateFormatter = inject(DateFormatterService);

  formatDate(day: string): string {
    return this.dateFormatter.getShortDate(day);
  }
}
