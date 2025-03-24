import { Component, HostListener, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../services/auth.service';
import { LearnmoreComponent } from '../learnmore/learnmore.component';
import { animate, style, transition, trigger } from '@angular/animations';
import { LoginContainerComponent } from '../dialog/login-container/login-container.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [MatButtonModule, LearnmoreComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
  animations: [
    trigger('banner', [
      transition(':leave', [
        style({ top: 0 }),
        animate('200ms ease-in', style({ top: '-72px' })),
      ]),
    ]),
  ],
})
export class LandingComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  learnmoreClicked = false;
  showBanner = false;

  constructor(public dialog: MatDialog) {}

  @HostListener('window:scroll', ['$event']) onScrollEvent() {
    this.showBanner = window.scrollY > 100 ? true : false;
  }
  openSignup() {
    const dialogRef = this.dialog.open(LoginContainerComponent, {
      data: { state: 'sign-up' },
      autoFocus: false,
    });
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

  openLearnMore(element: HTMLElement) {
    this.learnmoreClicked = true;
    setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth' });
    }, 60);
  }
}
