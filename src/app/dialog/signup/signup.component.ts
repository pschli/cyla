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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LandingComponent } from '../../landing/landing.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from '../login/login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  readonly dialogRef = inject(MatDialogRef<LandingComponent>);
  router = inject(Router);
  authService = inject(AuthService);
  loading: boolean = false;

  formData = new FormGroup({
    email: new FormControl({ value: '', disabled: this.loading }, [
      Validators.required,
      Validators.email,
    ]),
    firstname: new FormControl({ value: '', disabled: this.loading }, [
      Validators.required,
    ]),
    lastname: new FormControl({ value: '', disabled: this.loading }, [
      Validators.required,
    ]),
    password: new FormControl({ value: '', disabled: this.loading }, [
      Validators.required,
    ]),
    repeatpw: new FormControl({ value: '', disabled: this.loading }, [
      Validators.required,
    ]),
  });

  firebaseErrorMessage: string | null = null;

  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  errorMessage = {
    email: '',
    firstname: '',
    lastname: '',
    repeatpw: '',
  };

  constructor(public dialog: MatDialog) {
    merge(
      this.formData.controls.email.statusChanges,
      this.formData.controls.email.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('email'));
    merge(
      this.formData.controls.firstname.statusChanges,
      this.formData.controls.firstname.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('firstname'));
    merge(
      this.formData.controls.lastname.statusChanges,
      this.formData.controls.lastname.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('lastname'));
    merge(
      this.formData.controls.repeatpw.statusChanges,
      this.formData.controls.repeatpw.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('repeatpw'));
  }

  updateErrorMessage(field: string) {
    if (field === 'email') {
      if (this.formData.controls.email.hasError('required')) {
        this.errorMessage.email = 'You must enter a value';
      } else if (this.formData.controls.email.hasError('email')) {
        this.errorMessage.email = 'Not a valid email';
      } else {
        this.errorMessage.email = '';
      }
    } else if (field === 'firstname') {
      if (this.formData.controls.firstname.hasError('required')) {
        this.errorMessage.firstname = 'You must enter a name';
      } else {
        this.errorMessage.firstname = '';
      }
    } else if (field === 'lastname') {
      if (this.formData.controls.lastname.hasError('required')) {
        this.errorMessage.lastname = 'You must enter a name';
      } else {
        this.errorMessage.lastname = '';
      }
    } else if (field === 'repeatpw') {
      if (this.formData.controls.repeatpw.hasError('notEqual')) {
        this.errorMessage.repeatpw = "Passwort doesn't match";
      } else {
        this.errorMessage.lastname = '';
      }
    }
  }

  checkEqual() {
    if (
      this.formData.controls.repeatpw.value ===
      this.formData.controls.password.value
    ) {
      this.formData.controls.repeatpw.setErrors(null);
    } else {
      this.formData.controls.repeatpw.setErrors({ notEqual: true });
    }
  }

  openLogin() {
    this.closeDialog();
    const dialogRef = this.dialog.open(LoginComponent);
  }

  closeDialog($event?: Event) {
    $event?.preventDefault();
    this.formData.reset();
    this.loading = false;
    this.dialogRef.close();
  }

  registerUser() {
    let rawData = this.formData.getRawValue();
    if (
      rawData.email &&
      rawData.password &&
      rawData.firstname &&
      rawData.lastname
    ) {
      this.formData.reset();
      this.loading = true;
      this.dialogRef.close();
      this.authService
        .register(
          rawData.email,
          rawData.password,
          rawData.firstname,
          rawData.lastname
        )
        .subscribe({
          next: () => {
            this.router.navigateByUrl('admin');
          },
          error: (err) => {
            this.firebaseErrorMessage = err.code;
          },
        });
    }
  }
}
