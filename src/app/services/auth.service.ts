import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  firebaseAuth = inject(Auth);

  constructor() {}

  register(
    email: string,
    password: string,
    firstname: string,
    lastname: string
  ): Observable<void> {
    let displayName = `${firstname} ${lastname}`;
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then((response) =>
      updateProfile(response.user, { displayName: displayName })
    );
    return from(promise);
  }
}
