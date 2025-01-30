import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent implements OnInit {
  private router = inject(Router);
  private token: string | null = null;
  confirmResponse$: Observable<any> | null = null;
  confirmState: 'loading' | 'success' | 'error' = 'loading';
  message = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.confirmAppointment(this.token);
  }

  private confirmAppointment(idLink: string) {
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/confirmAppointment';
    let params = { idLink: idLink };
    this.confirmResponse$ = this.http.get(url, {
      params: params,
      responseType: 'json',
    });
    // .subscribe((response: any) => {
    //   switch (response.response) {
    //     case 'success':
    //       this.confirmState = 'success';
    //       break;
    //     case 'already confirmed':
    //       this.confirmState = 'error';
    //       break;
    //     case 'database error':
    //       this.confirmState = 'error';
    //       break;
    //     case 'no timeslots available':
    //       this.confirmState = 'error';
    //       break;
    //     case 'too late':
    //       this.confirmState = 'error';
    //       break;
    //   }
    // });
  }
}
