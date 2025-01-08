import { TestBed } from '@angular/core/testing';

import { NgGooglePlacesAutocompleteService } from './ng-google-places-autocomplete.service';

describe('NgGooglePlacesAutocompleteService', () => {
  let service: NgGooglePlacesAutocompleteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgGooglePlacesAutocompleteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
