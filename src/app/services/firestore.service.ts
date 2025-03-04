import { inject, Injectable } from '@angular/core';
import {
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

interface DurationPayload {
  duration: string;
  name: string;
}

interface TimeslotData {
  time: string;
  duration: string;
  reserved: boolean;
  blocked: boolean;
  taken: boolean;
  appointment?: {
    token: string | null;
  };
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  firestore = inject(Firestore);
  usersCollection?: CollectionReference;
  currentUid: string = '';

  constructor() {}

  async createUserBaseData(
    uid: string,
    email: string,
    firstname: string,
    lastname: string
  ) {
    if (!uid) return;
    this.currentUid = uid;
    try {
      await setDoc(doc(this.firestore, 'users', uid), {
        email: email,
        firstname: firstname,
        lastname: lastname,
        publiclink: '',
      });
    } catch (e) {
      console.error('Error saving user data:', e);
    }
  }

  async createTempLink(uid: string, publicLink: string) {
    if (!uid || !this.currentUid || uid !== this.currentUid) return;
    try {
      await updateDoc(doc(this.firestore, 'users', uid), {
        tempLink: publicLink,
      });
    } catch (e) {
      console.error('Error saving tempLink:', e);
    }
  }

  async saveSelected(dateData: any) {
    if (!this.currentUid) return;
    try {
      await setDoc(
        doc(this.firestore, 'data', this.currentUid, 'datesCol', dateData.date),
        dateData,
        { merge: true }
      );
      return 'OK';
    } catch (e) {
      return `Error saving Date data: ${e}`;
    }
  }

  async removeSelected(dateString: string) {
    if (!this.currentUid) return;
    const dateRef: DocumentReference = doc(
      this.firestore,
      'data',
      this.currentUid,
      'datesCol',
      dateString
    );
    try {
      await deleteDoc(dateRef);
    } catch (e) {
      console.error("Couldn't delete date.", e);
    }
  }

  async updateTimes(dateString: string, times: TimeslotData[]) {
    if (!this.currentUid) return;
    const dateRef: DocumentReference = doc(
      this.firestore,
      'data',
      this.currentUid,
      'datesCol',
      dateString
    );
    try {
      await updateDoc(dateRef, { times: times });
      return 'cancelled';
    } catch (e) {
      console.error("Couldn't delete date.", e);
      return 'error';
    }
  }

  async saveDuration(duration: string, payload: DurationPayload) {
    if (!this.currentUid) return;
    try {
      await setDoc(
        doc(this.firestore, 'data', this.currentUid, 'durationCol', duration),
        payload,
        { merge: true }
      );
      return 'OK';
    } catch (e) {
      return `Error saving Duration: ${e}`;
    }
  }

  async removeDuration(duration: string) {
    if (!this.currentUid) return;
    const dateRef: DocumentReference = doc(
      this.firestore,
      'data',
      this.currentUid,
      'durationCol',
      duration
    );
    try {
      await deleteDoc(dateRef);
    } catch (e) {
      console.error("Couldn't delete date.", e);
    }
  }
}
