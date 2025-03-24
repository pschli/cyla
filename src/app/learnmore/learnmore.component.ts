import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ReadyToStartComponent } from './ready-to-start/ready-to-start.component';

@Component({
  selector: 'app-learnmore',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    ContactUsComponent,
    ReadyToStartComponent,
  ],
  templateUrl: './learnmore.component.html',
  styleUrl: './learnmore.component.scss',
})
export class LearnmoreComponent {}
