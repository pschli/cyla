import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseDurationComponent } from './choose-duration.component';

describe('ChooseDurationComponent', () => {
  let component: ChooseDurationComponent;
  let fixture: ComponentFixture<ChooseDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChooseDurationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChooseDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
