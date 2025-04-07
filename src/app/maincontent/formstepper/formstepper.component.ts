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
import { from, map, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Functions, httpsCallable } from '@angular/fire/functions';

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
  private functions = inject(Functions);
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
  private durationSub: Subscription = this.scheduledMeeting
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
    if (this.availableDatesSub) this.availableDatesSub.unsubscribe();
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
      const getDataFn = httpsCallable(this.functions, 'getdatafromtoken');
      this.timeslots$ = from(
        getDataFn({
          idLink: this.token,
          duration: value,
        })
      ).pipe(map((result) => ({ data: result.data })));
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
      this.router.navigate(['/', 'success']).then((err) => {});
    } else {
      console.error('Unable to confirm appointment');
    }
  }

  async sendDataToBackend(data: {
    date: string;
    time: string;
    name: string;
    email: string;
  }): Promise<boolean> {
    if (this.token) {
      const saveDataFn = httpsCallable(this.functions, 'savedata');
      try {
        const params = {
          idLink: this.token,
          date: data.date,
          time: data.time,
          name: data.name,
          email: data.email,
        };

        await saveDataFn(params);
        return true;
      } catch (err) {
        console.error('Error saving data:', err);
        return false;
      }
    } else {
      return false;
    }
  }

  //   async sendDataToBackend(data: {
  //     date: string;
  //     time: string;
  //     name: string;
  //     email: string;
  //   }): Promise<boolean> {
  //     if (this.token) {
  //       let url = 'https://savedata-rlvuhdpanq-uc.a.run.app';
  //       let params = {
  //         idLink: this.token,
  //         date: data.date,
  //         time: data.time,
  //         name: data.name,
  //         email: data.email,
  //       };
  //       try {
  //         await this.http
  //           .get(url, {
  //             params: params,
  //             responseType: 'json',
  //             headers: {
  //               'Content-Type': 'application/json',
  //             },
  //           })
  //           .toPromise();
  //         return true;
  //       } catch (err) {
  //         console.error(err);
  //         return false;
  //       }
  //     } else return false;
  //   }
}
