import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadyToStartComponent } from './ready-to-start.component';

describe('ReadyToStartComponent', () => {
  let component: ReadyToStartComponent;
  let fixture: ComponentFixture<ReadyToStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadyToStartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadyToStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
