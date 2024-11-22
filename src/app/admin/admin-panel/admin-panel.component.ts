import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [AsyncPipe, NgIf],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements AfterViewInit {
  authService = inject(AuthService);
  router = inject(Router);
  loading: boolean = true;

  ngAfterViewInit(): void {
    this.loading = true;
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
      } else {
        this.authService.currentUserSig.set(null);
        this.router.navigateByUrl('');
      }
    });
  }
}
