import { inject, Injectable } from '@angular/core';
import {
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  Firestore,
  setDoc,
} from '@angular/fire/firestore';

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
      });
    } catch (e) {
      console.error('Error saving user data:', e);
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
    } catch (e) {
      console.error('Error saving Date data:', e);
    }
  }

  async removeSelected(dateString: string) {
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
}
