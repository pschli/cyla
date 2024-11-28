import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateDataService {
  selected: Date[] = [];

  constructor() {}

  getComparableDates(dates: Date[], activeMonth: number): number[] {
    let comparableDates: number[] = [];
    dates.forEach((dateElement) => {
      if (dateElement.getMonth() === activeMonth) {
        comparableDates.push(dateElement.getDate());
      }
    });
    return comparableDates;
  }
}
