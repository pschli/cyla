import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingListElementComponent } from './upcoming-list-element.component';

describe('UpcomingListElementComponent', () => {
  let component: UpcomingListElementComponent;
  let fixture: ComponentFixture<UpcomingListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingListElementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
