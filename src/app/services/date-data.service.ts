import { inject, Injectable, OnDestroy, OnInit } from '@angular/core';
import { UserDates } from '../interfaces/user-dates';
import {
  BehaviorSubject,
  from,
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
  docData,
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

interface UserBaseData {
  email: string;
  firstname: string;
  lastname: string;
  publiclink?: string;
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
  planningCompleted$: Observable<UserDates[]> = new Observable();
  activeAppointments$: Observable<UserDates[]> = new Observable();
  userBaseData$: Observable<UserBaseData> = new Observable();

  userBaseData: UserBaseData = { email: '', firstname: '', lastname: '' };

  active: UserDates[] = [];

  selected: Date[] = []; // dates selected in month display
  planned: Date[] = []; // dates with complete planning
  taken: Date[] = []; // dates taken for appointmentsin month display
  markedToEdit: Date[] = []; // dates selected in choose timeslots

  publicLink$ = new BehaviorSubject<string | null>(null);
  linkLoaded$ = new BehaviorSubject<boolean>(false);

  dataLoaded = new BehaviorSubject<string | undefined>(undefined);

  selectedSub?: Subscription;
  takenSub?: Subscription;
  plannedSub?: Subscription;
  linkSub?: Subscription;
  activeSub?: Subscription;
  userBaseDataSub?: Subscription;

  constructor() {
    if (this.fs.currentUid) {
      const DateCollection = collection(
        this.fs.firestore,
        `data/${this.fs.currentUid}/datesCol`
      );

      const UsersCollection = doc(
        this.fs.firestore,
        `users/${this.fs.currentUid}`
      );

      this.appointmentData$ = collectionData(DateCollection) as Observable<any>;
      this.userBaseData$ = docData(UsersCollection) as Observable<any>;
      this.userBaseDataSub = this.userBaseData$.subscribe((data) => {
        this.userBaseData = data;
      });
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
      this.planningCompleted$ = this.orderedAndValid$.pipe(
        map((data) => data.filter((date) => date.times.length > 0))
      );
      this.activeAppointments$ = this.orderedAndValid$.pipe(
        map((data) =>
          data.filter((date) =>
            date.times.some((element) => element.taken === true)
          )
        )
      );

      this.activeSub = this.activeAppointments$.subscribe((data) => {
        this.active = data;
      });
      this.selectedSub = this.appointmentData$.subscribe((data) => {
        this.selected = [];
        data.forEach((element) => {
          this.selected.push(new Date(element.date));
        });
        this.updateDates();
        this.dataLoaded.next('loaded');
      });
      this.takenSub = this.activeAppointments$.subscribe((data) => {
        this.taken = [];
        data.forEach((element) => {
          this.taken.push(new Date(element.date));
        });
        this.updateDates();
        this.dataLoaded.next('loaded');
      });
      this.plannedSub = this.planningCompleted$.subscribe((data) => {
        this.planned = [];
        data.forEach((element) => {
          this.planned.push(new Date(element.date));
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
    this.takenSub?.unsubscribe();
    this.plannedSub?.unsubscribe();
    if (this.linkSub) {
      this.linkSub?.unsubscribe();
    }
    if (this.activeSub) {
      this.activeSub?.unsubscribe();
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

  async removeAppointment(date: string, time: string) {
    let appointmentToChange: UserDates | undefined;
    this.active.forEach((appointment) => {
      if (appointment.date === date) {
        appointmentToChange = appointment;
      }
    });
    if (!appointmentToChange) return 'error';
    let sourceTimes: TimeslotData[] = appointmentToChange.times;
    let targetTimes: TimeslotData[] = [];
    if (sourceTimes.length > 0) {
      sourceTimes.forEach((timeElement: TimeslotData) => {
        let newTimeElement: TimeslotData = timeElement;
        if (timeElement.time === time) {
          newTimeElement.reserved = false;
          newTimeElement.taken = false;
          newTimeElement.appointment = { token: null };
        }
        targetTimes.push(newTimeElement);
      });
    }
    if (targetTimes.length === 0) return 'error';
    let result = await this.fs.updateTimes(date, targetTimes);
    return result;
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
