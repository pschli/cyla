import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account-deleted',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './account-deleted.component.html',
  styleUrl: './account-deleted.component.scss',
})
export class AccountDeletedComponent {}
