import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  user,
  sendPasswordResetEmail,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';
import { FirestoreService } from './firestore.service';
import {
  AuthCredential,
  deleteUser,
  EmailAuthProvider,
  getAuth,
  onAuthStateChanged,
  verifyBeforeUpdateEmail,
} from 'firebase/auth';
import { Router } from '@angular/router';
import { GreetingService } from './greeting.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  router = inject(Router);
  firebaseAuth = inject(Auth);
  fs = inject(FirestoreService);
  greeting = inject(GreetingService);
  user$ = user(this.firebaseAuth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);
  auth = getAuth();

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.fs.currentUid = user.uid;
      } else {
        this.fs.currentUid = '';
      }
    });
  }

  register(
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      updateProfile(response.user, { displayName: firstname });
      this.fs.currentUid = response.user.uid;
      this.fs.createUserBaseData(response.user.uid, email, firstname, lastname);
    });
    return from(promise);
  }

  getCredentials(email: string, password: string): AuthCredential {
    return EmailAuthProvider.credential(email, password);
  }

  async updateDisplayName(firstname: string) {
    try {
      await updateProfile(this.auth.currentUser!, {
        displayName: firstname,
      });
      return 'success';
    } catch (err) {
      console.log(err);
      return 'error';
    }
  }

  async updateEmail(email: string): Promise<string> {
    try {
      await verifyBeforeUpdateEmail(this.auth.currentUser!, email);
      return 'success';
    } catch (err) {
      console.error('Error updating email:', err);
      return 'error';
    }
  }

  async updateUserPassword(password: string) {
    try {
      await updatePassword(this.auth.currentUser!, password);
      return 'success';
    } catch (err) {
      console.log(err);
      return 'error';
    }
  }

  async requestDeleteUser() {
    try {
      await deleteUser(this.auth.currentUser!);
      return 'success';
    } catch (err) {
      console.log(err);
      return 'error';
    }
  }

  passwordHelp(email: string) {
    const promise = sendPasswordResetEmail(this.firebaseAuth, email)
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      if (response.user.email) this.fs.updateUserMail(response.user.email);
      this.fs.currentUid = response.user.uid;
    });
    return from(promise);
  }

  logout(page: string = '') {
    this.fs.currentUid = '';
    this.greeting.requestReset();
    this.router.navigateByUrl(page);
    const promise = signOut(this.firebaseAuth);
  }
}
