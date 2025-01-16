import { TestBed } from '@angular/core/testing';

import { DurationsService } from './durations.service';

describe('DurationsService', () => {
  let service: DurationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DurationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
