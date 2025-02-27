import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DateDataService } from '../services/date-data.service';
import { DurationsService } from '../services/durations.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  providers: [DateDataService],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {}
