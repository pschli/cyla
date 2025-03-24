import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pw-send',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './pw-send.component.html',
  styleUrl: './pw-send.component.scss',
})
export class PwSendComponent {}
