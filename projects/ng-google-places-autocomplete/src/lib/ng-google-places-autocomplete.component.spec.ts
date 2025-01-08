import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgGooglePlacesAutocompleteComponent } from './ng-google-places-autocomplete.component';

describe('NgGooglePlacesAutocompleteComponent', () => {
  let component: NgGooglePlacesAutocompleteComponent;
  let fixture: ComponentFixture<NgGooglePlacesAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NgGooglePlacesAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgGooglePlacesAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
