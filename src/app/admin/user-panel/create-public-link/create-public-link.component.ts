import { Component, inject, OnInit } from '@angular/core';
import {
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
import { lastValueFrom, Observable, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FirestoreService } from '../../../services/firestore.service';
import { Router } from '@angular/router';

type LinkResponse = 'error' | 'saved' | 'exists';

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
export class CreatePublicLinkComponent implements OnInit {
  userDates = inject(DateDataService);
  router = inject(Router);
  fs = inject(FirestoreService);
  linkResponse$: Observable<any> | null = null;
  linkResponseSub?: Subscription;
  regex = /^[a-zA-Z0-9_-]*$/;
  linkFormControl = new FormControl('', [
    Validators.pattern(this.regex),
    Validators.required,
  ]);

  matcher = new LinkErrorStateMatcher();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.linkResponseSub = this.linkResponse$?.subscribe((responses) => {
      console.log(responses);
    });
  }

  ngOnDestroy(): void {
    this.linkResponseSub?.unsubscribe();
  }

  generateLink() {
    const link = this.generateUID();
    this.linkFormControl.setValue(link);
  }

  async sendLink() {
    console.log(this.linkFormControl.value);
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
        console.log('error');
        break;
      case 'data saved':
        console.log('data saved');
        this.userDates.publicLink$.next(link);
        this.router.navigateByUrl('admin/overview');
        break;
      case 'link exists':
        console.log('link exists');
        break;
    }
  }

  generateUID(): string {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    return (
      array[0].toString(36).slice(0, 5).padStart(5, '0') +
      array[1].toString(36).slice(0, 5).padStart(5, '0')
    );
  }
}
