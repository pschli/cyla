import { TestBed } from '@angular/core/testing';

import { RefreshCalendarStateService } from './refresh-calendar-state.service';

describe('RefreshCalendarStateService', () => {
  let service: RefreshCalendarStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshCalendarStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
