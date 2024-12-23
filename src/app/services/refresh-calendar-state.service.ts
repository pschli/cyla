import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RefreshCalendarStateService {
  private refreshCounter$ = new BehaviorSubject<number>(0);

  constructor() {}

  public getTrigger(): Observable<number> {
    return this.refreshCounter$;
  }

  requestUpdate() {
    let count = this.refreshCounter$.value;
    this.refreshCounter$.next(count++ % 10);
  }
}
