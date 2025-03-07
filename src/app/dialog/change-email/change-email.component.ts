import { Component, inject } from '@angular/core';
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
  ],
  templateUrl: './change-email.component.html',
  styleUrl: '../change-name/change-name.component.scss',
})
export class ChangeEmailComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeEmailComponent>);
  formData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

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
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
