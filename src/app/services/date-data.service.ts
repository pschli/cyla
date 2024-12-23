import { inject, Injectable, OnDestroy } from '@angular/core';
import { UserDates } from '../interfaces/user-dates';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { DateFormatterService } from './date-formatter.service';
import { FirestoreService } from './firestore.service';
import { collection, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DateDataService implements OnDestroy {
  dateFormatter = inject(DateFormatterService);
  fs = inject(FirestoreService);
  appointmentData$: Observable<UserDates[]>;
  orderedDates$: Observable<UserDates[]>;

  selected: Date[] = []; // dates selected in month display
  markedToEdit: Date[] = []; // dates selected in choose timeslots

  dataLoaded = new BehaviorSubject<string | undefined>(undefined);
  refreshCounter$ = new BehaviorSubject<number>(0);

  selectedSub?: Subscription;

  constructor() {
    const DateCollection = collection(
      this.fs.firestore,
      `data/${this.fs.currentUid}/datesCol`
    );
    this.appointmentData$ = collectionData(DateCollection) as Observable<any>;
    this.orderedDates$ = this.appointmentData$.pipe(
      map((data) => {
        data.sort((a, b) => {
          return new Date(a.date) < new Date(b.date) ? -1 : 1;
        });
        return data;
      })
    );
    this.selectedSub = this.appointmentData$.subscribe((data) => {
      this.selected = [];
      data.forEach((element) => {
        this.selected.push(new Date(element.date));
      });
      this.updateDates();
      this.dataLoaded.next('loaded');
    });
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
    if (!this.selected) return;
    let validDates = this.getFutureDates(this.selected);
    let sortedDates = this.sortDates(validDates);
    this.selected = sortedDates;
  }

  sortDates(userDatesArr: Date[]): Date[] {
    userDatesArr.sort((a: Date, b: Date) => a.getTime() - b.getTime());
    return userDatesArr;
  }

  getFutureDates(userDatesArr: Date[]): Date[] {
    let currentDate: Date = new Date();
    let returnDatesArr: Date[] = [];
    userDatesArr.forEach((date) => {
      if (date > currentDate) {
        returnDatesArr.push(date);
      }
    });
    return returnDatesArr;
  }

  addToSelected(date: Date) {
    this.selected.push(date);
    let dateString = this.dateFormatter.getStringFromDate(date);
    this.fs.saveSelected({ date: dateString, times: [] });
  }

  removeFromSelected(date: Date) {
    let dateString = this.dateFormatter.getStringFromDate(date);
    this.selected.forEach((item, index) => {
      if (this.dateFormatter.getStringFromDate(item) === dateString) {
        this.selected.splice(index, 1);
      }
    });
    this.fs.removeSelected(dateString);
  }

  increaseCounter() {
    let count = this.refreshCounter$.value;
    this.refreshCounter$.next(count++ % 10);
  }
}
