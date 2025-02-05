import { inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { UserDates } from '../interfaces/user-dates';
import {
  BehaviorSubject,
  firstValueFrom,
  from,
  lastValueFrom,
  map,
  Observable,
  Subscription,
  tap,
} from 'rxjs';
import { DateFormatterService } from './date-formatter.service';
import { FirestoreService } from './firestore.service';
import {
  collection,
  collectionData,
  doc,
  getDoc,
} from '@angular/fire/firestore';

interface TimeslotData {
  time: string;
  duration: string;
  reserved: boolean;
  blocked: boolean;
  taken: boolean;
  appointment?: {
    token: string | null;
  };
}

@Injectable({
  providedIn: null,
})
export class DateDataService implements OnDestroy, OnInit {
  dateFormatter = inject(DateFormatterService);
  fs = inject(FirestoreService);
  appointmentData$: Observable<UserDates[]> = new Observable();
  orderedDates$: Observable<UserDates[]> = new Observable();
  orderedAndValid$: Observable<UserDates[]> = new Observable();
  activeAppointments$: Observable<UserDates[]> = new Observable();

  selected: Date[] = []; // dates selected in month display
  markedToEdit: Date[] = []; // dates selected in choose timeslots

  publicLink$ = new BehaviorSubject<string | null>(null);
  linkLoaded$ = new BehaviorSubject<boolean>(false);

  dataLoaded = new BehaviorSubject<string | undefined>(undefined);

  selectedSub?: Subscription;
  linkSub?: Subscription;

  constructor() {
    if (this.fs.currentUid) {
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
      this.orderedAndValid$ = this.orderedDates$.pipe(
        map((data) =>
          data.filter((date) => new Date(date.date) > new Date(Date.now()))
        )
      );
      this.activeAppointments$ = this.orderedAndValid$.pipe(
        map((data) =>
          data.filter((date) =>
            date.times.some((element) => element.taken === true)
          )
        )
      );
      this.selectedSub = this.appointmentData$.subscribe((data) => {
        this.selected = [];
        data.forEach((element) => {
          this.selected.push(new Date(element.date));
        });
        this.updateDates();
        this.dataLoaded.next('loaded');
      });
      this.getPublicLink();
    }
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.selectedSub?.unsubscribe();
    if (this.linkSub) {
      this.linkSub?.unsubscribe();
    }
  }

  async getPublicLink() {
    if (this.linkSub) {
      this.linkSub?.unsubscribe();
    }
    this.linkLoaded$.next(false);
    const UserDocRef = doc(this.fs.firestore, 'users', this.fs.currentUid);

    const publicLink$ = from(getDoc(UserDocRef)).pipe(
      map((docSnap) =>
        docSnap.exists() ? docSnap.data()?.['publiclink'] : null
      ),
      tap((publicLink) => {
        this.publicLink$.next(publicLink);
        this.linkLoaded$.next(true);
      })
    );

    this.linkSub = publicLink$.subscribe();
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
    this.fs.saveSelected({ date: dateString, durations: [], times: [] });
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

  updateTimeslots(timesArray: Array<TimeslotData>, durations: Array<string>) {
    let errors = 0;
    this.markedToEdit.forEach((date) => {
      let dateString = this.dateFormatter.getStringFromDate(date);
      try {
        this.fs.saveSelected({
          date: dateString,
          durations: durations,
          times: timesArray,
        });
      } catch (e) {
        console.error('Error saving Appointment Data', e);
        errors++;
      }
    });
    if (errors > 0) return true;
    else return false;
  }
}
