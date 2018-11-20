import { TestBed, inject } from '@angular/core/testing';

import { VideomService } from './videom.service';

describe('VideomService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideomService]
    });
  });

  it('should be created', inject([VideomService], (service: VideomService) => {
    expect(service).toBeTruthy();
  }));
});
