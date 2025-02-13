import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakenWarningComponent } from './taken-warning.component';

describe('TakenWarningComponent', () => {
  let component: TakenWarningComponent;
  let fixture: ComponentFixture<TakenWarningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakenWarningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakenWarningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
