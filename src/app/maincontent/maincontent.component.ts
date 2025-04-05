import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormstepperComponent } from './formstepper/formstepper.component';
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
  private router = inject(Router);
  private token: string | null = null;
  private uidSub: Subscription | null = null;
  private uid: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.getId(this.token);
  }

  private getId(idLink: string) {
    let url = 'https://getidfromtoken-rlvuhdpanq-uc.a.run.app';
    let params = { idLink: idLink };
    this.uidSub = this.http
      .get(url, { params: params, responseType: 'json' })
      .subscribe((response) => {
        let returnValue: any = response;
        if (returnValue) {
          this.uid = returnValue.uid;
          if (!this.uid) this.router.navigateByUrl('invalidUserlink');
        } else {
          this.router.navigateByUrl('invalidUserlink');
        }
      });
  }

  ngOnDestroy(): void {
    this.uidSub?.unsubscribe();
  }
}
