import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-invalid-userlink',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './invalid-userlink.component.html',
  styleUrl: './invalid-userlink.component.scss',
})
export class InvalidUserlinkComponent {}
