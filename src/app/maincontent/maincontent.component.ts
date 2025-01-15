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
    if (this.token) this.getDurations(this.token);
  }

  private getDurations(idLink: string) {
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/getIdFromToken';
    let params = { idLink: idLink };
    this.uidSub = this.http
      .get(url, { params: params, responseType: 'json' })
      .subscribe((response) => {
        let returnValue: any = response;
        if (returnValue.uid) {
          this.uid = returnValue.uid;
        } else {
          this.router.navigateByUrl('invalidUserlink');
        }
      });
  }

  ngOnDestroy(): void {
    this.uidSub?.unsubscribe();
  }
}
