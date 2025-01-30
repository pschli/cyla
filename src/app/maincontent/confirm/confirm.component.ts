import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule],
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
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/confirmAppointment';
    let params = { idLink: idLink };
    this.confirmResponse$ = this.http.get(url, {
      params: params,
      responseType: 'json',
    });
  }
}
