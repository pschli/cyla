import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppointmentInfoService {
  data = {
    date: '',
    time: '',
    name: '',
    email: '',
  };
  constructor() {}
}
