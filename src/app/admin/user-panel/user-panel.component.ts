import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatesInfoComponent } from '../dates-info/dates-info.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { DateDataService } from '../../services/date-data.service';
import { DateFormatterService } from '../../services/date-formatter.service';
import { Observable, Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { AsyncPipe, NgIf } from '@angular/common';
import { UpcomingListElementComponent } from './upcoming-list-element/upcoming-list-element.component';
import { CreatePublicLinkComponent } from './create-public-link/create-public-link.component';
import { PublicLinkComponent } from './public-link/public-link.component';
import { MatButton, MatFabButton } from '@angular/material/button';
import { GreetingService } from '../../services/greeting.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [
    CreatePublicLinkComponent,
    NgIf,
    AsyncPipe,
    DatesInfoComponent,
    MatCardModule,
    MatButton,
    MatFabButton,
    MatIconModule,
    MatDividerModule,
    RouterLink,
    UpcomingListElementComponent,
    PublicLinkComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-panel.component.html',
  styleUrl: './user-panel.component.scss',
  animations: [
    trigger('greeting', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1, position: 'absolute' }),
        animate('400ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
    trigger('overview', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms 450ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('400ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class UserPanelComponent {
  authService = inject(AuthService);
  router = inject(Router);
  userDates = inject(DateDataService);
  dateFormatter = inject(DateFormatterService);
  greeting = inject(GreetingService);
  loading: boolean = true;
  monthsToDisplay: Date[] = [];
  monthLoaded = false;
  unsubUser?: Subscription;
  unsubAuth?: Subscription;
  pageIndex = 0;
  greeting$: Observable<number>;

  constructor(public dialog: MatDialog) {
    this.userDates.dataLoaded.pipe(takeUntilDestroyed()).subscribe({
      next: (data) => {
        if (!data || this.monthLoaded) return;
        this.loadMonthsNumber();
        this.monthLoaded = true;
      },
    });
    this.greeting$ = this.greeting.getTrigger();
  }

  ngAfterViewInit(): void {
    this.loading = true;
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
    this.updateGreeting();
  }

  ngOnDestroy(): void {
    this.unsubAuth?.unsubscribe();
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

  updateGreeting() {
    setTimeout(() => {
      this.greeting.requestUpdate();
    }, 15000);
  }
}
