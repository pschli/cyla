import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, RouterLink],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.scss',
})
export class CancelComponent implements OnInit {
  private router = inject(Router);
  private token: string | null = null;
  cancelResponse$: Observable<any> | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.cancelAppointment(this.token);
  }

  private cancelAppointment(idLink: string) {
    let url = 'https://cancelappointment-rlvuhdpanq-uc.a.run.app';
    let params = { idLink: idLink };
    this.cancelResponse$ = this.http.get(url, {
      params: params,
      responseType: 'json',
    });
  }
}
