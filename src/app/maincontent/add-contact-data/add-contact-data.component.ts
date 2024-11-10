import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-add-contact-data',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './add-contact-data.component.html',
  styleUrl: './add-contact-data.component.scss',
})
export class AddContactDataComponent {
  formData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
  });

  errorMessage = {
    email: '',
    firstname: '',
    lastname: '',
    address: '',
    postalcode: '',
    city: '',
  };

  @Output() contactDataValid = new EventEmitter<boolean>();

  updateErrorMessage(field: string) {
    if (field === 'email') {
      if (this.formData.controls.email.hasError('required')) {
        this.errorMessage.email = 'You must enter a value';
      } else if (this.formData.controls.email.hasError('email')) {
        this.errorMessage.email = 'Not a valid email';
      } else {
        this.errorMessage.email = '';
      }
    } else if (field === 'firstname') {
      if (this.formData.controls.firstname.hasError('required')) {
        this.errorMessage.firstname = 'You must enter a name';
      } else {
        this.errorMessage.firstname = '';
      }
    } else if (field === 'lastname') {
      if (this.formData.controls.lastname.hasError('required')) {
        this.errorMessage.lastname = 'You must enter a name';
      } else {
        this.errorMessage.lastname = '';
      }
    }
  }

  validateForm() {
    if (this.formData.valid) {
      console.log('form data is valid');
      this.contactDataValid.emit(true);
    } else {
      console.log('form data is not valid');
      this.contactDataValid.emit(false);
    }
  }
}
