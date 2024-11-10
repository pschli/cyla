import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormstepperComponent } from './formstepper.component';

describe('FormstepperComponent', () => {
  let component: FormstepperComponent;
  let fixture: ComponentFixture<FormstepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormstepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormstepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
