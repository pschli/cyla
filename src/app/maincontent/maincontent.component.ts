import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormstepperComponent } from './formstepper/formstepper.component';
import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
  httpsCallableFromURL,
} from 'firebase/functions';

import { getApp } from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-maincontent',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormstepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './maincontent.component.html',
  styleUrl: './maincontent.component.scss',
})
export class MaincontentComponent implements OnInit {
  token: string | null = null;
  uidSub: Subscription | null = null;
  private uid: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.getData(this.token);
  }

  // getData(token: string) {
  //   const functions = getFunctions(getApp());
  //   connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  //   const getIdFromToken = httpsCallableFromURL(
  //     functions,
  //     'http://127.0.0.1:5001/cyla-d3d28/us-central1/getIdFromToken?token=1234'
  //   );
  //   getIdFromToken().then((result) => {
  //     console.log(result);
  //   });
  // }

  getData(token: string) {
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/getIdFromToken';
    let params = { token: token };
    this.uidSub = this.http
      .get(url, { params: params, responseType: 'json' })
      .subscribe((response) => {
        let returnValue: any = response;
        if (returnValue.uid) {
          this.uid = returnValue.uid;
          console.log(this.uid);
        } else {
          console.error('Userdata not found');
        }
      });
  }

  ngOnDestroy(): void {
    this.uidSub?.unsubscribe();
  }
}
