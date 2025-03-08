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

@Component({
  selector: 'app-change-name',
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
  templateUrl: './change-email.component.html',
  styleUrl: '../change-name/change-name.component.scss',
})
export class ChangeEmailComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeEmailComponent>);
  authService = inject(AuthService);
  fs = inject(FirestoreService);
  pending = false;
  formData = new FormGroup({
    newemail: new FormControl({ value: '', disabled: this.pending }, [
      Validators.required,
      Validators.email,
    ]),
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

  constructor(public dialog: MatDialog) {
    merge(
      this.formData.controls.newemail.statusChanges,
      this.formData.controls.newemail.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('email'));
  }

  updateErrorMessage(field: string) {
    if (this.formData.controls.newemail.hasError('required')) {
      this.errorMessage.email = 'Bitte E-Mail eingeben';
    } else if (this.formData.controls.newemail.hasError('email')) {
      this.errorMessage.email = 'Keine gültige E-Mail';
    } else if (this.formData.controls.newemail.hasError('emailAlreadyInUse')) {
      this.errorMessage.email = 'E-Mail existiert bereits';
    } else {
      this.errorMessage.email = '';
    }
  }

  async changeEmail() {
    if (
      this.formData.valid &&
      this.authService.auth.currentUser &&
      this.authService.auth.currentUser.email &&
      this.formData.controls.password.value &&
      this.formData.controls.newemail.value
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
            .updateEmail(this.formData.controls.newemail.value!)
            .then(() => {
              this.authService.logout('confirm-email');
              this.dialogRef.close();
            })
            .catch((err) => {
              console.error('Error updating email:', err);
            });
        })
        .catch((error) => {
          console.error('Error reauthenticating:', error);
        });
    }
  }

  changeMailDataIsValid() {
    return (
      this.formData.valid &&
      this.authService.auth.currentUser &&
      this.authService.auth.currentUser.email &&
      this.formData.controls.password.value &&
      this.formData.controls.newemail.value
    );
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
