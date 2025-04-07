import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormstepperComponent } from './formstepper/formstepper.component';
import { Subscription } from 'rxjs';
import { Functions, httpsCallable } from '@angular/fire/functions';

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
  private functions = inject(Functions);
  private token: string | null = null;
  private uidSub: Subscription | null = null;
  private uid: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.token = routeParams.get('token');
    if (this.token) this.getId(this.token);
  }

  private async getId(idLink: string) {
    const getUid = httpsCallable(this.functions, 'getidfromtoken');
    try {
      const result: any = await getUid({ idLink: idLink });
      this.uid = result.data?.uid;
      if (!this.uid) this.router.navigateByUrl('invalidUserlink');
    } catch (error) {
      console.error('Error fetching UID:', error);
      this.router.navigateByUrl('invalidUserlink');
      throw error;
    }
  }

  ngOnDestroy(): void {
    this.uidSub?.unsubscribe();
  }
}
