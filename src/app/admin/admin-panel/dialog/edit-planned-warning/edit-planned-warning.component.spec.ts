import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlannedWarningComponent } from './edit-planned-warning.component';

describe('EditPlannedWarningComponent', () => {
  let component: EditPlannedWarningComponent;
  let fixture: ComponentFixture<EditPlannedWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlannedWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlannedWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
