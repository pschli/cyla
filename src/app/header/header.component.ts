import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../dialog/login/login.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatDialogModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor(private dialogRef: MatDialog, public dialog: MatDialog) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }

  login() {
    this.dialogRef.closeAll();
    const dialogRef = this.dialog.open(LoginComponent);
  }
}
