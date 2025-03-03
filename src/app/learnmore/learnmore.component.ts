import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-learnmore',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './learnmore.component.html',
  styleUrl: './learnmore.component.scss',
})
export class LearnmoreComponent {}
