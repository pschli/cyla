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
import { AdminComponent } from './admin/admin.component';
import { AccountComponent } from './admin/account/account.component';
import { ConfirmEmailComponent } from './maincontent/confirm-email/confirm-email.component';
import { AccountDeletedComponent } from './maincontent/account-deleted/account-deleted.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'schedule/:token', component: MaincontentComponent },
  { path: 'confirm/:token', component: ConfirmComponent },
  { path: 'cancel/:token', component: CancelComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'learnmore', component: LearnmoreComponent },
  { path: 'invalidUserlink', component: InvalidUserlinkComponent },
  { path: 'confirm-email', component: ConfirmEmailComponent },
  { path: 'account-deleted', component: AccountDeletedComponent },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'plan',
        component: AdminPanelComponent,
        canActivate: [authGuard],
      },
      {
        path: 'overview',
        component: UserPanelComponent,
        canActivate: [authGuard],
      },
      {
        path: 'account',
        component: AccountComponent,
        canActivate: [authGuard],
      },
    ],
  },

  { path: '**', component: LandingComponent },
];
