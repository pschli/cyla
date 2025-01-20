import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-choose-duration',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './choose-duration.component.html',
  styleUrl: './choose-duration.component.scss',
})
export class ChooseDurationComponent {
  @Output() durationDataValid = new EventEmitter<boolean>();

  private token: string | null = null;
  durations$!: Observable<any>;

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
}
