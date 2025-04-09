import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CookiesService {
  private cookiesAllowed = false;
  constructor() {}

  setCookieConsent() {
    this.cookiesAllowed = true;
  }

  getCookieState() {
    return this.cookiesAllowed;
  }
}
