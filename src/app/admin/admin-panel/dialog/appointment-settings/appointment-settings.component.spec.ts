import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSettingsComponent } from './appointment-settings.component';

describe('AppointmentSettingsComponent', () => {
  let component: AppointmentSettingsComponent;
  let fixture: ComponentFixture<AppointmentSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
