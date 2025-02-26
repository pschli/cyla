import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from '../dialog/signup/signup.component';
import { AuthService } from '../services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [],
})
export class LandingComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  constructor(public dialog: MatDialog) {}
  openSignup() {
    const dialogRef = this.dialog.open(SignupComponent);
  }
  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
        this.router.navigateByUrl('admin/overview');
      } else {
        this.authService.currentUserSig.set(null);
      }
    });
  }
}
