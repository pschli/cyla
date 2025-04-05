import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, RouterLink],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent implements OnInit {
  private router = inject(Router);
  private token: string | null = null;
  confirmResponse$: Observable<any> | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.confirmAppointment(this.token);
  }

  private confirmAppointment(idLink: string) {
    let url = 'https://confirmappointment-rlvuhdpanq-uc.a.run.app';
    let params = { idLink: idLink };
    this.confirmResponse$ = this.http.get(url, {
      params: params,
      responseType: 'json',
    });
  }
}
