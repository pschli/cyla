import { TestBed } from '@angular/core/testing';

import { AppointmentInfoService } from './appointment-info.service';

describe('AppointmentInfoService', () => {
  let service: AppointmentInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentInfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
