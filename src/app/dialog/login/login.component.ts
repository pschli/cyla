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
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  readonly dialogRef = inject(MatDialogRef<SignupComponent>);
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
    }
  }

  passwordHelp() {
    console.log('Hier werden Sie geholfen.');
  }

  closeDialog($event?: Event) {
    $event?.preventDefault();
    this.formData.reset();
    this.loading = false;
    this.dialogRef.close();
  }
}
