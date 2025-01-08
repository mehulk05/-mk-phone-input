import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { NgInternationalTelInputModule } from '../../../ng-international-tel-input/src/lib/ng-international-tel-input.module';
import { CountryISO, PhoneNumberFormat, SearchCountryField } from '../../../ng-international-tel-input/src/public-api';


@Component({
  selector: 'app-root',
  imports: [CommonModule,
    NgInternationalTelInputModule,
    ReactiveFormsModule,
    MatFormFieldModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mk-phone-input-test';

  separateDialCode = false;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	PhoneNumberFormat = PhoneNumberFormat;
	preferredCountries: CountryISO[] = [
		CountryISO.UnitedStates,
		CountryISO.UnitedKingdom,
	];
  myFormGroup = new FormGroup({
    phoneNumber: new FormControl({value: '', disabled: false}, [Validators.required]),
  });

  onSubmit(): void {

  }

  get phoneNumber(): FormControl {
    return this.myFormGroup.get('phoneNumber') as FormControl;
  }

  onBlur(e: any){
    console.log(e);
  }
}
