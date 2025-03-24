import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwSendComponent } from './pw-send.component';

describe('PwSendComponent', () => {
  let component: PwSendComponent;
  let fixture: ComponentFixture<PwSendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PwSendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwSendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
