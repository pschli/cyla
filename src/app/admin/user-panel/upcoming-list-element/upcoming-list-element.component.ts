import { Component, inject, Input } from '@angular/core';
import { UserDates } from '../../../interfaces/user-dates';
import { DateFormatterService } from '../../../services/date-formatter.service';
import { TimeslotDetailsComponent } from './timeslot-details/timeslot-details.component';
import { DateDataService } from '../../../services/date-data.service';
import { MatDialog } from '@angular/material/dialog';
import { AppointmentDetailDialogComponent } from '../../admin-panel/dialog/appointment-detail-dialog/appointment-detail-dialog.component';
import { Timeslot } from '../../../interfaces/timeslot';

@Component({
  selector: 'app-upcoming-list-element',
  standalone: true,
  imports: [TimeslotDetailsComponent],
  templateUrl: './upcoming-list-element.component.html',
  styleUrl: './upcoming-list-element.component.scss',
})
export class UpcomingListElementComponent {
  @Input() item!: UserDates;
  @Input() userDates!: DateDataService;
  dateFormatter = inject(DateFormatterService);

  constructor(public dialog: MatDialog) {}

  formatDate(day: string): string {
    return this.dateFormatter.getShortDate(day);
  }

  openAppointmentDetails(date: string, time: Timeslot) {
    const dialogRef = this.dialog.open(AppointmentDetailDialogComponent, {
      panelClass: 'custom-dialog-panel',
      data: { userDates: this.userDates, date: date, time: time },
    });
  }
}
