import { WeekDay } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {
  constructor() {}

  fixInput(inputValue: string) {
    let transformedValue: string = '';
    let separators: number[] | null = this.findSeparators(inputValue);
    if (separators) {
      transformedValue = this.transformInput(inputValue, separators);
    }
    return transformedValue;
  }

  transformInput(inputValue: string, separators: number[]) {
    let day = inputValue.substring(0, separators[0]);
    let month = inputValue.substring(separators[0] + 1, separators[1]);
    let year = inputValue.substring(separators[1] + 1);
    if (this.formatIsIncorrect(day, month, year)) {
      return '';
    } else {
      return month + '/' + day + '/' + year;
    }
  }

  formatIsIncorrect(day: string, month: string, year: string) {
    return (
      day.length < 1 ||
      day.length > 2 ||
      month.length < 1 ||
      month.length > 2 ||
      year.length < 2 ||
      year.length > 4
    );
  }

  getStringFromDate(date: Date) {
    return (
      (date.getMonth() + 1).toString() +
      '/' +
      date.getDate().toString() +
      '/' +
      date.getFullYear().toString()
    );
  }

  getLocalDate(dateString: string) {
    let localDate: string = '';
    const options: Intl.DateTimeFormatOptions | undefined = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    if (dateString) {
      let date = new Date(dateString);
      localDate = date.toLocaleDateString('de-DE', options);
    }
    return localDate;
  }

  findSeparators(inputValue: string) {
    let separators = inputValue.match(/[^0-9]/g);
    if (separators && separators.length === 2) {
      let first = inputValue.indexOf(separators[0]);
      let second = inputValue.indexOf(separators[1], first + 1);
      if (first !== -1 && second !== -1) {
        return [first, second];
      }
    }
    return null;
  }
}
