import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAGbaEoxgnaG927RB3piJD5d9OWMwONANA',
  authDomain: 'cyla-d3d28.firebaseapp.com',
  projectId: 'cyla-d3d28',
  storageBucket: 'cyla-d3d28.firebasestorage.app',
  messagingSenderId: '705817176054',
  appId: '1:705817176054:web:242993700aba99d7e0c9d7',
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
