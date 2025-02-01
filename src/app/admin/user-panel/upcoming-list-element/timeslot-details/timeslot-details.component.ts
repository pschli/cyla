import { AsyncPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-timeslot-details',
  standalone: true,
  imports: [],
  templateUrl: './timeslot-details.component.html',
  styleUrl: './timeslot-details.component.scss',
})
export class TimeslotDetailsComponent {
  @Input() appointment!: {
    token: string | null;
    name?: string;
    email?: string;
  };
}
