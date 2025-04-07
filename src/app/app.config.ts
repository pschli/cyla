import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { provideHttpClient } from '@angular/common/http';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './environment';
import {
  provideAppCheck,
  initializeAppCheck,
  ReCaptchaV3Provider,
} from '@angular/fire/app-check';
import { provideFunctions, getFunctions } from '@angular/fire/functions';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
    provideHttpClient(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFunctions(() => getFunctions()),
    provideAppCheck(() =>
      initializeAppCheck(getApp(), {
        provider: new ReCaptchaV3Provider(firebaseConfig.recaptchaSiteKey),
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
  ],
};
