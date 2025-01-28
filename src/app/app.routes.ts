import { Routes } from '@angular/router';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { SuccessComponent } from './maincontent/success/success.component';
import { LandingComponent } from './landing/landing.component';
import { LearnmoreComponent } from './learnmore/learnmore.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { authGuard } from './services/auth.guard';
import { InvalidUserlinkComponent } from './error-pages/invalid-userlink/invalid-userlink.component';
import { UserPanelComponent } from './admin/user-panel/user-panel.component';
import { ConfirmComponent } from './maincontent/confirm/confirm.component';
import { CancelComponent } from './maincontent/cancel/cancel.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'schedule/:token', component: MaincontentComponent },
  { path: 'confirm/:token', component: ConfirmComponent },
  { path: 'cancel/:token', component: CancelComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'learnmore', component: LearnmoreComponent },
  { path: 'invalidUserlink', component: InvalidUserlinkComponent },
  { path: 'admin', component: UserPanelComponent, canActivate: [authGuard] },
  {
    path: 'admin/plan',
    component: AdminPanelComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: LandingComponent },
];
