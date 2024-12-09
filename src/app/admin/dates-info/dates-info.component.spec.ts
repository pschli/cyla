import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatesInfoComponent } from './dates-info.component';

describe('DatesInfoComponent', () => {
  let component: DatesInfoComponent;
  let fixture: ComponentFixture<DatesInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatesInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
