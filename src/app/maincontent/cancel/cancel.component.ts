import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cancel',
  standalone: true,
  imports: [],
  templateUrl: './cancel.component.html',
  styleUrl: './cancel.component.scss',
})
export class CancelComponent implements OnInit {
  private router = inject(Router);
  private token: string | null = null;
  private cancelSub: Subscription | null = null;
  private cancelValid: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.cancelAppointment(this.token);
  }

  private cancelAppointment(idLink: string) {
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/cancelAppointment';
    let params = { idLink: idLink };
    this.cancelSub = this.http
      .get(url, { params: params, responseType: 'json' })
      .subscribe((response) => {
        // let returnValue: any = response;
        // if (returnValue) {
        //   this.uid = returnValue.uid;
        //   if (!this.uid) this.router.navigateByUrl('invalidUserlink');
        // } else {
        //   this.router.navigateByUrl('invalidUserlink');
        // }
      });
  }

  ngOnDestroy(): void {
    this.cancelSub?.unsubscribe();
  }
}
