import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';

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

  @Output() timeChosen = new EventEmitter<string>();

  sendTime(value: string) {
    this.timeChosen.emit(value);
  }
}
