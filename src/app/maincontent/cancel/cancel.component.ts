import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { from, map, Observable } from 'rxjs';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [AsyncPipe, MatButtonModule, RouterLink],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.scss',
})
export class CancelComponent implements OnInit {
  private router = inject(Router);
  private functions = inject(Functions);
  private token: string | null = null;
  cancelResponse$: Observable<any> | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.cancelAppointment(this.token);
  }

  private cancelAppointment(idLink: string) {
    console.log(idLink);
    const cancelFn = httpsCallable(this.functions, 'cancelAppointment');

    this.cancelResponse$ = from(cancelFn({ idLink: idLink })).pipe(
      map((result) => result.data)
    );
  }
}
