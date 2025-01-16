import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, from, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DurationsService {
  private durations = new BehaviorSubject<string[]>([]);
  private durations$: Observable<string[]> = this.durations.asObservable();

  constructor() {}

  getValues(): Observable<string[]> {
    return this.durations$;
  }

  addValue(value: string) {
    this.durations$.pipe(take(1)).subscribe((val) => {
      const newArr = [...val, value];
      this.durations.next(newArr);
    });
  }

  // removeElementToObservableArray(idx) {
  //   this.array$.pipe(take(1)).subscribe(val => {
  //     const arr = this.subject.getValue()
  //     arr.splice(idx, 1)
  //     this.subject.next(arr)
  //   })
  // }
}
