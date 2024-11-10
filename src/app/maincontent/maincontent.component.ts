import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormstepperComponent } from './formstepper/formstepper.component';

@Component({
  selector: 'app-maincontent',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [FormstepperComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './maincontent.component.html',
  styleUrl: './maincontent.component.scss',
})
export class MaincontentComponent {}
