import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppointmentInfoService {
  private durationValue$ = new BehaviorSubject<string>('');

  public getDurationValue(): Observable<string> {
    return this.durationValue$;
  }

  updateDurationValue(value: string) {
    if (value) {
      this.durationValue$.next(value);
    }
  }

  data = {
    date: '',
    time: '',
    name: '',
    email: '',
  };

  constructor() {}
}
