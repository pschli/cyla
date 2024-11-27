import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthDisplayComponent } from './month-display.component';

describe('MonthDisplayComponent', () => {
  let component: MonthDisplayComponent;
  let fixture: ComponentFixture<MonthDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
