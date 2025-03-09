import { Component, inject, signal } from '@angular/core';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { reauthenticateWithCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './delete-account.component.html',

  styleUrl: '../change-name/change-name.component.scss',
})
export class DeleteAccountComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteAccountComponent>);
  authService = inject(AuthService);
  fs = inject(FirestoreService);
  pending = false;
  formData = new FormGroup({
    password: new FormControl({ value: '', disabled: this.pending }, [
      Validators.required,
    ]),
  });

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  errorMessage = {
    email: '',
  };

  constructor(public dialog: MatDialog) {}

  async deleteAccount() {
    if (
      this.formData.valid &&
      this.authService.auth.currentUser &&
      this.authService.auth.currentUser.email &&
      this.formData.controls.password.value
    ) {
      this.pending = true;
      const credential = this.authService.getCredentials(
        this.authService.auth.currentUser.email,
        this.formData.controls.password.value
      );
      reauthenticateWithCredential(
        this.authService.auth.currentUser,
        credential
      )
        .then(() => {
          this.fs
            .deleteUserData()
            .then(() => {
              this.authService
                .requestDeleteUser()
                .then(() => {
                  this.authService.logout('account-deleted');
                  this.dialogRef.close();
                })
                .catch((err) => {
                  console.error('Error deleting account:', err);
                });
            })
            .catch((error) => {
              console.error('Error deleting user data:', error);
            });
        })
        .catch((error) => {
          console.error('Error reauthenticating:', error);
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
