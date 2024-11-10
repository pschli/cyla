import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactDataComponent } from './add-contact-data.component';

describe('AddContactDataComponent', () => {
  let component: AddContactDataComponent;
  let fixture: ComponentFixture<AddContactDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddContactDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddContactDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
