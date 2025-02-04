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
import { LoginComponent } from '../dialog/login/login.component';
import { MatButtonModule } from '@angular/material/button';
import { LogoutService } from '../services/logout.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatDialogModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  authService = inject(AuthService);
  logoutService = inject(LogoutService);
  router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(private dialogRef: MatDialog, public dialog: MatDialog) {}

  async logout() {
    this.logoutService.requestUpdate();
    this.authService.logout();
    // this._snackBar.open('Erfolgreich ausgeloggt', 'OK', {
    //   horizontalPosition: 'center',
    //   verticalPosition: 'top',
    //   duration: 5000,
    // });
  }

  login() {
    this.dialogRef.closeAll();
    const dialogRef = this.dialog.open(LoginComponent);
  }
}
