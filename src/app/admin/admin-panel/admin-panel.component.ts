import { AfterViewInit, Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs/operators';
import { MonthDisplayComponent } from './month-display/month-display.component';
import { DateDataService } from '../../services/date-data.service';
import { MatIconModule } from '@angular/material/icon';
import { DatesInfoComponent } from '../dates-info/dates-info.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    DatesInfoComponent,
    MatCardModule,
    MatButtonModule,
    MonthDisplayComponent,
    MatIconModule,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent implements AfterViewInit {
  authService = inject(AuthService);
  router = inject(Router);
  userDates = inject(DateDataService);
  loading: boolean = true;
  username$ = this.authService.user$.pipe(map((user) => user?.displayName));
  user: string = '';
  monthsToDisplay: Date[] = [];
  activeMode = signal(0);
  monthLoaded = false;

  constructor() {
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
    this.username$.subscribe((name) => {
      if (name) this.user = name;
    });
    this.authService.user$.subscribe((user) => {
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

  addMonth() {
    let lastMonth = this.monthsToDisplay[this.monthsToDisplay.length - 1];
    this.monthsToDisplay.push(
      new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1)
    );
  }

  setActiveMode(mode: number) {
    this.activeMode.set(mode);
  }
}
