import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [],
  templateUrl: './confirm.component.html',
  styleUrl: './confirm.component.scss',
})
export class ConfirmComponent implements OnInit {
  private router = inject(Router);
  private token: string | null = null;
  private confirmSub: Subscription | null = null;
  private confirmValid: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.confirmAppointment(this.token);
  }

  private confirmAppointment(idLink: string) {
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/confirmAppointment';
    let params = { idLink: idLink };
    this.confirmSub = this.http
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
    this.confirmSub?.unsubscribe();
  }
}
