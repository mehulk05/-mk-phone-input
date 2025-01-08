import { TestBed } from '@angular/core/testing';

import { NgAgmCoreService } from './ng-agm-core.service';

describe('NgAgmCoreService', () => {
  let service: NgAgmCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgAgmCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
