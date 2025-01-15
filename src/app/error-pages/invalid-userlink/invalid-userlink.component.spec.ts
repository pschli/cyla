import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvalidUserlinkComponent } from './invalid-userlink.component';

describe('InvalidUserlinkComponent', () => {
  let component: InvalidUserlinkComponent;
  let fixture: ComponentFixture<InvalidUserlinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvalidUserlinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvalidUserlinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
