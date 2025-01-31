import { Component, inject } from '@angular/core';
import { DatesInfoComponent } from '../dates-info/dates-info.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { DateDataService } from '../../services/date-data.service';
import { DateFormatterService } from '../../services/date-formatter.service';
import { map, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe } from '@angular/common';
import { UpcomingListElementComponent } from './upcoming-list-element/upcoming-list-element.component';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [
    AsyncPipe,
    DatesInfoComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    RouterLink,
    UpcomingListElementComponent,
  ],
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss',
})
export class UserPanelComponent {
  authService = inject(AuthService);
  router = inject(Router);
  userDates = inject(DateDataService);
  dateFormatter = inject(DateFormatterService);
  loading: boolean = true;
  username$ = this.authService.user$.pipe(map((user) => user?.displayName));
  user: string = '';
  monthsToDisplay: Date[] = [];
  monthLoaded = false;
  unsubUser?: Subscription;
  unsubAuth?: Subscription;
  pageIndex = 0;

  constructor(public dialog: MatDialog) {
    this.userDates.dataLoaded.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => {
        if (!data || this.monthLoaded) return;
        this.loadMonthsNumber();
        this.monthLoaded = true;
      },
    });
  }

  ngAfterViewInit(): void {
    this.loading = true;
    this.unsubUser = this.username$.subscribe((name) => {
      if (name) this.user = name;
    });
    this.unsubAuth = this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserSig.set({
          email: user.email!,
          username: user.displayName!,
        });
        this.loading = false;
      } else {
        this.authService.currentUserSig.set(null);
        this.router.navigateByUrl('');
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubAuth?.unsubscribe();
    this.unsubUser?.unsubscribe();
  }

  loadMonthsNumber() {
    let lastDate = new Date();
    if (this.userDates.selected.length > 0) {
      lastDate = this.userDates.selected[this.userDates.selected.length - 1];
    }
    let lastYear = lastDate.getFullYear();
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let yearDiff = lastYear - currentYear;
    let lastMonth = lastDate.getMonth() + yearDiff * 12;
    let monthDiff = lastMonth - currentMonth;
    this.monthsToDisplay = [];
    for (let i = 0; i <= monthDiff; i++) {
      this.monthsToDisplay.push(new Date(currentYear, currentMonth + i));
    }
    return true;
  }

  setPage(page: 'increment' | 'decrement') {
    switch (page) {
      case 'increment':
        this.pageIndex++;
        break;
      case 'decrement':
        this.pageIndex--;
        break;
    }
  }
}
