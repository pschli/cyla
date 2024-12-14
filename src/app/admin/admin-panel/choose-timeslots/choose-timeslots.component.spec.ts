import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseTimeslotsComponent } from './choose-timeslots.component';

describe('ChooseTimeslotsComponent', () => {
  let component: ChooseTimeslotsComponent;
  let fixture: ComponentFixture<ChooseTimeslotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseTimeslotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseTimeslotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
