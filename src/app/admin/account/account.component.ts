import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { ChangeNameComponent } from '../../dialog/change-name/change-name.component';
import { ChangeEmailComponent } from '../../dialog/change-email/change-email.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    MatIconModule,
    RouterLink,
    MatButtonModule,
    AsyncPipe,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.scss',
})
export class AccountComponent {
  auth = inject(AuthService);
  fs = inject(FirestoreService);

  animationState = { name: 'pending', email: 'pending' };

  editSelection = { name: false, email: false };

  constructor(public dialog: MatDialog, private cd: ChangeDetectorRef) {
    this.fs.getAccountData();
  }

  editData(dataType: 'name' | 'email') {
    const dialogRef =
      dataType === 'name'
        ? this.dialog.open(ChangeNameComponent)
        : this.dialog.open(ChangeEmailComponent);
  }

  changePublicLink() {}
}
