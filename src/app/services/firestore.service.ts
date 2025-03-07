import { inject, Injectable } from '@angular/core';
import {
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, map } from 'rxjs';

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

  async updateUserName(firstname: string, lastname: string) {
    if (!this.currentUid) return 'error';
    try {
      await updateDoc(doc(this.firestore, 'users', this.currentUid), {
        firstname: firstname,
        lastname: lastname,
      });
      return 'success';
    } catch (e) {
      console.error('Error saving user data:', e);
      return 'error';
    }
  }

  getAccountData() {
    if (!this.currentUid) return;
    const UserDocRef = doc(this.firestore, 'users', this.currentUid);
    const userData$ = from(getDoc(UserDocRef)).pipe(
      map((docSnap) => (docSnap.exists() ? docSnap.data() : null))
    );
    return userData$;
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
