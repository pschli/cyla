import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppointmentInfoService {
  scheduledMeeting = {
    date: '',
    time: '',
    name: '',
    email: '',
  };
  constructor() {}
}
