import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeslotDetailsComponent } from './timeslot-details.component';

describe('TimeslotDetailsComponent', () => {
  let component: TimeslotDetailsComponent;
  let fixture: ComponentFixture<TimeslotDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeslotDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeslotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
