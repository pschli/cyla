import { AfterViewInit, Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { map } from 'rxjs/operators';
import { MonthDisplayComponent } from './month-display/month-display.component';
import { DateDataService } from '../../services/date-data.service';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    MatCardModule,
    MatButtonModule,
    MonthDisplayComponent,
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
  monthsToDisplay: Date[] = [];

  ngAfterViewInit(): void {
    this.loading = true;
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
    this.loadMonthsNumber();
  }

  loadMonthsNumber() {
    this.userDates.updateDates();
    let lastDate = this.userDates.selected[this.userDates.selected.length - 1];
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
  }

  addMonth() {
    let lastMonth = this.monthsToDisplay[this.monthsToDisplay.length - 1];
    this.monthsToDisplay.push(
      new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1)
    );
  }
}
