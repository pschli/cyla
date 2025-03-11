import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LoginContainerComponent } from '../dialog/login-container/login-container.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);

  router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private dialogRef: MatDialog, public dialog: MatDialog) {}

  async logout() {
    this.authService.logout();
    this._snackBar.open('Erfolgreich ausgeloggt', 'OK', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000,
    });
  }

  login() {
    this.dialogRef.closeAll();
    const dialogRef = this.dialog.open(LoginContainerComponent, {
      data: { state: 'login' },
      autoFocus: false,
    });
  }

  openAccountSettings() {
    this.router.navigateByUrl('admin/account');
  }
}
