import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  private refreshCounter$ = new BehaviorSubject<number>(0);

  public getTrigger(): Observable<number> {
    return this.refreshCounter$;
  }

  requestUpdate() {
    this.refreshCounter$.next(1);
  }
}
