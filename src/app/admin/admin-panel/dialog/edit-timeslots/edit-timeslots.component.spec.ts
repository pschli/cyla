import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTimeslotsComponent } from './edit-timeslots.component';

describe('EditTimeslotsComponent', () => {
  let component: EditTimeslotsComponent;
  let fixture: ComponentFixture<EditTimeslotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTimeslotsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTimeslotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
