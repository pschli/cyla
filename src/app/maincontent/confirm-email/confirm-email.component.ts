import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.scss',
})
export class ConfirmEmailComponent {}
