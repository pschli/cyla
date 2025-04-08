import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { from, map, Observable } from 'rxjs';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, RouterLink],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent implements OnInit {
  private router = inject(Router);
  private functions = inject(Functions);
  private token: string | null = null;
  confirmResponse$: Observable<any> | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.confirmAppointment(this.token);
  }

  private confirmAppointment(idLink: string) {
    const confirmFn = httpsCallable(this.functions, 'confirmAppointment');

    this.confirmResponse$ = from(confirmFn({ idLink })).pipe(
      map((result) => result.data)
    );
  }
}
