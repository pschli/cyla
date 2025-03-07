import { inject, Injectable, signal } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  user,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../interfaces/user.interface';
import { FirestoreService } from './firestore.service';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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

  async updateDisplayName(firstname: string) {
    try {
      const usercred = await updateProfile(this.auth.currentUser!, {
        displayName: firstname,
      });
      return 'success';
    } catch (err) {
      console.log(err);
      return 'error';
    }
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) => {
      this.fs.currentUid = response.user.uid;
    });
    return from(promise);
  }

  logout(): Observable<void> {
    this.fs.currentUid = '';
    this.greeting.requestReset();
    const promise = signOut(this.firebaseAuth).then(() => {
      this.router.navigateByUrl('');
    });
    return from(promise);
  }
}
