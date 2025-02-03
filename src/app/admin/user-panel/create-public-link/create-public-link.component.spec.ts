import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePublicLinkComponent } from './create-public-link.component';

describe('CreatePublicLinkComponent', () => {
  let component: CreatePublicLinkComponent;
  let fixture: ComponentFixture<CreatePublicLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePublicLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePublicLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
