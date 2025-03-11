import { Component, Inject, OnInit } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SignupComponent } from '../signup/signup.component';
import { NgIf } from '@angular/common';
import {
  animate,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-login-container',
  standalone: true,
  imports: [LoginComponent, SignupComponent, NgIf],
  templateUrl: './login-container.component.html',
  styleUrl: './login-container.component.scss',
  animations: [
    trigger('paneChange', [
      transition('* => *', [
        query(':self', [
          style({
            height: '{{startHeight}}px',
            width: '{{startWidth}}px',
            overflow: 'hidden',
          }),
        ]),
        query(':enter', [style({ opacity: 0, scale: 0.9 })]),
        query(
          ':leave',
          [
            style({ opacity: 1, scale: 1 }),
            animate('0.2s ease-in', style({ opacity: 0, scale: 0.9 })),
          ],
          { optional: true }
        ),
        group(
          [
            query(':self', [
              animate('0.2s ease-in', style({ height: '*', width: '*' })),
            ]),
            query(':enter', [
              animate('0.2s ease-in', style({ opacity: 1, scale: 1 })),
            ]),
          ],
          { params: { startHeight: 0 } }
        ),
      ]),
    ]),
  ],
})
export class LoginContainerComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  changeDialogState(value: string) {
    this.data.state = value;
  }
}
