import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DateAdapter } from '@angular/material/core';
import { ChooseTimeComponent } from './choose-time/choose-time.component';

@Component({
  selector: 'app-maincontent',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    ChooseTimeComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './maincontent.component.html',
  styleUrl: './maincontent.component.scss',
})
export class MaincontentComponent {
  selectableDates: Date[] = [
    new Date(2024, 9, 3), // 3. Oktober 2024
    new Date(2024, 9, 5), // 5. Oktober 2024
    new Date(2024, 9, 10), // 10. Oktober 2024
    new Date(2024, 9, 15), // 15. Oktober 2024
  ];

  myFilter = (d: Date | null): boolean => {
    if (!d) {
      return false;
    }
    const dateStr = d.toDateString();
    return this.selectableDates.some((date) => date.toDateString() === dateStr);
  };

  constructor(private dateAdapter: DateAdapter<Date>) {}

  ngOnInit(): void {
    //  this.dateAdapter.setLocale('de-DE');
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
  }

  /*
  myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }; */
}
