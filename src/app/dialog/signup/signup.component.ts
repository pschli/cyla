import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
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
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { LoginContainerComponent } from '../login-container/login-container.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CookiesService } from '../../legal/cookies.service';

type NonNullData = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    NgClass,
    MatDialogModule,
    MatButton,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  readonly dialogRef = inject(MatDialogRef<LoginContainerComponent>);
  @Output() changeDialog = new EventEmitter<string>();
  router = inject(Router);
  cookieService = inject(CookiesService);
  authService = inject(AuthService);
  loading: boolean = false;
  ppChecked = false;

  strongPasswordRegx: RegExp =
    /^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d).{8,}$/;

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
      Validators.pattern(this.strongPasswordRegx),
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
    password: '',
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

  updateErrorMessage(field: string) {
    if (field === 'email') {
      if (this.formData.controls.email.hasError('required')) {
        this.errorMessage.email = 'Bitte E-Mail eingeben';
      } else if (this.formData.controls.email.hasError('email')) {
        this.errorMessage.email = 'Keine gültige E-Mail';
      } else if (this.formData.controls.email.hasError('emailAlreadyInUse')) {
        this.errorMessage.email = 'E-Mail existiert bereits';
      } else {
        this.errorMessage.email = '';
      }
    } else if (field === 'firstname') {
      if (this.formData.controls.firstname.hasError('required')) {
        this.errorMessage.firstname = 'Bitte Namen eingeben';
      } else {
        this.errorMessage.firstname = '';
      }
    } else if (field === 'lastname') {
      if (this.formData.controls.lastname.hasError('required')) {
        this.errorMessage.lastname = 'Bitte Namen eingeben';
      } else {
        this.errorMessage.lastname = '';
      }
    } else if (field === 'password') {
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
    this.changeDialog.emit('login');
  }

  closeDialog($event?: Event) {
    $event?.preventDefault();
    this.formData.reset();
    this.loading = false;
    this.dialogRef.close();
  }

  registerUser() {
    let validData: NonNullData = this.processRawData();
    this.loading = true;
    this.authService
      .register(
        validData.email,
        validData.password,
        validData.firstname,
        validData.lastname
      )
      .subscribe({
        next: () => {
          this.cookieService.setCookieConsent();
          this.router.navigateByUrl('admin/overview');
          this.formData.reset();
          this.dialogRef.close();
          this.loading = false;
        },
        error: (err) => {
          this.handleSigninError(err.code);
        },
      });
  }

  processRawData(): NonNullData {
    let validData!: NonNullData;
    let rawData = this.formData.getRawValue();
    if (
      rawData.email &&
      rawData.password &&
      rawData.firstname &&
      rawData.lastname
    ) {
      validData = {
        email: rawData.email,
        password: rawData.password,
        firstname: rawData.firstname,
        lastname: rawData.lastname,
      };
    }
    return validData;
  }

  getCheckState(checked: boolean) {
    this.ppChecked = checked;
  }

  handleSigninError(error: string) {
    switch (error) {
      case 'auth/email-already-in-use':
        this.emailAlreadyInUse();
        break;
      default:
        //  console.error(error);
        break;
    }
    this.loading = false;
  }

  emailAlreadyInUse() {
    this.formData.controls.email.setErrors({ emailAlreadyInUse: true });
    this.updateErrorMessage('email');
  }
}
