import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TimeslotSavedHandlerService {
  private successReaction$ = new BehaviorSubject<number>(0);

  public getTrigger(): Observable<number> {
    return this.successReaction$;
  }

  requestAction() {
    this.successReaction$.next(1);
  }
}
