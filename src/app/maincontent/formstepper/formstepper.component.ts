import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectorRef } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ChooseTimeComponent } from '../choose-time/choose-time.component';
import { ChooseDateComponent } from '../choose-date/choose-date.component';
import { AppointmentInfoService } from '../../services/appointment-info.service';
import { DateFormatterService } from '../../services/date-formatter.service';
import { AddContactDataComponent } from '../add-contact-data/add-contact-data.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { ChooseDurationComponent } from '../choose-duration/choose-duration.component';
import { Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formstepper',
  standalone: true,
  imports: [
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatDatepickerModule,
    ChooseTimeComponent,
    ChooseDateComponent,
    AddContactDataComponent,
    ChooseDurationComponent,
  ],
  templateUrl: './formstepper.component.html',
  styleUrl: './formstepper.component.scss',
})
export class FormstepperComponent {
  scheduledMeeting = inject(AppointmentInfoService);
  dateFormatter = inject(DateFormatterService);
  dateSelected?: boolean;
  private token: string | null = null;
  localDate: string = '';
  durationFormCompleted = false;
  contactFormCompleted = false;
  dateFormCompleted = false;
  timeslots$: Observable<any> = new Observable();
  availableDates: Date[] = [];
  availableTimes: string[] = [];
  timeslotsDataset: Array<{ date: string; times: Array<string> }> = [];
  availableDatesSub!: Subscription;
  durationSub: Subscription = this.scheduledMeeting
    .getDurationValue()
    .subscribe((value) => {
      if (value !== '') {
        this.loadTimeSlots(value);
      }
    });

  legalCheck = new FormGroup({
    checked: new FormControl(false, [Validators.required]),
  });

  constructor(
    private ref: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
  }

  ngOnDestroy(): void {
    this.durationSub.unsubscribe();
    this.availableDatesSub.unsubscribe();
  }

  setContactStepValidity(event: boolean) {
    this.contactFormCompleted = event;
  }

  setDurationStepValidity(event: boolean) {
    this.durationFormCompleted = event;
  }

  loadTimeSlots(value: string) {
    if (this.token) {
      if (this.availableDatesSub) this.availableDatesSub.unsubscribe();
      let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/getdatafromtoken';
      let params = { idLink: this.token, duration: value };
      this.timeslots$ = this.http.get(url, {
        params: params,
        responseType: 'json',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      this.availableDatesSub = this.timeslots$.subscribe((slots) => {
        this.availableDates = [];
        this.timeslotsDataset = slots.data;
        slots.data.forEach((item: any) => {
          this.availableDates.push(new Date(item.date));
        });
      });
    }
  }

  addTime(time: string) {
    this.scheduledMeeting.data.time = time;
    this.localDate = this.dateFormatter.getLocalDate(
      this.scheduledMeeting.data.date
    );
    this.dateFormCompleted = true;
  }

  checkDateValidity(valid: boolean) {
    this.dateSelected = valid;
    this.dateFormCompleted = false;
    this.ref.detectChanges();
  }

  getTimeslots(chosenDate: string) {
    this.dateSelected = true;
    const matchingSet = this.timeslotsDataset.filter(
      (element) => element.date === chosenDate
    );
    this.availableTimes = matchingSet[0].times;
    this.scheduledMeeting.data.time = '';
  }

  async submitData() {
    let confirmation = await this.sendDataToBackend(this.scheduledMeeting.data);
    if (confirmation) {
      this.router.navigate(['/', 'success']).then(
        (nav) => {
          console.log(nav); // true if navigation is successful
        },
        (err) => {
          console.log(err); // when there's an error
        }
      );
    } else {
      console.log('Unable to conform appointment');
    }
  }

  async sendDataToBackend(data: {
    date: string;
    time: string;
    name: string;
    email: string;
  }): Promise<boolean> {
    return true;
  }
}
