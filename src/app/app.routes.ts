import { Routes } from '@angular/router';
import { MaincontentComponent } from './maincontent/maincontent.component';
import { SuccessComponent } from './maincontent/success/success.component';

export const routes: Routes = [
  { path: '', component: MaincontentComponent },
  { path: 'success', component: SuccessComponent },
];
