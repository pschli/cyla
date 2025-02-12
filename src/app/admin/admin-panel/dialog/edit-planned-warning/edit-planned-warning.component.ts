import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-planned-warning',
  standalone: true,
  imports: [MatButton],
  templateUrl: './edit-planned-warning.component.html',
  styleUrl: './edit-planned-warning.component.scss',
})
export class EditPlannedWarningComponent {
  readonly dialogRef = inject(MatDialogRef<EditPlannedWarningComponent>);

  constructor(public dialog: MatDialog) {}

  closeDialog() {
    this.dialogRef.close();
  }
}
