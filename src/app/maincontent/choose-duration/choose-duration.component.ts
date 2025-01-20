import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-choose-duration',
  standalone: true,
  imports: [],
  templateUrl: './choose-duration.component.html',
  styleUrl: './choose-duration.component.scss',
})
export class ChooseDurationComponent {
  @Output() durationDataValid = new EventEmitter<boolean>();
}
