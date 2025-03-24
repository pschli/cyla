import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { LoginContainerComponent } from '../../dialog/login-container/login-container.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ready-to-start',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './ready-to-start.component.html',
  styleUrl: './ready-to-start.component.scss',
})
export class ReadyToStartComponent {
  constructor(public dialog: MatDialog) {}

  openSignup() {
    const dialogRef = this.dialog.open(LoginContainerComponent, {
      data: { state: 'sign-up' },
      autoFocus: false,
    });
  }
}
