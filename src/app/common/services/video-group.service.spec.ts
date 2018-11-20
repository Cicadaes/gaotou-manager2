import { TestBed, inject } from '@angular/core/testing';

import { VideoGroupService } from './video-group.service';

describe('VideoGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VideoGroupService]
    });
  });

  it('should be created', inject([VideoGroupService], (service: VideoGroupService) => {
    expect(service).toBeTruthy();
  }));
});
