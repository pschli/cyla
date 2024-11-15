import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../dialog/signup/signup.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  constructor(public dialog: MatDialog) {}
  openSignup() {
    const dialogRef = this.dialog.open(SignupComponent);
  }
}
