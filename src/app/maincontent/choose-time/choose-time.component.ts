import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { AppointmentInfoService } from '../../services/appointment-info.service';

@Component({
  selector: 'app-choose-time',
  standalone: true,
  imports: [MatRadioModule, FormsModule],
  templateUrl: './choose-time.component.html',
  styleUrl: './choose-time.component.scss',
})
export class ChooseTimeComponent {
  chosenTime: string = '';
  timeslots: string[] = ['15.00', '15.30', '16.00', '16.30'];

  scheduledMeeting = inject(AppointmentInfoService);

  @Output() timeChosen = new EventEmitter<string>();

  sendTime(value: string) {
    this.timeChosen.emit(value);
  }
}
