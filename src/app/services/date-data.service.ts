import { inject, Injectable, OnDestroy } from '@angular/core';
import { UserDates } from '../interfaces/user-dates';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { DateFormatterService } from './date-formatter.service';

@Injectable({
  providedIn: 'root',
})
export class DateDataService implements OnDestroy {
  dateFormatter = inject(DateFormatterService);
  selected: Date[] = [];
  userDates: UserDates[] = [
    {
      date: '1/30/2025',
      times: [
        {
          time: '15.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '16.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '17.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '18.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
      ],
    },
    {
      date: '1/05/2025',
      times: [
        {
          time: '15.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '16.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '17.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '18.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
      ],
    },
    {
      date: '1/01/2025',
      times: [
        {
          time: '15.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '16.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '17.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
        {
          time: '18.00',
          reserved: false,
          blocked: false,
          taken: false,
        },
      ],
    },
    { date: '12/30/2024', times: [] },
  ];
  userDates$: BehaviorSubject<Array<UserDates>>;
  selected$: Observable<Array<Date>>;
  selectedSub?: Subscription;

  constructor() {
    this.selected = [];
    this.userDates$ = new BehaviorSubject(this.userDates);
    this.selected$ = this.userDates$.pipe(
      map((data) => data.map((obj) => new Date(obj.date)))
    );
    this.selectedSub = this.selected$.subscribe((dates) => {
      this.selected = [];
      dates.map((date) => {
        this.selected.push(date);
      });
    });
    this.updateDates();
  }

  ngOnDestroy(): void {
    this.selectedSub?.unsubscribe();
  }

  getComparableDates(
    dates: Date[],
    activeMonth: number,
    activeYear: number
  ): number[] {
    let comparableDates: number[] = [];
    dates.forEach((dateElement) => {
      if (
        dateElement.getMonth() === activeMonth &&
        dateElement.getFullYear() === activeYear
      ) {
        comparableDates.push(dateElement.getDate());
      }
    });
    return comparableDates;
  }

  updateDates() {
    let userDatesArr = [...this.userDates$.getValue()];
    let validDates = this.getFutureDates(userDatesArr);
    let sortedDates = this.sortDates(validDates);
    this.userDates$.next(sortedDates);
  }

  sortDates(userDatesArr: UserDates[]): UserDates[] {
    userDatesArr.sort(
      (a: UserDates, b: UserDates) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    return userDatesArr;
  }

  getFutureDates(userDatesArr: UserDates[]): UserDates[] {
    let currentDate: Date = new Date();
    let returnDatesArr: UserDates[] = [];
    userDatesArr.forEach((data) => {
      if (new Date(data.date) > currentDate) {
        returnDatesArr.push(data);
      }
    });
    return returnDatesArr;
  }

  // handle sync userDates <> selected

  addToSelected(date: Date) {
    this.selected.push(date);
    let dateString = this.dateFormatter.getStringFromDate(date);
    this.userDates$.next([
      ...this.userDates$.getValue(),
      { date: dateString, times: [] },
    ]);
    this.updateDates();
  }

  removeFromSelected(date: Date) {
    let dateString = this.dateFormatter.getStringFromDate(date);
    let userDatesArr = [...this.userDates$.getValue()];
    userDatesArr.forEach((item, index) => {
      if (item.date === dateString) {
        userDatesArr.splice(index, 1);
      }
    });
    this.userDates$.next(userDatesArr);
    this.updateDates();
  }
}
