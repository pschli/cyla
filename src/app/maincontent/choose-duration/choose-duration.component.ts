import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { from, map, Observable } from 'rxjs';
import { AppointmentInfoService } from '../../services/appointment-info.service';
import { DurationPipe } from '../../pipes/duration.pipe';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Component({
  selector: 'app-choose-duration',
  standalone: true,
  imports: [
    DurationPipe,
    AsyncPipe,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './choose-duration.component.html',
  styleUrl: './choose-duration.component.scss',
})
export class ChooseDurationComponent {
  @Output() durationDataValid = new EventEmitter<boolean>();

  private functions = inject(Functions);

  private token: string | null = null;
  durations$!: Observable<any>;

  scheduledMeeting = inject(AppointmentInfoService);

  selection = new FormControl<string | null>(null, Validators.required);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.getDurations(this.token);
  }

  private getDurations(idLink: string) {
    const getDurationsFn = httpsCallable(
      this.functions,
      'getdurationsfromtoken'
    );
    this.durations$ = from(getDurationsFn({ idLink })).pipe(
      map((result) => result.data)
    );
  }

  // private getDurations(idLink: string) {
  //   let url = 'https://getdurationsfromtoken-rlvuhdpanq-uc.a.run.app';
  //   let params = { idLink: idLink };
  //   this.durations$ = this.http.get(url, {
  //     params: params,
  //     responseType: 'json',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   });
  // }

  validateSelection() {
    if (this.selection.valid && this.selection.value) {
      this.scheduledMeeting.updateDurationValue(this.selection.value);
      this.durationDataValid.emit(true);
    }
  }
}
