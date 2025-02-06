import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateDataService } from '../../../services/date-data.service';
import { lastValueFrom, merge, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FirestoreService } from '../../../services/firestore.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export class LinkErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-create-public-link',
  standalone: true,
  imports: [
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
  templateUrl: './create-public-link.component.html',
  styleUrl: './create-public-link.component.scss',
})
export class CreatePublicLinkComponent {
  userDates = inject(DateDataService);
  router = inject(Router);
  fs = inject(FirestoreService);
  regex = /^[a-zA-Z0-9_-]*$/;
  linkFormControl = new FormControl('', [
    Validators.pattern(this.regex),
    Validators.required,
  ]);
  triedLinks: Array<string> = [];

  matcher = new LinkErrorStateMatcher();

  constructor(private http: HttpClient) {
    merge(this.linkFormControl.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.checkTriedLinks();
      });
  }

  generateLink() {
    const link = this.generateUID();
    this.linkFormControl.setValue(link);
  }

  async sendLink() {
    const link = this.linkFormControl.value;
    if (link) {
      let linkState = await this.sendPublicLink(link);
      this.handleResponse(linkState, link);
    }
  }

  async sendPublicLink(link: string) {
    let url = 'http://127.0.0.1:5001/cyla-d3d28/us-central1/linkidtotoken';
    let params = { idLink: link, uid: this.fs.currentUid };
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

  handleResponse(linkState: string, link: string) {
    switch (linkState) {
      case 'error':
        this.showDBErrorMessage();
        break;
      case 'data saved':
        console.log('data saved');
        this.userDates.publicLink$.next(link);
        this.router.navigateByUrl('admin/overview');
        break;
      case 'link exists':
        this.handleLinkExists(link);
        break;
    }
  }

  handleLinkExists(link: string) {
    this.triedLinks.push(link);
    this.checkTriedLinks();
  }

  checkTriedLinks() {
    if (this.triedLinks.length === 0 || !this.linkFormControl.value) return;
    if (this.triedLinks.includes(this.linkFormControl.value)) {
      this.setExistsError();
    } else {
      this.removeExistsError();
    }
  }

  setExistsError() {
    this.linkFormControl.setErrors({ 'exists already': true });
  }

  removeExistsError() {
    this.removeFormControlError(this.linkFormControl, 'too early');
  }

  showDBErrorMessage() {}

  generateUID(): string {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    return (
      array[0].toString(36).slice(0, 5).padStart(5, '0') +
      array[1].toString(36).slice(0, 5).padStart(5, '0')
    );
  }

  removeFormControlError(control: AbstractControl, errorName: string) {
    if (control?.errors && control?.errors[errorName]) {
      delete control.errors[errorName];
      if (Object.keys(control.errors).length === 0) {
        control.setErrors(null);
      }
    }
  }
}
