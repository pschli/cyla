import { Component } from '@angular/core';
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
  regex = /^[a-zA-Z0-9_-]*$/;
  linkFormControl = new FormControl('', [
    Validators.pattern(this.regex),
    Validators.required,
  ]);

  matcher = new LinkErrorStateMatcher();

  generateLink() {
    const link = this.generateUID();
    this.linkFormControl.setValue(link);
  }

  sendLink() {
    const link = this.linkFormControl.value;
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
