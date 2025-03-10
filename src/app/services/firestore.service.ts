import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { from, lastValueFrom, map, Observable } from 'rxjs';

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
  userData$: Observable<DocumentData | null> | undefined;

  constructor(private http: HttpClient) {}

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

  async updateUserMail(email: string) {
    if (!this.currentUid) return 'error';
    try {
      await updateDoc(doc(this.firestore, 'users', this.currentUid), {
        email: email,
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
    this.userData$ = from(getDoc(UserDocRef)).pipe(
      map((docSnap) => (docSnap.exists() ? docSnap.data() : null))
    );
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

  async deleteUserData() {
    if (!this.currentUid) return;
    const dateRef: DocumentReference = doc(
      this.firestore,
      'data',
      this.currentUid
    );
    const userRef: DocumentReference = doc(
      this.firestore,
      'users',
      this.currentUid
    );
    try {
      await setDoc(dateRef, { markedForDelete: true });
      console.log('marking date data for delete');
      try {
        await deleteDoc(userRef);
        console.log('deleting user data');
        await this.sendDeleteRequest(this.currentUid);
      } catch (e) {
        console.error("Couldn't delete user data.", e);
      }
    } catch (e) {
      console.error("Couldn't delete dates.", e);
    }
  }

  private async sendDeleteRequest(uid: string) {
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/deleteUserData';
    let params = { uid: uid };
    try {
      const response: any = await lastValueFrom(
        this.http.get(url, { params, responseType: 'json' })
      );
      return response.response.toString();
    } catch (err) {
      console.error('Error:', err);
      return 'error';
    }
  }
}
