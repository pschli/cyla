import { Routes } from '@angular/router';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { SuccessComponent } from './maincontent/success/success.component';
import { LandingComponent } from './landing/landing.component';
import { LearnmoreComponent } from './learnmore/learnmore.component';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'schedule', component: MaincontentComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'learnmore', component: LearnmoreComponent },
  { path: 'admin', component: AdminPanelComponent },
];
