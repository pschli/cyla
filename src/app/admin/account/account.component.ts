import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe } from '@angular/common';
import { FirestoreService } from '../../services/firestore.service';
import { merge, Observable } from 'rxjs';
import { DocumentData } from '@angular/fire/firestore';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { animate, style, transition, trigger } from '@angular/animations';

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
  userData$: Observable<DocumentData | null> | undefined;

  animationState = { name: 'pending', email: 'pending' };

  editSelection = { name: false, email: false };

  constructor() {
    this.userData$ = this.fs.getAccountData();
  }

  editData(dataType: 'name' | 'email') {}

  changePublicLink() {}
}
