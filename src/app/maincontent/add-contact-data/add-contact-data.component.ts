import { Component, EventEmitter, inject, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AppointmentInfoService } from '../../services/appointment-info.service';

@Component({
  selector: 'app-add-contact-data',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: './add-contact-data.component.html',
  styleUrl: './add-contact-data.component.scss',
})
export class AddContactDataComponent {
  scheduledMeeting = inject(AppointmentInfoService);

  formData = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
  });

  errorMessage = {
    email: '',
    firstname: '',
    lastname: '',
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
      this.contactDataValid.emit(true);
      let name: string =
        this.formData.controls.firstname.value +
        ' ' +
        this.formData.controls.lastname.value;
      let email: string | null = this.formData.controls.email.value;
      if (email !== null) {
        this.sendContactData(name, email);
      }
    } else {
      this.contactDataValid.emit(false);
      this.sendContactData();
    }
  }

  sendContactData(name = '', email = '') {
    this.scheduledMeeting.data.name = name;
    this.scheduledMeeting.data.email = email;
  }
}
