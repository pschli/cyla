import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-timeslot-details',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './timeslot-details.component.html',
  styleUrl: './timeslot-details.component.scss',
})
export class TimeslotDetailsComponent implements OnInit {
  @Input() token!: string;

  contacts$!: Observable<any>;
  userDetails: any | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userDetails = this.getDataFromToken(this.token);
  }

  getDataFromToken(token: string) {
    let url =
      'http://127.0.0.1:5001/cyla-d3d28/us-central1/getcontactfromtoken';
    if (token) {
      let params = { idLink: token };
      this.contacts$ = this.http.get(url, {
        params: params,
        responseType: 'json',
      });
    }
    return;
  }
}
