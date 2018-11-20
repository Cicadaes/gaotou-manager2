import { TestBed, inject } from '@angular/core/testing';

import { SerareaService } from './serarea.service';

describe('SerareaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SerareaService]
    });
  });

  it('should be created', inject([SerareaService], (service: SerareaService) => {
    expect(service).toBeTruthy();
  }));
});
