import { Component } from '@angular/core';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  linkFormControl = new FormControl('', [Validators.required]);

  generateLink() {
    console.log('generate Link');
  }

  sendLink() {
    console.log('send Link');
  }
}
