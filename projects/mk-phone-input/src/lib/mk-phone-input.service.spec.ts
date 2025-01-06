import { TestBed } from '@angular/core/testing';

import { MkPhoneInputService } from './mk-phone-input.service';

describe('MkPhoneInputService', () => {
  let service: MkPhoneInputService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MkPhoneInputService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
