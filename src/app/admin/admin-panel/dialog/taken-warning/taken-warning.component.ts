import { AsyncPipe } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateDataService } from '../../../../services/date-data.service';
import { UpcomingListElementComponent } from '../../../user-panel/upcoming-list-element/upcoming-list-element.component';
import { DateFormatterService } from '../../../../services/date-formatter.service';
import { MatButton } from '@angular/material/button';
import { UserDates } from '../../../../interfaces/user-dates';

@Component({
  selector: 'app-taken-warning',
  standalone: true,
  imports: [AsyncPipe, UpcomingListElementComponent, MatButton],
  templateUrl: './taken-warning.component.html',
  styleUrl: './taken-warning.component.scss',
})
export class TakenWarningComponent {
  dateFormatter = inject(DateFormatterService);
  userDates: DateDataService;
  dateTaken: Date;
  dateTakenString: string;

  constructor(
    public dialogRef: MatDialogRef<TakenWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.userDates = data.userDates;
    this.dateTaken = data.date;
    this.dateTakenString = this.dateFormatter.getStringFromDate(this.dateTaken);
  }

  continuePlanning() {
    // get Data
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
