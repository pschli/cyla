import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
  scheduledMeeting = inject(AppointmentInfoService);

  @Input() availableTimes: string[] = [];

  chosenTime: string = '';

  @Output() timeChosen = new EventEmitter<string>();

  constructor() {}

  sendTime(value: string) {
    this.timeChosen.emit(value);
  }
}
