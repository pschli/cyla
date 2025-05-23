import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountDeletedComponent } from './account-deleted.component';

describe('AccountDeletedComponent', () => {
  let component: AccountDeletedComponent;
  let fixture: ComponentFixture<AccountDeletedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountDeletedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountDeletedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
