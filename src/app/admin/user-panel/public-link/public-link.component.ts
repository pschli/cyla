import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-public-link',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatIconButton],
  templateUrl: './public-link.component.html',
  styleUrl: './public-link.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class PublicLinkComponent {
  @Input() link: string = '';
  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  async copyLinkToClipboard() {
    const completeLink: string = 'https://cyla.de/schedule/' + this.link;
    try {
      await navigator.clipboard.writeText(completeLink);
      this._snackBar.open('In die Zwischenablage kopiert', 'OK', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
    }
  }
}
