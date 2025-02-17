import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-timeslot-details',
  standalone: true,
  imports: [],
  templateUrl: './timeslot-details.component.html',
  styleUrl: './timeslot-details.component.scss',
})
export class TimeslotDetailsComponent {
  @Input() appointment!: {
    token: string | null;
    name?: string;
    email?: string;
  };
}
