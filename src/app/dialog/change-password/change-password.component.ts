import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { merge } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { reauthenticateWithCredential } from '@angular/fire/auth';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-change-password',
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
    NgClass,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: '../change-name/change-name.component.scss',
})
export class ChangePasswordComponent {
  readonly dialogRef = inject(MatDialogRef<ChangePasswordComponent>);
  authService = inject(AuthService);
  fs = inject(FirestoreService);
  pending = false;

  strongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

  formData = new FormGroup({
    password: new FormControl({ value: '', disabled: this.pending }, [
      Validators.required,
    ]),
    newPassword: new FormControl({ value: '', disabled: this.pending }, [
      Validators.required,
      Validators.pattern(this.strongPasswordRegx),
    ]),
    repeatpw: new FormControl({ value: '', disabled: this.pending }, [
      Validators.required,
    ]),
  });

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  errorMessage = {
    password: '',
    newpassword: '',
    repeatpw: '',
  };

  constructor(public dialog: MatDialog) {
    merge(
      this.formData.controls.password.statusChanges,
      this.formData.controls.password.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('password'));
    merge(
      this.formData.controls.repeatpw.statusChanges,
      this.formData.controls.repeatpw.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('repeatpw'));
  }

  async changePassword() {
    if (
      this.formData.valid &&
      this.authService.auth.currentUser &&
      this.authService.auth.currentUser.email &&
      this.formData.controls.password.value &&
      this.formData.controls.newPassword.value
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
          this.authService
            .updateUserPassword(this.formData.controls.newPassword.value!)
            .then(() => {
              this.dialogRef.close();
            })
            .catch((err) => {
              console.error('Error updating password:', err);
            });
        })
        .catch((error) => {
          console.error('Error reauthenticating:', error);
        });
    }
  }

  updateErrorMessage(field: string) {
    if (field === 'newpassword') {
      if (this.formData.controls.password.hasError('required')) {
        this.errorMessage.password = 'Bitte Passwort eingeben';
      } else if (this.formData.controls.password.hasError('pattern')) {
        this.errorMessage.password = 'Passwort zu schwach.';
      } else {
        this.errorMessage.password = '';
      }
    } else if (field === 'repeatpw') {
      if (this.formData.controls.repeatpw.hasError('notEqual')) {
        this.errorMessage.repeatpw = 'Passwort stimmt nicht überein';
      }
    }
  }

  checkEqual() {
    if (
      this.formData.controls.repeatpw.value ===
      this.formData.controls.newPassword.value
    ) {
      this.formData.controls.repeatpw.setErrors(null);
    } else {
      this.formData.controls.repeatpw.setErrors({ notEqual: true });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
