import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarCustomHeaderComponent } from './calendar-custom-header.component';

describe('CalendarCustomHeaderComponent', () => {
  let component: CalendarCustomHeaderComponent;
  let fixture: ComponentFixture<CalendarCustomHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarCustomHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarCustomHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
