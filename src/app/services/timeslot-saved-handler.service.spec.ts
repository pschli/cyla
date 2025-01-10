import { TestBed } from '@angular/core/testing';

import { TimeslotSavedHandlerService } from './timeslot-saved-handler.service';

describe('TimeslotSavedHandlerService', () => {
  let service: TimeslotSavedHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimeslotSavedHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
