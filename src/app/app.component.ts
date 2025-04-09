import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { routeTransitions } from './route-transitions';
import { FooterComponent } from './footer/footer.component';
import { CookiesService } from './legal/cookies.service';
import * as cookies from './cookies';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    MatTableModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'outline' },
    },
  ],
  animations: [routeTransitions],
})
export class AppComponent {
  cookieService = inject(CookiesService);
  cookiesAllowed = this.cookieService.getCookieState();
  showTable = false;
  dataSource = cookies.COOKIE_DATA;
  displayedColumns: string[] = ['name', 'domain', 'description'];

  constructor(protected route: ActivatedRoute) {}

  title = 'Cyla';

  cookieDetails() {
    console.log('Details');
    this.showTable = !this.showTable;
  }

  acceptCookies() {
    console.log('Zustimmung');
    this.cookieService.setCookieConsent();
    this.cookiesAllowed = true;
  }
}
