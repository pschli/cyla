import { Routes } from '@angular/router';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { SuccessComponent } from './maincontent/success/success.component';
import { LandingComponent } from './landing/landing.component';
import { LearnmoreComponent } from './learnmore/learnmore.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { authGuard } from './services/auth.guard';
import { InvalidUserlinkComponent } from './error-pages/invalid-userlink/invalid-userlink.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'schedule/:token', component: MaincontentComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'learnmore', component: LearnmoreComponent },
  { path: 'invalidUserlink', component: InvalidUserlinkComponent },
  { path: 'admin', component: AdminPanelComponent, canActivate: [authGuard] },
  { path: '**', component: LandingComponent },
];
