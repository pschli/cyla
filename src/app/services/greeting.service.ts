import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GreetingService {
  private greetingCounter$ = new BehaviorSubject<number>(0);

  public getTrigger(): Observable<number> {
    return this.greetingCounter$;
  }

  requestUpdate() {
    this.greetingCounter$.next(1);
  }

  requestReset() {
    this.greetingCounter$.next(0);
  }
}
