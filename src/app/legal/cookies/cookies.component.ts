import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import * as cookies from '../../cookies';

@Component({
  selector: 'app-cookies',
  standalone: true,
  imports: [MatButtonModule, RouterLink, MatIconModule, MatTableModule],
  templateUrl: './cookies.component.html',
  styleUrl: './cookies.component.scss',
})
export class CookiesComponent {
  dataSource = cookies.COOKIE_DATA;
  displayedColumns: string[] = ['name', 'domain', 'description'];
}
