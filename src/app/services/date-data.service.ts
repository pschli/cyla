import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateDataService {
  selected: Date[] = [];

  constructor() {
    this.selected = [
      new Date('11/2/2024'),
      new Date('11/3/2024'),
      new Date('12/2/2024'),
      new Date('12/12/2024'),
      new Date('11/30/2024'),
      new Date('1/30/2025'),
    ];
    this.updateDates();
  }

  // fix activeYear!
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
    let validDates = this.getFutureDates();
    let sortedDates = this.sortDates(validDates);
    this.selected = sortedDates;
  }

  sortDates(dates: Date[]): Date[] {
    dates.sort((a: Date, b: Date) => a.getTime() - b.getTime());
    return dates;
  }

  getFutureDates(): Date[] {
    let currentDate: Date = new Date();
    let returnDates: Date[] = [];
    this.selected.forEach((date) => {
      if (date > currentDate) {
        returnDates.push(date);
      }
    });
    return returnDates;
  }
}
