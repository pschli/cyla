import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { collection, collectionData } from '@angular/fire/firestore';

interface DurationPayload {
  duration: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class DurationsService {
  fs = inject(FirestoreService);
  private durations$: Observable<DurationPayload[]>;

  constructor() {
    const DateCollection = collection(
      this.fs.firestore,
      `data/${this.fs.currentUid}/durationCol`
    );
    this.durations$ = collectionData(DateCollection) as Observable<any>;
  }

  getValues(): Observable<DurationPayload[]> {
    return this.durations$;
  }

  addValue(value: string, payload: DurationPayload) {
    this.fs.saveDuration(value, payload);
  }

  removeValue(value: string) {
    this.fs.removeDuration(value);
  }
}
