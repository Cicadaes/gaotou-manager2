import { TestBed, inject } from '@angular/core/testing';

import { LimitService } from './limit.service';

describe('LimitService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LimitService]
    });
  });

  it('should be created', inject([LimitService], (service: LimitService) => {
    expect(service).toBeTruthy();
  }));
});
