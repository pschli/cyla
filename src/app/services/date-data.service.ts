import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateDataService {
  selectedDates: Date[] = [];

  constructor() {}
}
