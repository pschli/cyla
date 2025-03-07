import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
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
  templateUrl: './change-name.component.html',
  styleUrl: './change-name.component.scss',
})
export class ChangeNameComponent {
  readonly dialogRef = inject(MatDialogRef<ChangeNameComponent>);
  authService = inject(AuthService);
  fs = inject(FirestoreService);
  formData = new FormGroup({
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
  });

  pending = false;

  errorMessage = {
    email: '',
    firstname: '',
    lastname: '',
    password: '',
    repeatpw: '',
  };

  constructor(public dialog: MatDialog) {
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
  }

  updateErrorMessage(field: string) {
    if (field === 'firstname') {
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
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async changeName() {
    if (
      this.formData.valid &&
      this.formData.controls.firstname.value &&
      this.formData.controls.lastname.value
    ) {
      this.pending = true;
      this.formData.disable();
      let result = await this.authService.updateDisplayName(
        this.formData.controls.firstname.value
      );
      if (result === 'success') {
        result = await this.fs.updateUserName(
          this.formData.controls.firstname.value,
          this.formData.controls.lastname.value
        );
        if (result === 'success') {
          this.closeDialog();
        }
      }
    }
  }
}
