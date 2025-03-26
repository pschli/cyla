import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { merge } from 'rxjs';

const errorMessages = {
  email: {
    required: 'Bitte E-Mail-Adresse angeben',
    pattern: 'Bitte eine gültige E-Mail-Adresse eingeben',
  },
  name: {
    required: 'Bitte Name angeben',
    pattern: 'Bitte gib Deinen Namen ein',
  },
  topic: {
    required: 'Bitte gib einen Betreff an',
  },
  message: {
    required: 'Bitte gib eine Nachricht ein',
  },
  legal: {
    required: 'Bitte erkläre dein Einverständnis zur Datenverarbeitung',
  },
} as const;

type ErrorCode = keyof typeof errorMessages;

type ErrorType<T extends ErrorCode> = keyof (typeof errorMessages)[T];

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  errorMessages = errorMessages;
  contactFormData = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.pattern(
        '[a-zA-Z0-9._%+-öäü]+@[a-zA-Z0-9._%+-öäü]+[.][a-zA-Z]{2,}'
      ),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
    ]),
    topic: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
    legal: new FormControl('', [Validators.required]),
  });

  errorMessage = {
    email: signal(''),
    name: signal(''),
    topic: signal(''),
    message: signal(''),
    legal: signal(''),
  };

  constructor() {
    merge(
      this.contactFormData.controls.email.statusChanges,
      this.contactFormData.controls.email.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('email'));
    merge(
      this.contactFormData.controls.name.statusChanges,
      this.contactFormData.controls.name.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('name'));
    merge(
      this.contactFormData.controls.topic.statusChanges,
      this.contactFormData.controls.topic.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('topic'));
    merge(
      this.contactFormData.controls.message.statusChanges,
      this.contactFormData.controls.message.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('message'));
    merge(
      this.contactFormData.controls.legal.statusChanges,
      this.contactFormData.controls.legal.valueChanges
    )
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage('legal'));
  }

  updateErrorMessage(errorCode: ErrorCode) {
    if (this.isBlanks(this.contactFormData.controls[errorCode])) {
      this.trimInput(this.contactFormData.controls[errorCode]);
    }
    let err = this.contactFormData.controls[errorCode].errors;
    if (err) {
      let errType = Object.keys(err)[0] as ErrorType<typeof errorCode>;
      if (errType in this.errorMessages[errorCode]) {
        this.errorMessage[errorCode].set(
          this.errorMessages[errorCode][errType]
        );
      }
    }
  }

  isBlanks(control: AbstractControl) {
    return control.value && control.value.trim().length === 0;
  }

  trimInput(control: AbstractControl) {
    control.setValue(control.value.trim());
  }
}
