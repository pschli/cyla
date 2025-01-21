import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
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
import { Observable } from 'rxjs';

@Component({
  selector: 'app-choose-duration',
  standalone: true,
  imports: [
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

  private token: string | null = null;
  durations$!: Observable<any>;

  selection = new FormControl<string | null>(null, Validators.required);

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.getDurations(this.token);
  }

  private getDurations(idLink: string) {
    let url =
      'http://127.0.0.1:5001/cyla-d3d28/us-central1/getdurationsfromtoken';
    let params = { idLink: idLink };
    this.durations$ = this.http.get(url, {
      params: params,
      responseType: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  validateSelection() {
    if (this.selection.valid && this.selection.value) {
      console.log(this.selection.value);
      // send Value to behavior Subject service -> load possible timeslots
      this.durationDataValid.emit(true);
    }
  }
}
